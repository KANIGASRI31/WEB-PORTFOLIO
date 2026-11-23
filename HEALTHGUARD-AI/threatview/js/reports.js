/**
 * HealthGuard AI – reports.js (Healthcare Security Reports & HIPAA Compliance)
 * Depends on: mock-data.js, main.js
 */
(function () {
  'use strict';

  /* ─── Compute Stats ─── */
  function computeStats() {
    var vulns = MOCK.vulnerabilities;
    var scans = MOCK.scans;
    var counts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    vulns.forEach(function (v) { if (counts.hasOwnProperty(v.severity)) counts[v.severity]++; });

    var completedScans = scans.filter(function (s) { return s.status === 'completed'; });
    var affectedTargets = new Set(vulns.map(function (v) { return v.scanId; })).size;

    return {
      counts: counts,
      total: vulns.length,
      completedScans: completedScans.length,
      affectedTargets: affectedTargets
    };
  }

  /* ─── Populate Executive Summary ─── */
  function populateExecSummary(stats) {
    var el = document.getElementById('exec-summary');
    if (!el) return;

    var date = TV.formatDate(new Date().toISOString());
    el.innerHTML =
      '<p>' + escHtml(MOCK.reportData.executiveSummary) + '</p>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:1rem;margin-top:1.5rem">' +
        statBox('Total Vulns',  stats.total,             'var(--text-primary)') +
        statBox('Critical',     stats.counts.critical,   'var(--danger)') +
        statBox('High',         stats.counts.high,       'var(--warning)') +
        statBox('Medium',       stats.counts.medium,     '#fde047') +
        statBox('Low',          stats.counts.low,        'var(--accent-cyan)') +
        statBox('Scans Run',    stats.completedScans,    'var(--accent-green)') +
      '</div>' +
      '<p style="margin-top:1rem;font-size:0.8rem;color:var(--text-muted)">Report generated: ' + date + '</p>';
  }

  function statBox(label, value, color) {
    return '<div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:1.1rem;text-align:center">' +
      '<div style="font-size:1.8rem;font-weight:800;color:' + color + ';font-feature-settings:\'tnum\';letter-spacing:-0.03em">' + value + '</div>' +
      '<div style="font-size:0.68rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.09em;font-weight:700;margin-top:0.3rem">' + label + '</div>' +
    '</div>';
  }

  /* ─── HIPAA Compliance Table ─── */
  function populateHIPAATable() {
    var el = document.getElementById('hipaa-table');
    var badge = document.getElementById('hipaa-score');
    if (!el) return;
    var h = MOCK.reportData.hipaaCompliance;
    var pct = Math.round((h.compliant / h.total) * 100);
    if (badge) {
      badge.textContent = pct + '% Compliant (' + h.compliant + '/' + h.total + ')';
      badge.className = 'badge ' + (pct >= 80 ? 'badge--medium' : 'badge--high');
    }
    // Use the single source of truth from mock-data.js
    var controls = MOCK.reportData.hipaaControls || [];
    el.innerHTML = controls.map(function (c) {
      var compliant = c.status === 'compliant';
      return '<div class="hipaa-item">' +
        '<div>' +
          '<code style="font-size:0.75rem;color:var(--accent-cyan)">' + c.section + '</code>' +
          '<span style="margin-left:0.75rem;font-size:0.85rem">' + c.name + '</span>' +
          '<div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.2rem">' + c.detail + '</div>' +
        '</div>' +
        '<span class="badge ' + (compliant ? 'badge--low' : 'badge--high') + '">' + (compliant ? '✓ Compliant' : '✗ Non-Compliant') + '</span>' +
      '</div>';
    }).join('');
  }

  /* ─── Scan Selector ─── */
  function populateScanSelector() {
    var sel = document.getElementById('report-scan-select');
    if (!sel) return;
    var scans = (window.Store && Store.getScans ? Store.getScans() : null) || MOCK.scans;
    var completed = scans.filter(function(s){ return s.status === 'completed'; });
    completed.forEach(function(s) {
      var opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.targetName + ' — ' + s.type + ' scan (' + TV.formatDate(s.completedAt) + ')';
      sel.appendChild(opt);
    });
    sel.addEventListener('change', function(){ refreshReport(); });
  }

  function getSelectedScanId() {
    var sel = document.getElementById('report-scan-select');
    return sel ? sel.value : '';
  }

  window.refreshReport = function() {
    var scanId = getSelectedScanId();
    populateFindingsTable(scanId);
    var vulns = MOCK.vulnerabilities;
    if (scanId) vulns = vulns.filter(function(v){ return v.scanId === scanId; });
    var counts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    vulns.forEach(function(v){ if (counts.hasOwnProperty(v.severity)) counts[v.severity]++; });
    var ids = {};
    vulns.forEach(function(v){ ids[v.scanId] = 1; });
    var stats = {
      counts: counts,
      total: vulns.length,
      completedScans: MOCK.scans.filter(function(s){ return s.status === 'completed'; }).length,
      affectedTargets: Object.keys(ids).length
    };
    populateExecSummary(stats);
  };

  /* ─── Findings Table ─── */
  function populateFindingsTable(scanId) {
    var tbody = document.querySelector('#findings-table tbody');
    if (!tbody) return;

    var vulns = MOCK.vulnerabilities;
    if (scanId) {
      vulns = vulns.filter(function(v){ return v.scanId === scanId; });
    }
    tbody.innerHTML = vulns.map(function (v) {
      return '<tr>' +
        '<td><code style="font-size:0.75rem;color:var(--accent-cyan)">' + escHtml(v.cveId || 'N/A') + '</code></td>' +
        '<td>' + TV.severityBadge(v.severity) + '</td>' +
        '<td>' + (v.cvssScore !== null ? '<strong>' + v.cvssScore + '</strong>' : '—') + '</td>' +
        '<td>' + escHtml(v.service) + ' :' + (v.port || '—') + '</td>' +
        '<td>' + escHtml(v.title) + '</td>' +
        '<td style="font-size:0.8rem">' + escHtml(TV.truncateText(v.remediation, 80)) + '</td>' +
      '</tr>';
    }).join('');
  }

  /* ─── Risk Matrix (5×5) ─── */
  function populateRiskMatrix() {
    var table = document.getElementById('risk-matrix');
    if (!table) return;

    function cellColor(val) {
      if (val >= 20) return { bg: 'rgba(244,63,94,0.2)',   color: '#fb7185' };
      if (val >= 12) return { bg: 'rgba(245,158,11,0.18)', color: '#fbbf24' };
      if (val >= 6)  return { bg: 'rgba(253,224,71,0.12)', color: '#fde047' };
      if (val >= 3)  return { bg: 'rgba(0,200,240,0.1)',   color: '#00c8f0' };
      return           { bg: 'rgba(107,122,148,0.08)',  color: '#6b7a94' };
    }

    var impactLabels     = ['Very Low', 'Low', 'Medium', 'High', 'Critical'];
    var likelihoodLabels = ['Very High (5)', 'High (4)', 'Medium (3)', 'Low (2)', 'Very Low (1)'];
    // Standard 5×5 matrix: likelihood × impact
    var matrix = [
      [5, 10, 15, 20, 25],
      [4,  8, 12, 16, 20],
      [3,  6,  9, 12, 15],
      [2,  4,  6,  8, 10],
      [1,  2,  3,  4,  5]
    ];

    var html = '<thead><tr>';
    html += '<th style="background:var(--bg-surface);font-size:0.68rem;white-space:nowrap">Likelihood \\ Impact</th>';
    impactLabels.forEach(function (l) {
      html += '<th style="background:var(--bg-surface);font-size:0.68rem;text-align:center">' + l + '</th>';
    });
    html += '</tr></thead><tbody>';

    matrix.forEach(function (row, ri) {
      html += '<tr>';
      html += '<td style="font-size:0.73rem;font-weight:600;white-space:nowrap;background:var(--bg-surface);color:var(--text-muted)">' + likelihoodLabels[ri] + '</td>';
      row.forEach(function (val) {
        var c = cellColor(val);
        html += '<td style="background:' + c.bg + ';color:' + c.color + ';text-align:center;font-weight:800;font-size:0.95rem;letter-spacing:-0.02em">' + val + '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody>';
    table.innerHTML = html;
  }

  /* ─── Recommendations ─── */
  function populateRecommendations() {
    var list = document.getElementById('recommendations-list');
    if (!list) return;
    list.innerHTML = MOCK.reportData.recommendations.map(function (rec, i) {
      return '<li style="display:flex;gap:0.75rem;padding:0.75rem 0;border-bottom:1px solid var(--border-color)">' +
        '<span style="color:var(--accent-green);font-weight:700;flex-shrink:0">' + (i + 1).toString().padStart(2, '0') + '</span>' +
        '<span>' + escHtml(rec) + '</span>' +
      '</li>';
    }).join('');
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ─── Init ─── */
  document.addEventListener('DOMContentLoaded', function () {
    populateScanSelector();
    var stats = computeStats();
    populateExecSummary(stats);
    populateHIPAATable();
    populateFindingsTable();
    populateRiskMatrix();
    populateRecommendations();

    var exportBtn = document.getElementById('btn-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () { window.print(); });
    }

    // Sort findings table
    var table = document.getElementById('findings-table');
    if (table) {
      table.querySelectorAll('th[data-col]').forEach(function (th) {
        th.style.cursor = 'pointer';
        th.addEventListener('click', function () {
          TV.sortTable('findings-table', parseInt(th.getAttribute('data-col'), 10));
        });
      });
    }
  });

}());
