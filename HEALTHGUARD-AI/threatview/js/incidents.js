/**
 * HealthGuard AI — incidents.js
 * Module 3: Security Alert & Response Management
 */
(function () {
  'use strict';

  /* ─── Stats ─── */
  function renderStats() {
    var el = document.getElementById('incident-stats');
    if (!el) return;
    // Read from Store so stats reflect persisted incident data
    var incs = (window.Store ? Store.getIncidents() : MOCK.incidents);
    var active  = incs.filter(function (i) { return i.status === 'active'; }).length;
    var invest  = incs.filter(function (i) { return i.status === 'investigating'; }).length;
    // Resolved stat includes both 'resolved' and 'closed' — both represent completed incidents
    var resolved= incs.filter(function (i) { return i.status === 'resolved' || i.status === 'closed'; }).length;
    var critical= incs.filter(function (i) { return i.severity === 'critical'; }).length;

    el.innerHTML = [
      { icon: '🚨', val: active,   label: 'Active',       color: 'stat-card__value--danger' },
      { icon: '🔍', val: invest,   label: 'Investigating', color: 'stat-card__value--warning' },
      { icon: '✅', val: resolved, label: 'Resolved',      color: 'stat-card__value--green' },
      { icon: '🔴', val: critical, label: 'Critical',      color: 'stat-card__value--danger' }
    ].map(function (s) {
      return '<div class="card card--stat">' +
        '<div class="stat-card__icon">' + s.icon + '</div>' +
        '<div class="stat-card__value ' + s.color + '">' + s.val + '</div>' +
        '<div class="stat-card__label">' + s.label + '</div>' +
      '</div>';
    }).join('');
  }

  /* ─── Attack Type Icons ─── */
  var attackIcons = {
    'Ransomware': '💀',
    'Unauthorized Access': '🔓',
    'Medical Device Attack': '💉',
    'Brute Force': '🔨',
    'Phishing': '🎣',
    'Misconfiguration': '⚙️'
  };

  /* ─── Render Incidents ─── */
  function renderIncidents(incidents) {
    var grid = document.getElementById('incidents-grid');
    if (!grid) return;
    if (!incidents.length) {
      grid.innerHTML = '<div class="empty-state"><div class="empty-state__icon">✅</div><p>No incidents match the current filters.</p></div>';
      return;
    }
    grid.innerHTML = incidents.map(function (inc) {
      var icon = attackIcons[inc.attackType] || '🚨';
      var statusLabel = inc.status.charAt(0).toUpperCase() + inc.status.slice(1);
      var statusCls = inc.status === 'active' ? 'badge--critical' : inc.status === 'investigating' ? 'badge--high' : 'badge--low';
      return '<div class="incident-card incident-card--' + inc.status + '" ' +
        'onclick="showIncident(\'' + inc.id + '\')" ' +
        'role="button" tabindex="0" ' +
        'onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();showIncident(\'' + inc.id + '\');}" ' +
        'aria-label="' + inc.title + ', ' + inc.severity + ' severity, ' + inc.status + '">' +
        '<div class="incident-card-header">' +
          '<span style="font-size:1.4rem;flex-shrink:0">' + icon + '</span>' +
          '<div style="flex:1">' +
            '<div class="incident-card-title">' + inc.title + '</div>' +
            '<div class="incident-card-meta">' +
              TV.severityBadge(inc.severity) +
              '<span class="badge ' + statusCls + '">' + statusLabel + '</span>' +
              '<span>🏥 ' + inc.assetName + '</span>' +
              '<span>' + TV.formatDateTime(inc.detectedAt) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="incident-card-description">' + inc.description.slice(0, 180) + (inc.description.length > 180 ? '…' : '') + '</div>' +
        '<div class="incident-card-footer">' +
          '<span class="badge badge--info">' + inc.attackType + '</span>' +
          inc.affectedAssets.map(function (a) { return '<span class="badge badge--info">' + a + '</span>'; }).join('') +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ─── Filter ─── */
  function applyFilters() {
    var search = (document.getElementById('search-incidents').value || '').toLowerCase();
    var sev    = document.getElementById('filter-inc-severity').value;
    var status = document.getElementById('filter-inc-status').value;
    // Read from Store so filters operate on persisted incident data
    var allIncidents = (window.Store ? Store.getIncidents() : MOCK.incidents);
    var filtered = allIncidents.filter(function (i) {
      return (!search || i.title.toLowerCase().includes(search) || i.assetName.toLowerCase().includes(search)) &&
             (!sev    || i.severity === sev) &&
             (!status || i.status === status);
    });
    renderIncidents(filtered);
  }

  /* ─── Incident Detail Modal ─── */
  window.showIncident = function (id) {
    // Read from Store so modal reflects persisted data
    var allIncidents = (window.Store ? Store.getIncidents() : MOCK.incidents);
    var inc = allIncidents.find(function (x) { return x.id === id; });
    if (!inc) return;
    var icon = attackIcons[inc.attackType] || '🚨';
    var statusCls = inc.status === 'active' ? 'badge--critical' : inc.status === 'investigating' ? 'badge--high' : 'badge--low';

    document.getElementById('incident-modal-title').textContent = icon + ' ' + inc.title;
    document.getElementById('incident-modal-body').innerHTML =
      '<div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-bottom:1rem">' +
        TV.severityBadge(inc.severity) +
        '<span class="badge ' + statusCls + '">' + inc.status.toUpperCase() + '</span>' +
        '<span class="badge badge--info">' + inc.attackType + '</span>' +
        '<span style="margin-left:auto;font-size:0.75rem;color:var(--text-muted)">Detected: ' + TV.formatDateTime(inc.detectedAt) + '</span>' +
      '</div>' +

      '<div style="margin-bottom:1rem"><div class="card__title">Description</div>' +
        '<p style="margin-top:0.4rem">' + inc.description + '</p>' +
      '</div>' +

      '<div style="margin-bottom:1rem"><div class="card__title">Affected Assets</div>' +
        '<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:0.4rem">' +
          inc.affectedAssets.map(function (a) { return '<span class="badge badge--info">🏥 ' + a + '</span>'; }).join('') +
        '</div>' +
      '</div>' +

      '<div style="margin-bottom:1rem"><div class="card__title">Event Timeline</div>' +
        '<div class="timeline">' +
          inc.timeline.map(function (e) { return '<div class="timeline-event">' + e + '</div>'; }).join('') +
        '</div>' +
      '</div>' +

      '<div style="padding:0.85rem;background:rgba(0,212,255,0.06);border-radius:6px;border:1px solid rgba(0,212,255,0.2)">' +
        '<div class="card__title" style="color:var(--accent-cyan);margin-bottom:0.5rem">🛡️ Recommended Remediation Actions</div>' +
        '<ul class="remediation-list">' +
          inc.remediation.map(function (r) { return '<li>' + r + '</li>'; }).join('') +
        '</ul>' +
      '</div>';

    document.getElementById('incident-modal').classList.add('modal--open');

    // Status transition section
    var transitions = {
      'active': [
        { label: '🔍 Start Investigation', newStatus: 'investigating', cls: 'btn--secondary' },
        { label: '✅ Resolve',              newStatus: 'resolved',      cls: 'btn--ghost'     }
      ],
      'investigating': [
        { label: '✅ Mark Resolved',        newStatus: 'resolved', cls: 'btn--secondary' },
        { label: '🔒 Close',               newStatus: 'closed',   cls: 'btn--ghost'     }
      ],
      'resolved': [
        { label: '🔒 Close Incident',      newStatus: 'closed',  cls: 'btn--ghost'  },
        { label: '↩ Re-open',             newStatus: 'active',  cls: 'btn--danger' }
      ],
      'closed': []
    };

    var btns = transitions[inc.status] || [];
    var btnHtml;
    if (btns.length === 0) {
      btnHtml = '<span class="badge badge--info">Incident closed</span>';
    } else {
      btnHtml = btns.map(function (b) {
        return '<button class="btn ' + b.cls + ' btn--sm" ' +
               'onclick="transitionIncidentStatus(\'' + inc.id + '\', \'' + b.newStatus + '\')">' +
               b.label + '</button>';
      }).join('');
    }

    var statusSection = document.createElement('div');
    statusSection.style.cssText = 'margin-top:1.25rem;padding-top:0.85rem;border-top:1px solid var(--border-color)';
    statusSection.innerHTML =
      '<div class="card__title" style="margin-bottom:0.6rem">🔄 Status Transition</div>' +
      '<div style="display:flex;gap:0.6rem;flex-wrap:wrap">' + btnHtml + '</div>';
    document.getElementById('incident-modal-body').appendChild(statusSection);
  };

  window.closeIncidentModal = function () {
    document.getElementById('incident-modal').classList.remove('modal--open');
  };

  /* ─── Status Transition ─── */
  window.transitionIncidentStatus = function (id, newStatus) {
    var updated = Store.updateIncident(id, { status: newStatus });
    if (!updated) {
      TV.showToast('Failed to update incident status.', 'error');
      return;
    }
    closeIncidentModal();
    renderStats();
    applyFilters();
    showIncident(id);   // re-open with refreshed data and new buttons
    TV.showToast('Incident status updated to ' + newStatus + '.', 'success');
  };

  /* ─── Init ─── */
  document.addEventListener('DOMContentLoaded', function () {
    renderStats();
    // Read from Store on init so incident list reflects persisted data
    renderIncidents(window.Store ? Store.getIncidents() : MOCK.incidents);

    ['search-incidents', 'filter-inc-severity', 'filter-inc-status'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', applyFilters);
    });

    document.getElementById('incident-modal').addEventListener('click', function (e) {
      if (e.target === this) closeIncidentModal();
    });

    var allIncidents = (window.Store ? Store.getIncidents() : MOCK.incidents);
    var activeCount = allIncidents.filter(function (i) { return i.status === 'active'; }).length;
    if (activeCount) TV.showToast(activeCount + ' active incidents require immediate response', 'error');
  });

}());
