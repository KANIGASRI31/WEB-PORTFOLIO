/**
 * ThreatView – main.js
 * Runs on every page. Exposes window.TV utilities.
 */
(function () {
  'use strict';

  window.TV = window.TV || {};

  /* ─── Theme Management ─── */
  TV.setTheme = function (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tv-theme', theme);
    document.querySelectorAll('[data-theme-btn]').forEach(function (btn) {
      var isActive = btn.getAttribute('data-theme-btn') === theme;
      btn.classList.toggle('btn--primary', isActive);
      btn.classList.toggle('btn--ghost',   !isActive);
    });
  };

  TV.initTheme = function () {
    var saved = localStorage.getItem('tv-theme') || 'dark';
    TV.setTheme(saved);
    // Page fade-in
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.25s ease';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.style.opacity = '1';
      });
    });
  };

  /* ─── Date Formatter ─── */
  TV.formatDate = function (iso) {
    if (!iso) return '—';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  TV.formatDateTime = function (iso) {
    if (!iso) return '—';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  /* ─── Severity Badge HTML ─── */
  TV.severityBadge = function (severity) {
    var s = (severity || 'info').toLowerCase();
    return '<span class="badge badge--' + s + '">' + s + '</span>';
  };

  /* ─── Truncate Text ─── */
  TV.truncateText = function (text, max) {
    if (!text) return '';
    max = max || 80;
    return text.length > max ? text.slice(0, max) + '…' : text;
  };

  /* ─── Toast Notifications ─── */
  TV.showToast = function (message, type) {
    type = type || 'info';
    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    var icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.innerHTML = '<span>' + (icons[type] || icons.info) + '</span><span>' + message + '</span>';
    container.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('toast--removing');
      toast.addEventListener('animationend', function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      });
    }, 3000);
  };

  /* ─── Sortable Table ─── */
  TV.sortTable = function (tableId, colIndex) {
    var table = document.getElementById(tableId);
    if (!table) return;
    var tbody = table.querySelector('tbody');
    var th = table.querySelectorAll('th')[colIndex];
    if (!th) return;

    var dir = th.getAttribute('data-sort-dir');
    // clear all headers
    table.querySelectorAll('th').forEach(function (h) { h.removeAttribute('data-sort-dir'); });
    dir = (dir === 'asc') ? 'desc' : 'asc';
    th.setAttribute('data-sort-dir', dir);

    var rows = Array.from(tbody.querySelectorAll('tr'));
    rows.sort(function (a, b) {
      var cellA = (a.cells[colIndex] ? a.cells[colIndex].textContent : '').trim();
      var cellB = (b.cells[colIndex] ? b.cells[colIndex].textContent : '').trim();
      var numA = parseFloat(cellA);
      var numB = parseFloat(cellB);
      if (!isNaN(numA) && !isNaN(numB)) {
        return dir === 'asc' ? numA - numB : numB - numA;
      }
      return dir === 'asc'
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    });
    rows.forEach(function (r) { tbody.appendChild(r); });
  };

  /* ─── Sidebar Active Highlight ─── */
  function highlightNav() {
    var parts = window.location.pathname.split('/');
    var current = parts[parts.length - 1] || 'index.html';
    // handle bare directory (file:// often ends in /)
    if (current === '' || current === '.') current = 'index.html';
    document.querySelectorAll('.nav-link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('nav-link--active');
      } else {
        link.classList.remove('nav-link--active');
      }
    });
  }

  /* ─── Mobile Sidebar Toggle ─── */
  function initMobileSidebar() {
    var toggle = document.getElementById('sidebar-toggle');
    var sidebar = document.querySelector('.sidebar');
    if (toggle && sidebar) {
      toggle.addEventListener('click', function () {
        sidebar.classList.toggle('sidebar--open');
      });
      // Close on outside click
      document.addEventListener('click', function (e) {
        if (sidebar.classList.contains('sidebar--open') &&
            !sidebar.contains(e.target) && e.target !== toggle) {
          sidebar.classList.remove('sidebar--open');
        }
      });
    }
  }

  /* ─── Init ─── */
  document.addEventListener('DOMContentLoaded', function () {
    TV.initTheme();
    highlightNav();
    initMobileSidebar();
  });

}());
