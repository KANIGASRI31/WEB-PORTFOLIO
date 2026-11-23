/**
 * HealthGuard AI — ai-analysis.js
 * Module 2: AI Intrusion Detection & Attack Analysis
 */
(function () {
  'use strict';

  var monitorPaused = false;
  var monitorInterval = null;
  var monitorLines = [];
  var currentFindingId = null;

  /* ─── Behavior Events Pool ─── */
  var behaviorPool = [
    { cls: 'normal', msg: 'Normal DICOM query from WS-Radiology (192.168.30.10) to PACS-Server-01' },
    { cls: 'normal', msg: 'HL7 ADT message processed: patient admission event from ICU-Monitor-GW' },
    { cls: 'normal', msg: 'EMR login: nurse_user@nursing-dept authenticated via MFA' },
    { cls: 'normal', msg: 'HIS-Database backup job completed successfully' },
    { cls: 'warn',   msg: '[WARN] Unusual login time: admin@emr-server-01 at 02:34 AM' },
    { cls: 'warn',   msg: '[WARN] Multiple failed login attempts on HIS-Database-01 (12 attempts)' },
    { cls: 'alert',  msg: '[AI-ALERT] Anomalous outbound connection from Infusion-Pump-Ctrl → 185.220.101.45:4444' },
    { cls: 'alert',  msg: '[AI-ALERT] DICOM bulk query — 89 images retrieved in 30 seconds (baseline: 5/min)' },
    { cls: 'ai',     msg: '[AI] Behavioral deviation detected: EMR-Server-01 initiating port scan on internal subnet' },
    { cls: 'ai',     msg: '[AI] Correlated events: 3 failed logins → lateral movement pattern on 10.0.x.x subnet' },
    { cls: 'normal', msg: 'PACS archiving job: 1,024 images archived to long-term storage' },
    { cls: 'normal', msg: 'Lab-LIMS-Server: 45 lab results transmitted to EMR via HL7 interface' },
    { cls: 'warn',   msg: '[WARN] Cleartext FTP connection detected from WS-Nursing (192.168.30.20)' },
    { cls: 'alert',  msg: '[AI-ALERT] PowerShell execution chain detected on WS-Nursing — matches LockBit staging TTP' },
    { cls: 'ai',     msg: '[AI] Risk score update: Infusion-Pump-Ctrl elevated from HIGH to CRITICAL' },
    { cls: 'normal', msg: 'Firewall-Perimeter: blocked 47 inbound connection attempts from 185.220.101.45' },
    { cls: 'normal', msg: 'VPN-Gateway: remote access session started for user dr.johnson@hospital.local' },
    { cls: 'warn',   msg: '[WARN] SNMP v1 query from unknown host 10.10.10.99 on ICU-Monitor-GW' },
    { cls: 'ai',     msg: '[AI] Predicted lateral movement path: EMR-Server-01 → HIS-Database-01 (confidence: 79%)' },
    { cls: 'alert',  msg: '[AI-ALERT] Unauthenticated API call to /api/set-dosage on Infusion-Pump-Ctrl' }
  ];

  function ts() {
    var d = new Date();
    var p = function (n) { return String(n).padStart(2, '0'); };
    return '[' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) + ']';
  }

  /* ─── Render Stats ─── */
  function renderStats() {
    var el = document.getElementById('ai-stats');
    if (!el) return;
    var findings = MOCK.aiFindings;
    var active   = findings.filter(function (f) { return f.status === 'active'; }).length;
    var anomalies= findings.filter(function (f) { return f.type === 'anomaly'; }).length;
    var highRisk = findings.filter(function (f) { return f.riskScore >= 9; }).length;
    var avgConf  = Math.round(findings.reduce(function (a, f) { return a + f.confidence; }, 0) / findings.length);

    var stats = [
      { icon: '🤖', val: findings.length, label: 'Total AI Findings',  color: '' },
      { icon: '🚨', val: active,           label: 'Active Detections',  color: 'stat-card__value--danger' },
      { icon: '🔴', val: highRisk,         label: 'Risk Score ≥ 9.0',   color: 'stat-card__value--danger' },
      { icon: '📊', val: avgConf + '%',    label: 'Avg Confidence',     color: 'stat-card__value--green' }
    ];
    el.innerHTML = stats.map(function (s) {
      return '<div class="card card--stat">' +
        '<div class="stat-card__icon">' + s.icon + '</div>' +
        '<div class="stat-card__value ' + s.color + '">' + s.val + '</div>' +
        '<div class="stat-card__label">' + s.label + '</div>' +
      '</div>';
    }).join('');
  }

  /* ─── Attack Phases ─── */
  function renderAttackPhases() {
    var el = document.getElementById('attack-phases');
    if (!el) return;
    var phases = ['Initial Access', 'Execution', 'Lateral Movement', 'Command & Control', 'Exfiltration', 'Impact'];
    var counts = phases.reduce(function (acc, p) { acc[p] = 0; return acc; }, {});
    MOCK.aiFindings.forEach(function (f) { if (counts.hasOwnProperty(f.attackPhase)) counts[f.attackPhase]++; });
    var max = Math.max.apply(null, Object.values(counts)) || 1;
    el.innerHTML = phases.map(function (phase) {
      var count = counts[phase] || 0;
      var pct   = Math.round((count / max) * 100);
      var cls   = count >= 2 ? 'attack-phase__bar--danger' : count === 1 ? 'attack-phase__bar--warning' : '';
      return '<div class="attack-phase">' +
        '<div class="attack-phase__bar-wrap">' +
          '<div class="attack-phase__bar ' + cls + '" style="height:' + Math.max(pct, 8) + '%"></div>' +
        '</div>' +
        '<div class="attack-phase__count">' + count + '</div>' +
        '<div class="attack-phase__label">' + phase + '</div>' +
      '</div>';
    }).join('');
  }

  /* ─── AI Findings ─── */
  var typeIcons = { anomaly: '🔴', correlation: '🔗', pattern: '📊', prediction: '🔮' };

  function renderFindings(findings) {
    var container = document.getElementById('ai-findings-container');
    if (!container) return;
    if (!findings.length) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">🤖</div><p>No AI findings match the current filters.</p></div>';
      return;
    }
    container.innerHTML = findings.map(function (f) {
      var riskBadge = f.riskScore >= 9 ? 'badge--critical' : f.riskScore >= 7 ? 'badge--high' : 'badge--medium';
      return '<div class="ai-finding-card ai-finding-card--' + f.status + '" ' +
        'onclick="showFinding(\'' + f.id + '\')" ' +
        'role="button" tabindex="0" ' +
        'onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();showFinding(\'' + f.id + '\');}" ' +
        'aria-label="' + f.title + ', risk score ' + f.riskScore + ', ' + f.status + '">' +
        '<div class="ai-finding-header">' +
          '<span class="ai-finding-icon">' + (typeIcons[f.type] || '🤖') + '</span>' +
          '<div style="flex:1">' +
            '<div class="ai-finding-title">' + f.title + '</div>' +
            '<div class="ai-finding-meta">' +
              '<span class="badge ' + riskBadge + '">Risk ' + f.riskScore + '</span>' +
              '<span class="confidence-chip">AI Confidence: ' + f.confidence + '%</span>' +
              '<span class="badge badge--info">' + f.type + '</span>' +
              '<span class="badge badge--info">' + f.attackPhase + '</span>' +
              '<span style="margin-left:auto">' + TV.formatDateTime(f.timestamp) + '</span>' +
            '</div>' +
          '</div>' +
          '<span class="badge ' + (f.status === 'active' ? 'badge--critical' : f.status === 'resolved' ? 'badge--low' : 'badge--high') + '">' + f.status.toUpperCase() + '</span>' +
        '</div>' +
        '<div class="ai-finding-description">' + f.description + '</div>' +
        '<div class="ai-finding-assets">' +
          f.relatedAssets.map(function (a) { return '<span class="badge badge--info">🏥 ' + a + '</span>'; }).join('') +
        '</div>' +
      '</div>';
    }).join('');
  }

  function applyFilters() {
    var status = document.getElementById('filter-ai-status').value;
    var type   = document.getElementById('filter-ai-type').value;
    var filtered = MOCK.aiFindings.filter(function (f) {
      return (!status || f.status === status) && (!type || f.type === type);
    });
    renderFindings(filtered);
  }

  /* ─── Finding Detail Modal ─── */
  window.showFinding = function (id) {
    currentFindingId = id;
    var f = MOCK.aiFindings.find(function (x) { return x.id === id; });
    if (!f) return;
    document.getElementById('finding-modal-title').textContent = (typeIcons[f.type] || '🤖') + ' ' + f.title;
    var riskBadge = f.riskScore >= 9 ? 'badge--critical' : f.riskScore >= 7 ? 'badge--high' : 'badge--medium';
    document.getElementById('finding-modal-body').innerHTML =
      '<div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:1rem">' +
        '<span class="badge ' + riskBadge + '">Risk Score: ' + f.riskScore + '</span>' +
        '<span class="confidence-chip">Confidence: ' + f.confidence + '%</span>' +
        '<span class="badge badge--info">Type: ' + f.type + '</span>' +
        '<span class="badge badge--info">Phase: ' + f.attackPhase + '</span>' +
        '<span class="badge ' + (f.status === 'active' ? 'badge--critical' : 'badge--info') + '">' + f.status.toUpperCase() + '</span>' +
      '</div>' +
      '<div style="margin-bottom:0.75rem"><div class="card__title">Detected</div><div>' + TV.formatDateTime(f.timestamp) + '</div></div>' +
      '<div style="margin-bottom:0.75rem"><div class="card__title">AI Finding Description</div>' +
        '<p style="margin-top:0.4rem">' + f.description + '</p>' +
      '</div>' +
      '<div style="margin-bottom:0.75rem"><div class="card__title">Affected Assets</div>' +
        '<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:0.4rem">' +
          f.relatedAssets.map(function (a) { return '<span class="badge badge--info">🏥 ' + a + '</span>'; }).join('') +
        '</div>' +
      '</div>' +
      '<div style="padding:0.75rem;background:rgba(255,51,102,0.06);border-radius:6px;border:1px solid rgba(255,51,102,0.2)">' +
        '<div class="card__title" style="color:var(--danger);margin-bottom:0.4rem">⚠ Healthcare Impact Assessment</div>' +
        '<p style="margin:0;font-size:0.85rem">' + getHealthcareImpact(f) + '</p>' +
      '</div>';
    document.getElementById('finding-modal').classList.add('modal--open');
  };

  function getHealthcareImpact(f) {
    var impacts = {
      'ai001': 'Ransomware can encrypt patient records, disrupting EMR access and delaying critical care. HIPAA breach notification may be required.',
      'ai002': 'Unauthorized access to patient imaging data constitutes a HIPAA breach. 1,247 patients potentially affected. Mandatory 60-day breach notification applies.',
      'ai003': 'CRITICAL PATIENT SAFETY RISK: Unauthorized dosage changes on infusion pumps can cause patient harm or death. Immediate clinical review required.',
      'ai004': 'Database compromise exposes all patient PHI. Hospital information system downtime possible. HIPAA §164.312 breach likely.',
      'ai005': 'Phishing can lead to credential theft giving attackers access to EMR/PACS. Staff awareness and MFA enforcement required.',
      'ai006': 'Medical device C2 communication may indicate compromise. Device clinical reliability at risk.',
      'ai007': 'Lateral movement to HIS database would expose complete patient records. Immediate network segmentation required.'
    };
    return impacts[f.id] || 'This finding may impact patient data confidentiality or clinical system availability. Full impact assessment recommended.';
  }

  window.closeFindingModal = function () {
    document.getElementById('finding-modal').classList.remove('modal--open');
  };

  /* ─── Create Incident from AI Finding ─── */
  window.openCreateIncidentFromFinding = function () {
    var f = MOCK.aiFindings.find(function (x) { return x.id === currentFindingId; });
    if (!f) {
      TV.showToast('No finding selected.', 'warning');
      return;
    }
    document.getElementById('ci-title').value = f.title;
    var sev = f.riskScore >= 9 ? 'critical' : f.riskScore >= 7 ? 'high' : f.riskScore >= 5 ? 'medium' : 'low';
    document.getElementById('ci-severity').value = sev;
    document.getElementById('ci-status').value = 'active';
    document.getElementById('ci-asset').value = (f.relatedAssets && f.relatedAssets[0]) ? f.relatedAssets[0] : '';
    document.getElementById('ci-description').value = f.description;
    document.getElementById('ci-attack-type').value = 'AI Anomaly Detection';
    closeFindingModal();
    document.getElementById('create-incident-modal').classList.add('modal--open');
  };

  window.closeCreateIncidentModal = function () {
    document.getElementById('create-incident-modal').classList.remove('modal--open');
  };

  window.submitCreateIncident = function () {
    var titleVal  = (document.getElementById('ci-title').value       || '').trim();
    var sevVal    = document.getElementById('ci-severity').value     || 'medium';
    var statusVal = document.getElementById('ci-status').value       || 'active';
    var assetVal  = (document.getElementById('ci-asset').value       || '').trim();
    var descVal   = (document.getElementById('ci-description').value || '').trim();
    var atVal     = document.getElementById('ci-attack-type').value  || 'AI Anomaly Detection';

    if (!titleVal) {
      TV.showToast('Incident title is required.', 'warning');
      return;
    }

    var f = MOCK.aiFindings.find(function (x) { return x.id === currentFindingId; });
    var affectedAssets = (f && f.relatedAssets) ? f.relatedAssets.slice() : (assetVal ? [assetVal] : []);

    var incident = {
      id:             'inc' + Date.now(),
      title:          titleVal,
      severity:       sevVal,
      status:         statusVal,
      assetId:        '',
      assetName:      assetVal || (affectedAssets[0] || ''),
      detectedAt:     new Date().toISOString(),
      description:    descVal || titleVal,
      affectedAssets: affectedAssets,
      attackType:     atVal,
      timeline: [
        'Incident created from AI Finding ' + (currentFindingId || 'unknown') +
        ' at ' + new Date().toLocaleString()
      ],
      remediation: ['Review AI finding details and investigate affected assets.']
    };

    var saved = Store.saveIncident(incident);
    if (!saved) {
      TV.showToast('Failed to save incident.', 'error');
      return;
    }

    closeCreateIncidentModal();
    TV.showToast('Incident created. Redirecting to Incidents\u2026', 'success');
    setTimeout(function () {
      window.location.href = 'incidents.html';
    }, 1200);
  };

  /* ─── Behavior Monitor ─── */
  function startMonitor() {
    var feed = document.getElementById('behavior-feed');
    if (!feed) return;

    function addLine() {
      if (monitorPaused) return;
      var evt = behaviorPool[Math.floor(Math.random() * behaviorPool.length)];
      var span = document.createElement('span');
      span.className = 'behavior-line behavior-line--' + evt.cls;
      span.textContent = ts() + ' ' + evt.msg;
      feed.appendChild(span);
      feed.appendChild(document.createTextNode('\n'));
      monitorLines.push(span);
      if (monitorLines.length > 60) {
        var old = monitorLines.shift();
        if (old.parentNode) old.parentNode.removeChild(old);
      }
      feed.scrollTop = feed.scrollHeight;
    }

    addLine();
    monitorInterval = setInterval(addLine, 1800);
  }

  /* ─── Init ─── */
  document.addEventListener('DOMContentLoaded', function () {
    renderStats();
    renderAttackPhases();
    renderFindings(MOCK.aiFindings);

    document.getElementById('filter-ai-status').addEventListener('change', applyFilters);
    document.getElementById('filter-ai-type').addEventListener('change', applyFilters);

    document.getElementById('btn-toggle-monitor').addEventListener('click', function () {
      monitorPaused = !monitorPaused;
      this.textContent = monitorPaused ? '▶ Resume' : '⏸ Pause';
    });

    document.getElementById('finding-modal').addEventListener('click', function (e) {
      if (e.target === this) closeFindingModal();
    });

    document.getElementById('create-incident-modal').addEventListener('click', function (e) {
      if (e.target === this) closeCreateIncidentModal();
    });

    startMonitor();
    TV.showToast('AI Engine: ' + MOCK.aiFindings.filter(function (f) { return f.status === 'active'; }).length + ' active detections', 'error');
  });

}());
