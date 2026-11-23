/**
 * HealthGuard AI — dashboard.js
 * Depends on: mock-data.js, main.js, Chart.js CDN
 */
(function () {
  'use strict';

  if (typeof Chart !== 'undefined') {
    Chart.defaults.color = '#6b7a94';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.tooltip.backgroundColor = '#0e1628';
    Chart.defaults.plugins.tooltip.borderColor = '#1e2d4a';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.titleColor = '#e8edf5';
    Chart.defaults.plugins.tooltip.bodyColor = '#b0bccc';
  }

  /* ─── Compute Summary Stats ─── */
  function computeStats() {
    var vulns     = MOCK.vulnerabilities;
    // Use Store for incidents so we reflect any user changes persisted in localStorage
    var incidents = (window.Store ? Store.getIncidents() : MOCK.incidents);
    var iocs      = MOCK.iocs;
    var aiFinds   = MOCK.aiFindings;
    var assets    = MOCK.targets;
    var hipaa     = MOCK.reportData.hipaaCompliance;

    var totalAssets     = assets.length;
    // Stat card: strictly 'active' incidents (not investigating)
    // Banner uses active+investigating (see renderAlertBanner comment below)
    var activeIncidents = incidents.filter(function (i) { return i.status === 'active'; }).length;
    var totalVulns      = vulns.length;
    var criticalVulns   = vulns.filter(function (v) { return v.severity === 'critical'; }).length;
    var activeAI        = aiFinds.filter(function (a) { return a.status === 'active'; }).length;
    var criticalIOCs    = iocs.filter(function (i) { return i.severity === 'critical' || i.severity === 'high'; }).length;
    var hipaaScore      = Math.round((hipaa.compliant / hipaa.total) * 100) + '%';

    var scored = vulns.filter(function (v) { return v.cvssScore !== null; });
    var avgCVSS = scored.length
      ? Math.round(scored.reduce(function (s, v) { return s + v.cvssScore; }, 0) / scored.length * 10) / 10
      : 0;

    return { totalAssets: totalAssets, activeIncidents: activeIncidents, totalVulns: totalVulns, criticalVulns: criticalVulns, activeAI: activeAI, criticalIOCs: criticalIOCs, hipaaScore: hipaaScore, avgCVSS: avgCVSS };
  }

  function populateStatCards(s) {
    function animateCount(el, target) {
      var start = 0;
      var isFloat = String(target).includes('.');
      var duration = 900;
      var step = duration / 60;
      var increment = target / (duration / step);
      var current = 0;
      var timer = setInterval(function () {
        current = Math.min(current + increment, target);
        el.textContent = isFloat ? current.toFixed(1) : Math.round(current);
        if (current >= target) clearInterval(timer);
      }, step);
    }
    function setText(id, val) {
      var el = document.getElementById(id);
      if (!el) return;
      var valEl = el.querySelector('.stat-card__value');
      if (!valEl) return;
      var num = parseFloat(String(val).replace('%',''));
      if (!isNaN(num) && String(val).includes('%')) {
        animateCount(valEl, num);
        setTimeout(function(){ valEl.textContent = val; }, 950);
      } else if (!isNaN(num)) {
        animateCount(valEl, num);
      } else {
        valEl.textContent = val;
      }
    }
    setText('stat-assets',          s.totalAssets);
    setText('stat-active-incidents', s.activeIncidents);
    setText('stat-vulns',            s.totalVulns);
    setText('stat-critical-vulns',   s.criticalVulns);
    setText('stat-ai-findings',      s.activeAI);
    setText('stat-risk-score',       s.avgCVSS);
    setText('stat-hipaa',            s.hipaaScore);
    setText('stat-ioc',              s.criticalIOCs);
  }

  /* ─── Severity Chart ─── */
  function getSeverityCounts() {
    var c = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    MOCK.vulnerabilities.forEach(function (v) { if (c.hasOwnProperty(v.severity)) c[v.severity]++; });
    return c;
  }

  function initSeverityChart(counts) {
    var ctx = document.getElementById('severity-chart');
    if (!ctx || typeof Chart === 'undefined') return;
    ctx.setAttribute('role', 'img');
    ctx.setAttribute('aria-label', 'Severity distribution: ' + counts.critical + ' critical, ' + counts.high + ' high, ' + counts.medium + ' medium, ' + counts.low + ' low, ' + counts.info + ' info findings');
    new Chart(ctx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Critical', 'High', 'Medium', 'Low', 'Info'],
        datasets: [{
          data: [counts.critical, counts.high, counts.medium, counts.low, counts.info],
          backgroundColor: [
            'rgba(244,63,94,0.85)',
            'rgba(245,158,11,0.85)',
            'rgba(253,224,71,0.85)',
            'rgba(0,200,240,0.85)',
            'rgba(107,122,148,0.6)'
          ],
          borderColor: '#0e1628',
          borderWidth: 3,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#6b7a94',
              padding: 14,
              font: { size: 11, weight: '600' },
              usePointStyle: true,
              pointStyleWidth: 8
            }
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                var total = ctx.dataset.data.reduce(function (a, b) { return a + b; }, 0);
                var pct = total ? Math.round(ctx.raw / total * 100) : 0;
                return '  ' + ctx.label + ': ' + ctx.raw + '  (' + pct + '%)';
              }
            }
          }
        }
      }
    });
  }

  /* ─── Trend Chart ─── */
  function initTrendChart() {
    var ctx = document.getElementById('trend-chart');
    if (!ctx || typeof Chart === 'undefined') return;
    ctx.setAttribute('role', 'img');
    ctx.setAttribute('aria-label', '6-month vulnerability trend chart showing critical, high, medium, and low severity counts from May to October');
    new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: {
        labels: MOCK.trendData.labels,
        datasets: [
          { label: 'Critical', data: MOCK.trendData.critical, borderColor: '#f43f5e', backgroundColor: 'rgba(244,63,94,0.1)',  tension: 0.4, fill: true,  pointRadius: 4, pointHoverRadius: 7, pointBackgroundColor: '#f43f5e', borderWidth: 2 },
          { label: 'High',     data: MOCK.trendData.high,     borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.06)', tension: 0.4, fill: false, pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: '#f59e0b', borderWidth: 1.5 },
          { label: 'Medium',   data: MOCK.trendData.medium,   borderColor: '#fde047', backgroundColor: 'rgba(253,224,71,0.05)', tension: 0.4, fill: false, pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: '#fde047', borderWidth: 1.5 },
          { label: 'Low',      data: MOCK.trendData.low,      borderColor: '#00c8f0', backgroundColor: 'rgba(0,200,240,0.05)',  tension: 0.4, fill: false, pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: '#00c8f0', borderWidth: 1.5 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: {
              color: '#6b7a94',
              padding: 16,
              font: { size: 11, weight: '600' },
              usePointStyle: true,
              pointStyleWidth: 8
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#6b7a94', font: { size: 11 } },
            grid:  { color: 'rgba(22,32,53,0.8)', drawBorder: false }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#6b7a94', font: { size: 11 } },
            grid:  { color: 'rgba(22,32,53,0.8)', drawBorder: false }
          }
        }
      }
    });
  }

  /* ─── Alert Banner ─── */
  // Banner counts: status === 'active' OR status === 'investigating'
  // These are the 'needs attention' group — any incident that is not yet resolved.
  // NOTE: The stat card for Active Incidents counts ONLY status === 'active'.
  //       This is intentional: banner = active+investigating (needs attention);
  //       stat = strictly active (currently in crisis, not yet triaged).
  function renderAlertBanner() {
    var container = document.getElementById('alert-banner-container');
    if (!container) return;

    var incidents = (window.Store ? Store.getIncidents() : MOCK.incidents);
    // Banner group: active OR investigating
    var needsAttention = incidents.filter(function (i) {
      return i.status === 'active' || i.status === 'investigating';
    });

    if (!needsAttention.length) {
      container.innerHTML = '';
      return;
    }

    // Show up to 3 titles in the banner
    var shown = needsAttention.slice(0, 3);
    var titleList = shown.map(function (i) { return i.title; }).join(' &bull; ');
    var remainder = needsAttention.length > 3 ? ' and ' + (needsAttention.length - 3) + ' more' : '';

    container.innerHTML =
      '<div class="alert-banner alert-banner--critical">' +
        '<span class="alert-banner__icon">🚨</span>' +
        '<div class="alert-banner__content">' +
          '<strong>' + needsAttention.length + ' ACTIVE/INVESTIGATING INCIDENT' + (needsAttention.length !== 1 ? 'S' : '') + '</strong> &mdash; ' +
          titleList + remainder + '. Immediate action required.' +
        '</div>' +
        '<a href="incidents.html" class="btn btn--danger btn--sm">View Incidents &rarr;</a>' +
      '</div>';
  }

  /* ─── Active Incidents ─── */
  function renderActiveIncidents() {
    var container = document.getElementById('active-incidents-list');
    if (!container) return;
    // Use Store for incidents so dashboard reflects persisted changes
    var incidents = (window.Store ? Store.getIncidents() : MOCK.incidents);
    var active = incidents.filter(function (i) { return i.status === 'active' || i.status === 'investigating'; }).slice(0, 4);
    if (!active.length) { container.innerHTML = '<p class="text-muted" style="padding:1rem">No active incidents.</p>'; return; }
    container.innerHTML = active.map(function (inc) {
      var time = TV.formatDateTime(inc.detectedAt);
      return '<div class="incident-item">' +
        '<span class="status-dot status-dot--' + (inc.status === 'active' ? 'failed' : 'in-progress') + '" style="margin-top:4px;flex-shrink:0"></span>' +
        '<div style="flex:1">' +
          '<div class="incident-item__title">' + inc.title + '</div>' +
          '<div class="incident-item__meta">' +
            TV.severityBadge(inc.severity) +
            '<span>' + inc.assetName + '</span>' +
            '<span>' + time + '</span>' +
          '</div>' +
        '</div>' +
        '<a href="incidents.html" class="btn btn--ghost btn--sm">→</a>' +
      '</div>';
    }).join('');
  }

  /* ─── AI Findings ─── */
  function renderAIFindings() {
    var container = document.getElementById('ai-findings-list');
    if (!container) return;
    var active = MOCK.aiFindings.filter(function (a) { return a.status === 'active'; }).slice(0, 4);
    if (!active.length) { container.innerHTML = '<p class="text-muted" style="padding:1rem">No active AI detections.</p>'; return; }
    container.innerHTML = active.map(function (f) {
      return '<div class="ai-finding-item">' +
        '<span style="font-size:1.2rem;flex-shrink:0;">🤖</span>' +
        '<div style="flex:1">' +
          '<div class="incident-item__title">' + f.title + '</div>' +
          '<div class="incident-item__meta">' +
            '<span class="ai-finding-item__confidence">Confidence: ' + f.confidence + '%</span>' +
            TV.severityBadge(f.riskScore >= 9 ? 'critical' : f.riskScore >= 7 ? 'high' : 'medium') +
            '<span>' + f.attackPhase + '</span>' +
          '</div>' +
        '</div>' +
        '<a href="ai-analysis.html" class="btn btn--ghost btn--sm">→</a>' +
      '</div>';
    }).join('');
  }

  /* ─── Activity Feed ─── */
  function renderActivityFeed() {
    var list = document.getElementById('activity-list');
    if (!list) return;
    list.innerHTML = MOCK.activityFeed.slice(0, 5).map(function (item) {
      return '<li class="activity-item">' +
        '<span class="activity-item__dot activity-item__dot--' + item.severity + '"></span>' +
        '<div class="activity-item__content">' +
          '<div class="activity-item__message">' + item.message + '</div>' +
          '<div class="activity-item__meta">' +
            '<span>' + TV.formatDateTime(item.timestamp) + '</span>' +
            TV.severityBadge(item.severity) +
          '</div>' +
        '</div>' +
      '</li>';
    }).join('');
  }

  /* ─── Init ─── */
  document.addEventListener('DOMContentLoaded', function () {
    renderAlertBanner();
    var stats = computeStats();
    populateStatCards(stats);
    initSeverityChart(getSeverityCounts());
    initTrendChart();
    renderActiveIncidents();
    renderAIFindings();
    renderActivityFeed();
    var critCount = (window.Store ? Store.getIncidents() : MOCK.incidents).filter(function (i) { return i.status === 'active'; }).length;
    if (critCount > 0) TV.showToast(critCount + ' critical incident' + (critCount !== 1 ? 's' : '') + ' require immediate attention', 'error');
  });

}());
