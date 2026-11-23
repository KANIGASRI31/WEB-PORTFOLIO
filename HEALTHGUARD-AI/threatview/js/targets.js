/**
 * HealthGuard AI — targets.js (Asset Inventory)
 */
(function () {
  'use strict';

  var typeIcons = { server: '🖥️', medical: '🏥', endpoint: '💻', network: '🛡️', host: '📡' };

  function getRiskScore(target) {
    var vulns = MOCK.vulnerabilities.filter(function (v) {
      var scan = MOCK.scans.find(function (s) { return s.id === v.scanId; });
      return scan && scan.targetId === target.id;
    });
    if (!vulns.length) return '—';
    var scored = vulns.filter(function (v) { return v.cvssScore; });
    if (!scored.length) return '—';
    return (scored.reduce(function (a, v) { return a + v.cvssScore; }, 0) / scored.length).toFixed(1);
  }

  function getVulnCounts(target) {
    return MOCK.vulnerabilities.filter(function (v) {
      var scan = MOCK.scans.find(function (s) { return s.id === v.scanId; });
      return scan && scan.targetId === target.id;
    }).reduce(function (acc, v) {
      acc[v.severity] = (acc[v.severity] || 0) + 1;
      return acc;
    }, {});
  }

  function critBadge(c) {
    var map = { critical: 'badge--critical', high: 'badge--high', medium: 'badge--medium', low: 'badge--low' };
    return '<span class="badge ' + (map[c] || 'badge--info') + '">' + c + '</span>';
  }

  function statusDot(s) {
    if (s === 'active')      return '<span class="status-dot status-dot--active"></span> Active';
    if (s === 'in-progress') return '<span class="status-dot status-dot--in-progress"></span> Scanning';
    return '<span class="status-dot status-dot--archived"></span> Archived';
  }

  function renderStats() {
    var el = document.getElementById('asset-stats');
    if (!el) return;
    // Read from Store so stats reflect any user-persisted targets
    var targets = (window.Store ? Store.getTargets() : MOCK.targets);
    var total     = targets.length;
    var critical  = targets.filter(function (t) { return t.criticality === 'critical'; }).length;
    var medical   = targets.filter(function (t) { return t.type === 'medical'; }).length;
    var server    = targets.filter(function (t) { return t.type === 'server'; }).length;
    var active    = targets.filter(function (t) { return t.status === 'active'; }).length;
    var stats = [
      { icon: '🏥', val: total,    label: 'Total Assets' },
      { icon: '🔴', val: critical, label: 'Critical Assets' },
      { icon: '💉', val: medical,  label: 'Medical Devices' },
      { icon: '🖥️', val: server,   label: 'Servers' },
      { icon: '✅', val: active,   label: 'Active' }
    ];
    el.innerHTML = stats.map(function (s) {
      return '<div class="card card--stat">' +
        '<div class="stat-card__icon">' + s.icon + '</div>' +
        '<div class="stat-card__value">' + s.val + '</div>' +
        '<div class="stat-card__label">' + s.label + '</div>' +
      '</div>';
    }).join('');
  }

  function renderTable(targets) {
    var tbody = document.getElementById('assets-tbody');
    var count = document.getElementById('assets-count');
    if (!tbody) return;
    // Use Store for the total count shown in the "Showing X of Y" label
    var allTargets = (window.Store ? Store.getTargets() : MOCK.targets);
    if (!targets.length) {
      tbody.innerHTML = '<tr><td colspan="10"><div class="empty-state"><div class="empty-state__icon">🔎</div><p>No assets match the current filters.</p></div></td></tr>';
      if (count) count.textContent = '';
      return;
    }
    if (count) count.textContent = 'Showing ' + targets.length + ' of ' + allTargets.length + ' assets';
    tbody.innerHTML = targets.map(function (t) {
      var riskScore = getRiskScore(t);
      var riskColor = riskScore >= 9 ? 'style="color:var(--danger);font-weight:700"' : riskScore >= 7 ? 'style="color:var(--warning);font-weight:700"' : '';
      return '<tr>' +
        '<td><strong>' + (typeIcons[t.type] || '📦') + ' ' + t.name + '</strong></td>' +
        '<td><code style="font-size:0.8rem">' + t.address + '</code></td>' +
        '<td>' + (t.type.charAt(0).toUpperCase() + t.type.slice(1)) + '</td>' +
        '<td style="font-size:0.8rem;color:var(--text-muted)">' + t.os + '</td>' +
        '<td><span class="badge badge--info">' + t.department + '</span></td>' +
        '<td>' + critBadge(t.criticality) + '</td>' +
        '<td ' + riskColor + '>' + riskScore + '</td>' +
        '<td>' + statusDot(t.status) + '</td>' +
        '<td style="font-size:0.8rem">' + TV.formatDate(t.lastScanned) + '</td>' +
        '<td>' +
          '<button class="btn btn--ghost btn--sm" onclick="showAssetDetail(\'' + t.id + '\')">Details</button>' +
        '</td>' +
      '</tr>';
    }).join('');
  }

  function applyFilters() {
    var search   = (document.getElementById('search-assets').value || '').toLowerCase();
    var type     = document.getElementById('filter-type').value;
    var crit     = document.getElementById('filter-criticality').value;
    var status   = document.getElementById('filter-status').value;
    // Read from Store so filters operate on persisted data
    var allTargets = (window.Store ? Store.getTargets() : MOCK.targets);
    var filtered = allTargets.filter(function (t) {
      return (!search   || t.name.toLowerCase().includes(search) || t.address.includes(search) || t.department.toLowerCase().includes(search)) &&
             (!type     || t.type === type) &&
             (!crit     || t.criticality === crit) &&
             (!status   || t.status === status);
    });
    renderTable(filtered);
  }

  /* ─── Asset Detail Modal ─── */
  window.showAssetDetail = function (id) {
    // Read from Store so detail modal reflects persisted data
    var allTargets = (window.Store ? Store.getTargets() : MOCK.targets);
    var t = allTargets.find(function (x) { return x.id === id; });
    if (!t) return;
    var counts = getVulnCounts(t);
    var riskScore = getRiskScore(t);
    var body = document.getElementById('modal-asset-body');
    var title = document.getElementById('modal-asset-title');
    title.textContent = (typeIcons[t.type] || '📦') + ' ' + t.name;
    body.innerHTML =
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">' +
        '<div><div class="card__title">IP Address</div><div style="font-weight:600">' + t.address + '</div></div>' +
        '<div><div class="card__title">Type</div><div>' + t.type + '</div></div>' +
        '<div><div class="card__title">OS / Firmware</div><div>' + t.os + '</div></div>' +
        '<div><div class="card__title">Department</div><div>' + t.department + '</div></div>' +
        '<div><div class="card__title">Criticality</div><div>' + critBadge(t.criticality) + '</div></div>' +
        '<div><div class="card__title">Risk Score (Avg CVSS)</div><div style="font-weight:700;color:var(--danger)">' + riskScore + '</div></div>' +
        '<div><div class="card__title">Last Scanned</div><div>' + TV.formatDate(t.lastScanned) + '</div></div>' +
        '<div><div class="card__title">Status</div><div>' + t.status + '</div></div>' +
      '</div>' +
      '<div class="card__header" style="margin-top:1rem"><h3>Vulnerability Summary</h3></div>' +
      '<div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:0.5rem">' +
        (counts.critical ? '<span class="badge badge--critical">' + counts.critical + ' Critical</span>' : '') +
        (counts.high     ? '<span class="badge badge--high">'     + counts.high     + ' High</span>' : '') +
        (counts.medium   ? '<span class="badge badge--medium">'   + counts.medium   + ' Medium</span>' : '') +
        (counts.low      ? '<span class="badge badge--low">'      + counts.low      + ' Low</span>' : '') +
        (!counts.critical && !counts.high && !counts.medium && !counts.low ? '<span class="badge badge--info">No vulnerabilities scanned</span>' : '') +
      '</div>' +
      '<div style="margin-top:1rem"><div class="card__title">Tags</div><div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.4rem">' +
        t.tags.map(function (tag) { return '<span class="badge badge--info">' + tag + '</span>'; }).join('') +
      '</div></div>';
    document.getElementById('asset-modal').classList.add('modal--open');
  };

  window.closeModal = function () {
    document.getElementById('asset-modal').classList.remove('modal--open');
  };

  window.openAddAssetModal = function () {
    // Reset all fields to empty before opening
    ['aa-name', 'aa-address', 'aa-os', 'aa-dept', 'aa-tags'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var typeEl = document.getElementById('aa-type');
    if (typeEl) typeEl.value = 'server';
    var critEl = document.getElementById('aa-criticality');
    if (critEl) critEl.value = 'medium';
    document.getElementById('add-asset-modal').classList.add('modal--open');
  };

  window.closeAddAssetModal = function () {
    document.getElementById('add-asset-modal').classList.remove('modal--open');
  };

  window.submitAddAsset = function () {
    var nameVal = (document.getElementById('aa-name').value  || '').trim();
    var addrVal = (document.getElementById('aa-address').value || '').trim();
    var typeVal = document.getElementById('aa-type').value        || 'server';
    var osVal   = (document.getElementById('aa-os').value    || '').trim() || 'Unknown';
    var deptVal = (document.getElementById('aa-dept').value  || '').trim() || 'General';
    var critVal = document.getElementById('aa-criticality').value || 'medium';
    var tagsRaw = (document.getElementById('aa-tags').value  || '').trim();

    if (!nameVal) {
      TV.showToast('Asset name is required.', 'warning');
      return;
    }
    if (!addrVal) {
      TV.showToast('IP / Address is required.', 'warning');
      return;
    }

    var tags = tagsRaw
      ? tagsRaw.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; })
      : [];

    var newTarget = {
      id:          't' + Date.now(),
      name:        nameVal,
      address:     addrVal,
      type:        typeVal,
      os:          osVal,
      department:  deptVal,
      criticality: critVal,
      status:      'active',
      tags:        tags,
      addedAt:     new Date().toISOString().slice(0, 10),
      lastScanned: null
    };

    var saved = Store.saveTarget(newTarget);
    if (!saved) {
      TV.showToast('Failed to save asset. Check required fields.', 'error');
      return;
    }

    closeAddAssetModal();
    renderStats();
    applyFilters();
    TV.showToast('Asset "' + nameVal + '" registered successfully.', 'success');
  };

  /* ─── Init ─── */
  document.addEventListener('DOMContentLoaded', function () {
    renderStats();
    // Read from Store on init so table reflects persisted targets
    renderTable(window.Store ? Store.getTargets() : MOCK.targets);
    ['search-assets', 'filter-type', 'filter-criticality', 'filter-status'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', applyFilters);
    });
    document.getElementById('asset-modal').addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
    document.getElementById('add-asset-modal').addEventListener('click', function (e) {
      if (e.target === this) closeAddAssetModal();
    });
  });

}());
