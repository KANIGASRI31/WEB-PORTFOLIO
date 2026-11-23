/**
 * HealthGuard AI – scanner.js (Network Reconnaissance & Vulnerability Assessment)
 * Depends on: mock-data.js, main.js
 */
(function () {
  'use strict';

  /* ─── State ─── */
  var scanInterval = null;
  var scanProgress = 0;
  var currentScanResults = [];
  var isScanning = false;
  var preferredTimeout = 0;

  /* ─── Populate Target Select ─── */
  function populateTargetSelect() {
    var sel = document.getElementById('scan-target');
    if (!sel) return;
    // Use Store.getTargets() so the dropdown reflects persisted assets
    var targets = (window.Store ? Store.getTargets() : MOCK.targets);
    targets.forEach(function (t) {
      var opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.name + ' (' + t.address + ')';
      sel.appendChild(opt);
    });
  }

  /* ─── Scan Status Text ─── */
  // Sets the #scan-status-text element content and a data-scan-state attribute.
  // Guards against missing element — returns early if not found.
  function setStatus(text, state) {
    var el = document.getElementById('scan-status-text');
    if (!el) return;
    el.textContent = text;
    el.setAttribute('data-scan-state', state);
  }

  /* ─── Timestamp for log ─── */
  function ts() {
    var now = new Date();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    return '[' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()) + ']';
  }

  /* ─── Append Log Line ─── */
  function appendLog(text, cls) {
    var log = document.getElementById('scan-log');
    if (!log) return;
    var line = document.createElement('span');
    line.className = 'log-line' + (cls ? ' log-line--' + cls : '');
    line.textContent = text;
    log.appendChild(line);
    log.appendChild(document.createTextNode('\n'));
    log.scrollTop = log.scrollHeight;
  }

  /* ─── Generate Log Line by Progress Phase ─── */
  function generateLogLine(progress, targetName, scanType) {
    var portLines = [
      ts() + ' Probing port 22/tcp (SSH)... open (OpenSSH 8.2p1)',
      ts() + ' Probing port 80/tcp (HTTP)... open (Apache 2.4.51)',
      ts() + ' Probing port 443/tcp (HTTPS)... open (TLS 1.3)',
      ts() + ' Probing port 3306/tcp (MySQL)... open (MySQL 8.0.32)',
      ts() + ' Probing port 104/tcp (DICOM)... open — UNAUTHENTICATED',
      ts() + ' Probing port 23/tcp (Telnet)... open — INSECURE SERVICE DETECTED',
      ts() + ' Probing port 161/udp (SNMP)... open (v1/v2c)',
      ts() + ' Probing port 8080/tcp (HTTP-Alt)... open',
      ts() + ' Probing port 21/tcp (FTP)... open — UNENCRYPTED',
      ts() + ' Host ' + targetName + ' is up (0.013s latency)',
      ts() + ' Starting healthcare network scan for ' + targetName
    ];
    var serviceLines = [
      ts() + ' Fingerprinting DICOM service on port 104...',
      ts() + ' Testing PACS/HL7 service configuration...',
      ts() + ' Checking medical device firmware version...',
      ts() + ' Banner grab on port 22: SSH-2.0-OpenSSH_8.2p1',
      ts() + ' Checking HIPAA-required security headers...',
      ts() + ' Testing EMR authentication mechanisms...',
      ts() + ' Enumerating IoMT device capabilities...',
      ts() + ' Testing DICOM AE Title authentication...',
      ts() + ' Checking HL7 FHIR API endpoints...'
    ];
    var vulnLines = [
      ts() + ' [VULN] CVE-2024-7712 — DICOM unauthenticated access CONFIRMED',
      ts() + ' [VULN] Default credentials detected on medical device',
      ts() + ' [WARN] Unencrypted PHI transmission detected on HTTP',
      ts() + ' [VULN] SQL injection probe on patient portal — POSITIVE',
      ts() + ' [WARN] Missing HIPAA audit logging on EMR service',
      ts() + ' [VULN] CVE-2025-0011 — Infusion pump API unauthenticated dosage change',
      ts() + ' [WARN] SNMP v1 with default community string "public"',
      ts() + ' [VULN] Telnet enabled with default credentials — CRITICAL',
      ts() + ' Running healthcare vulnerability checks (' + scanType + ' profile)...',
      ts() + ' [VULN] Patient data exposed in HTTP response headers'
    ];
    var finalLines = [
      ts() + ' Finalizing healthcare vulnerability assessment...',
      ts() + ' Correlating findings with HIPAA §164.312 requirements...',
      ts() + ' Calculating asset risk scores...',
      ts() + ' Generating HIPAA compliance report...'
    ];

    if (progress < 30)      return portLines[Math.floor(Math.random() * portLines.length)];
    else if (progress < 60) return serviceLines[Math.floor(Math.random() * serviceLines.length)];
    else if (progress < 90) return vulnLines[Math.floor(Math.random() * vulnLines.length)];
    else                    return finalLines[Math.floor(Math.random() * finalLines.length)];
  }

  /* ─── Update Progress UI ─── */
  function updateProgress(pct) {
    var bar = document.getElementById('scan-progress-bar');
    var label = document.getElementById('scan-progress-pct');
    if (bar)   bar.style.width = pct + '%';
    if (label) label.textContent = Math.round(pct) + '%';
  }

  /* ─── Clear Results Table ─── */
  function clearResultsTable() {
    var tbody = document.querySelector('#scan-results-table tbody');
    if (tbody) tbody.innerHTML = '';
  }

  /* ─── Append Result Row ─── */
  function appendResultRow(v) {
    var tbody = document.querySelector('#scan-results-table tbody');
    if (!tbody) return;
    var row = document.createElement('tr');
    row.innerHTML =
      '<td><code style="font-size:0.75rem;color:var(--accent-cyan)">' + escHtml(v.cveId || 'N/A') + '</code></td>' +
      '<td>' + TV.severityBadge(v.severity) + '</td>' +
      '<td>' + (v.cvssScore !== null ? v.cvssScore : '—') + '</td>' +
      '<td>' + escHtml(v.service) + '</td>' +
      '<td>' + (v.port !== null ? v.port : '—') + '</td>' +
      '<td title="' + escHtml(v.description) + '">' + escHtml(TV.truncateText(v.title, 60)) + '</td>' +
      '<td>' + escHtml(TV.truncateText(v.remediation, 60)) + '</td>';
    tbody.appendChild(row);
  }

  /* ─── Finalize Scan ─── */
  function finalizeScan() {
    var count = currentScanResults.length;
    appendLog(ts() + ' Scan complete. ' + count + ' findings discovered.', 'info');
    appendLog('─────────────────────────────────────────────', '');

    setStatus('Scan complete', 'completed');

    var resultsSection = document.getElementById('results-section');
    if (resultsSection) resultsSection.classList.add('visible');

    document.getElementById('results-count').textContent = count + ' findings';

    var notifPref = localStorage.getItem('tv-notif-scanComplete');
    if (notifPref !== 'false') {
      TV.showToast('Scan complete — ' + count + ' findings', 'success');
    }
    if (notifPref === 'true' && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try { new Notification('HealthGuard AI', { body: 'Scan complete — ' + count + ' findings', icon: '' }); } catch(e) {}
    }

    var critCount = currentScanResults.filter(function(v){ return v.severity === 'critical'; }).length;
    var critVulnPref = localStorage.getItem('tv-notif-critVulns');
    if (critVulnPref !== 'false' && critCount > 0) {
      TV.showToast(critCount + ' critical vulnerabilit' + (critCount === 1 ? 'y' : 'ies') + ' found', 'error');
    }

    var startBtn = document.getElementById('btn-start-scan');
    var stopBtn  = document.getElementById('btn-stop-scan');
    if (startBtn) { startBtn.disabled = false; startBtn.textContent = 'Start Scan'; }
    if (stopBtn)  { stopBtn.disabled = true; }
    isScanning = false;
  }

  /* ─── Start Scan ─── */
  function startScan() {
    if (isScanning) return;
    isScanning = true;
    scanProgress = 0;
    currentScanResults = [];
    clearResultsTable();

    var targetId = (document.getElementById('scan-target') || {}).value || '';
    // Use Store.getTargets() so scan targets reflect persisted assets
    var targets = (window.Store ? Store.getTargets() : MOCK.targets);
    var target = targets.find(function (t) { return t.id === targetId; }) || targets[0];
    var targetName = target ? target.name : 'unknown';

    var scanTypeEl = document.querySelector('input[name="scan-type"]:checked');
    var scanType = scanTypeEl ? scanTypeEl.value : 'full';

    setStatus('Preparing scan\u2026', 'preparing');

    // Show progress area
    var progressArea = document.getElementById('scan-progress-area');
    if (progressArea) progressArea.classList.add('visible');

    var resultsSection = document.getElementById('results-section');
    if (resultsSection) resultsSection.classList.remove('visible');

    var startBtn = document.getElementById('btn-start-scan');
    var stopBtn  = document.getElementById('btn-stop-scan');
    if (startBtn) { startBtn.disabled = true; startBtn.textContent = 'Scanning\u2026'; }
    if (stopBtn)  { stopBtn.disabled = false; }

    // Clear old log
    var log = document.getElementById('scan-log');
    if (log) log.innerHTML = '';

    appendLog(ts() + ' Starting ' + scanType + ' scan on ' + targetName + ' (' + (target ? target.address : '') + ')...', 'info');
    appendLog(ts() + ' Loading ' + scanType + ' scan profile...', '');

    updateProgress(0);

    var tickCount = 0;
    var totalTicks = preferredTimeout > 0
      ? Math.max(20, Math.round(preferredTimeout * 1000 / 400))
      : null;
    scanInterval = setInterval(function () {
      tickCount++;
      var advance = 2 + Math.random() * 5;
      scanProgress = Math.min(scanProgress + advance, 100);

      // Enforce timeout: force completion when tick limit is reached
      if (totalTicks !== null && tickCount >= totalTicks && scanProgress < 100) {
        scanProgress = 100;
      }

      updateProgress(scanProgress);

      // Update status text based on current phase thresholds
      if (scanProgress < 30) {
        setStatus('Probing ports\u2026', 'running');
      } else if (scanProgress < 60) {
        setStatus('Detecting services\u2026', 'running');
      } else if (scanProgress < 90) {
        setStatus('Checking vulnerabilities\u2026', 'running');
      } else {
        setStatus('Generating report\u2026', 'running');
      }

      // Emit log line ~every 2 ticks
      if (tickCount % 2 === 0 || Math.random() > 0.55) {
        var cls = '';
        var line = generateLogLine(scanProgress, targetName, scanType);
        if (line.includes('[VULN]')) cls = 'vuln';
        else if (line.includes('[WARN]')) cls = 'warn';
        else if (line.includes('[INFO]')) cls = 'info';
        appendLog(line, cls);
      }

      // Drip in a finding every ~15% of progress
      if (scanProgress % 15 < advance && Math.random() > 0.4) {
        var pool = MOCK.vulnerabilities;
        var v = pool[Math.floor(Math.random() * pool.length)];
        if (!currentScanResults.find(function (r) { return r.id === v.id; })) {
          currentScanResults.push(v);
          appendResultRow(v);
        }
      }

      if (scanProgress >= 100) {
        clearInterval(scanInterval);
        // Ensure at least a few results are shown
        if (currentScanResults.length < 3) {
          MOCK.vulnerabilities.slice(0, 5).forEach(function (v) {
            if (!currentScanResults.find(function (r) { return r.id === v.id; })) {
              currentScanResults.push(v);
              appendResultRow(v);
            }
          });
        }
        finalizeScan();
      }
    }, 400);
  }

  /* ─── Stop Scan ─── */
  function stopScan() {
    if (!isScanning) return;
    clearInterval(scanInterval);
    isScanning = false;
    appendLog(ts() + ' Scan stopped by user.', 'warn');
    setStatus('Scan cancelled by user', 'cancelled');
    var startBtn = document.getElementById('btn-start-scan');
    var stopBtn  = document.getElementById('btn-stop-scan');
    if (startBtn) { startBtn.disabled = false; startBtn.textContent = 'Start Scan'; }
    if (stopBtn)  { stopBtn.disabled = true; }
    updateProgress(scanProgress);
    TV.showToast('Scan stopped.', 'warning');
  }

  /* ─── Filter Results ─── */
  function filterResults() {
    var sevFilter  = (document.getElementById('res-sev-filter')  || {}).value || '';
    var svcFilter  = (document.getElementById('res-svc-filter')  || {}).value || '';
    var searchVal  = ((document.getElementById('res-search') || {}).value || '').toLowerCase();

    var filtered = currentScanResults.filter(function (v) {
      var matchSev = !sevFilter || v.severity === sevFilter;
      var matchSvc = !svcFilter || v.service  === svcFilter;
      var matchSrc = !searchVal || (v.title || '').toLowerCase().includes(searchVal) ||
                     (v.cveId || '').toLowerCase().includes(searchVal) ||
                     (v.description || '').toLowerCase().includes(searchVal);
      return matchSev && matchSvc && matchSrc;
    });

    clearResultsTable();
    filtered.forEach(appendResultRow);
    document.getElementById('results-count').textContent = filtered.length + ' findings';
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ─── Apply Scan Preferences from Settings ─── */
  function applyScanPreferences() {
    // Default scan type
    var scanType = localStorage.getItem('tv-scan-defaultScanType');
    if (scanType) {
      var radio = document.querySelector('input[name="scan-type"][value="' + scanType + '"]');
      if (radio) radio.checked = true;
    }

    // Scan timeout
    var timeout = localStorage.getItem('tv-scan-scanTimeout');
    if (timeout) {
      var t = parseInt(timeout, 10);
      if (t > 0) preferredTimeout = t;
    }

    // Version detection
    var verDet = localStorage.getItem('tv-scan-versionDetection');
    var verEl = document.getElementById('opt-version-detection');
    if (verEl && verDet !== null) {
      verEl.checked = (verDet === 'true');
    }

    // CVE correlation
    var cveCor = localStorage.getItem('tv-scan-cveCorrelation');
    var cveEl = document.getElementById('opt-cve-correlation');
    if (cveEl && cveCor !== null) {
      cveEl.checked = (cveCor === 'true');
    }
  }

  /* ─── Init ─── */
  document.addEventListener('DOMContentLoaded', function () {
    populateTargetSelect();
    applyScanPreferences();
    setStatus('Ready \u2014 select a target to begin', 'ready');

    var startBtn = document.getElementById('btn-start-scan');
    var stopBtn  = document.getElementById('btn-stop-scan');
    if (startBtn) startBtn.addEventListener('click', startScan);
    if (stopBtn)  stopBtn.addEventListener('click', stopScan);

    // Filter listeners
    ['res-sev-filter', 'res-svc-filter', 'res-search'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', filterResults);
    });

    // Sort headers
    var table = document.getElementById('scan-results-table');
    if (table) {
      table.querySelectorAll('th[data-col]').forEach(function (th) {
        th.style.cursor = 'pointer';
        th.addEventListener('click', function () {
          TV.sortTable('scan-results-table', parseInt(th.getAttribute('data-col'), 10));
        });
      });
    }
  });

}());
