/**
 * HealthGuard AI — threat-intel.js (Healthcare Threat Intelligence)
 * Depends on: mock-data.js, main.js
 */
(function () {
  'use strict';

  /* ─── Render IOC Table ─── */
  function renderIOCTable(list) {
    var tbody = document.querySelector('#ioc-table tbody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state"><div class="empty-state__icon">🔍</div><p>No indicators match your filters.</p></td></tr>';
      return;
    }

    tbody.innerHTML = list.map(function (ioc) {
      return '<tr>' +
        '<td><span class="badge badge--info">' + escHtml(ioc.type) + '</span></td>' +
        '<td><code style="font-size:0.8rem;color:var(--accent-cyan);word-break:break-all">' + escHtml(ioc.value) + '</code></td>' +
        '<td>' +
          '<div class="confidence-bar">' +
            '<div class="confidence-bar__track"><div class="confidence-bar__fill" style="width:' + ioc.confidence + '%"></div></div>' +
            '<span class="confidence-bar__value">' + ioc.confidence + '%</span>' +
          '</div>' +
        '</td>' +
        '<td>' + escHtml(ioc.source) + '</td>' +
        '<td>' + (ioc.tags || []).map(function (tag) { return '<span class="badge badge--info" style="margin:1px;font-size:0.65rem">' + escHtml(tag) + '</span>'; }).join('') + '</td>' +
        '<td>' + TV.formatDate(ioc.lastSeen) + '</td>' +
        '<td>' + TV.severityBadge(ioc.severity) + '</td>' +
      '</tr>';
    }).join('');
  }

  /* ─── Filter IOCs ─── */
  function filterIOCs() {
    var search       = ((document.getElementById('ioc-search')        || {}).value || '').toLowerCase();
    var typeFilter   = (document.getElementById('ioc-type-filter')    || {}).value || '';
    var sevFilter    = (document.getElementById('ioc-sev-filter')     || {}).value || '';
    var sourceFilter = (document.getElementById('ioc-source-filter')  || {}).value || '';

    var filtered = MOCK.iocs.filter(function (ioc) {
      var matchSearch = !search ||
        ioc.value.toLowerCase().includes(search) ||
        ioc.source.toLowerCase().includes(search) ||
        (ioc.tags || []).join(' ').toLowerCase().includes(search);
      var matchType   = !typeFilter   || ioc.type     === typeFilter;
      var matchSev    = !sevFilter    || ioc.severity  === sevFilter;
      var matchSource = !sourceFilter || ioc.source    === sourceFilter;
      return matchSearch && matchType && matchSev && matchSource;
    });

    renderIOCTable(filtered);

    var countEl = document.getElementById('ioc-count');
    if (countEl) countEl.textContent = filtered.length + ' indicator' + (filtered.length !== 1 ? 's' : '');
  }

  /* ─── Populate Source Dropdown ─── */
  function populateSourceFilter() {
    var sel = document.getElementById('ioc-source-filter');
    if (!sel) return;
    var sources = [];
    MOCK.iocs.forEach(function (ioc) {
      if (!sources.includes(ioc.source)) sources.push(ioc.source);
    });
    sources.sort().forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      sel.appendChild(opt);
    });
  }

  /* ─── Populate Header Stats ─── */
  function populateStats() {
    var total = MOCK.iocs.length;
    var counts = {};
    MOCK.iocs.forEach(function (ioc) {
      counts[ioc.type] = (counts[ioc.type] || 0) + 1;
    });

    var el;
    el = document.getElementById('stat-ioc-total');
    if (el) el.textContent = total;

    el = document.getElementById('stat-ioc-ip');
    if (el) el.textContent = counts['ip'] || 0;

    el = document.getElementById('stat-ioc-domain');
    if (el) el.textContent = counts['domain'] || 0;

    el = document.getElementById('stat-ioc-hash');
    if (el) el.textContent = counts['hash'] || 0;

    el = document.getElementById('stat-ioc-url');
    if (el) el.textContent = counts['url'] || 0;

    el = document.getElementById('stat-ioc-email');
    if (el) el.textContent = counts['email'] || 0;

    el = document.getElementById('ioc-count');
    if (el) el.textContent = total + ' indicators';
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ─── Init ─── */
  document.addEventListener('DOMContentLoaded', function () {
    populateStats();
    populateSourceFilter();
    renderIOCTable(MOCK.iocs);

    // Event listeners
    var searchEl = document.getElementById('ioc-search');
    if (searchEl) searchEl.addEventListener('input', filterIOCs);

    ['ioc-type-filter', 'ioc-sev-filter', 'ioc-source-filter'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('change', filterIOCs);
    });

    // Sort headers
    var table = document.getElementById('ioc-table');
    if (table) {
      table.querySelectorAll('th[data-col]').forEach(function (th) {
        th.style.cursor = 'pointer';
        th.addEventListener('click', function () {
          TV.sortTable('ioc-table', parseInt(th.getAttribute('data-col'), 10));
        });
      });
    }
  });

}());
