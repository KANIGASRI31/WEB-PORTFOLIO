/**
 * HealthGuard AI — store.js
 * Shared data-access layer. Exposes window.Store.
 * Depends on: mock-data.js (must load first)
 *
 * Storage keys: tv-targets, tv-incidents, tv-scan-records, tv-findings
 * Pattern: IIFE, ES5, no arrow functions at module level.
 */
(function () {
  'use strict';

  window.Store = {};

  /* ─── Storage Keys ─── */
  var KEY_TARGETS   = 'tv-targets';
  var KEY_INCIDENTS = 'tv-incidents';
  var KEY_SCANS     = 'tv-scan-records';
  var KEY_FINDINGS  = 'tv-findings';

  /* ─── Safe JSON Read from localStorage ─── */
  // Returns parsed array or null on any error (malformed JSON, not an array, etc.)
  function safeRead(key) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null) return null;          // key absent
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null; // wrong type
      return parsed;
    } catch (e) {
      return null; // malformed JSON
    }
  }

  /* ─── Safe JSON Write to localStorage ─── */
  function safeWrite(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch same-tab store:changed event so in-page subscribers can react
      // (the native 'storage' event only fires in OTHER tabs)
      var evt = null;
      try {
        evt = new CustomEvent('store:changed', {
          detail: { key: key },
          bubbles: true,
          cancelable: false
        });
      } catch (ex) {
        evt = document.createEvent('CustomEvent');
        evt.initCustomEvent('store:changed', true, false, { key: key });
      }
      if (evt) document.dispatchEvent(evt);
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ─── First-run Initialization ─── */
  // Only initializes if the key does not exist yet.
  // Never overwrites existing user data on subsequent loads.
  function initKey(key, mockDefault) {
    var existing = safeRead(key);
    if (existing === null) {
      // Key absent or malformed — initialize from MOCK
      safeWrite(key, mockDefault);
    }
  }

  /* ─── Bootstrap on Load ─── */
  // Guard: MOCK must already be defined (mock-data.js loads first)
  if (typeof MOCK !== 'undefined') {
    initKey(KEY_TARGETS,   MOCK.targets        || []);
    initKey(KEY_INCIDENTS, MOCK.incidents       || []);
    initKey(KEY_SCANS,     MOCK.scans           || []);
    initKey(KEY_FINDINGS,  MOCK.vulnerabilities || []);
  }

  /* ─── Record Validators ─── */
  // Return true if the record passes basic validation.
  // Required fields are checked for truthy string/number values.
  function validateTarget(rec) {
    if (!rec || typeof rec !== 'object') return false;
    if (!rec.id || !rec.name || !rec.address) {
      console.warn('[Store] Invalid target record — id, name, address are required.', rec);
      return false;
    }
    return true;
  }

  function validateIncident(rec) {
    if (!rec || typeof rec !== 'object') return false;
    if (!rec.id || !rec.title || !rec.severity || !rec.status) {
      console.warn('[Store] Invalid incident record — id, title, severity, status are required.', rec);
      return false;
    }
    return true;
  }

  /* ─── Targets ─── */

  Store.getTargets = function () {
    var data = safeRead(KEY_TARGETS);
    if (data === null) {
      // Malformed or absent — fall back to MOCK silently
      return (typeof MOCK !== 'undefined' && Array.isArray(MOCK.targets)) ? MOCK.targets.slice() : [];
    }
    return data;
  };

  Store.saveTarget = function (target) {
    if (!validateTarget(target)) return null;
    var list = Store.getTargets();
    list.push(target);
    safeWrite(KEY_TARGETS, list);
    return target;
  };

  Store.updateTarget = function (id, patch) {
    var list = Store.getTargets();
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) { idx = i; break; }
    }
    if (idx === -1) return null;
    var updated = {};
    var src = list[idx];
    for (var k in src) { if (src.hasOwnProperty(k)) updated[k] = src[k]; }
    for (var p in patch) { if (patch.hasOwnProperty(p)) updated[p] = patch[p]; }
    list[idx] = updated;
    safeWrite(KEY_TARGETS, list);
    return updated;
  };

  Store.deleteTarget = function (id) {
    var list = Store.getTargets();
    var before = list.length;
    var filtered = list.filter(function (t) { return t.id !== id; });
    if (filtered.length === before) return false;
    safeWrite(KEY_TARGETS, filtered);
    return true;
  };

  Store.resetTargets = function () {
    var defaults = (typeof MOCK !== 'undefined' && Array.isArray(MOCK.targets)) ? MOCK.targets.slice() : [];
    safeWrite(KEY_TARGETS, defaults);
    return defaults;
  };

  /* ─── Incidents ─── */

  Store.getIncidents = function () {
    var data = safeRead(KEY_INCIDENTS);
    if (data === null) {
      return (typeof MOCK !== 'undefined' && Array.isArray(MOCK.incidents)) ? MOCK.incidents.slice() : [];
    }
    return data;
  };

  Store.saveIncident = function (incident) {
    if (!validateIncident(incident)) return null;
    var list = Store.getIncidents();
    list.push(incident);
    safeWrite(KEY_INCIDENTS, list);
    return incident;
  };

  Store.updateIncident = function (id, patch) {
    var list = Store.getIncidents();
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) { idx = i; break; }
    }
    if (idx === -1) return null;
    var updated = {};
    var src = list[idx];
    for (var k in src) { if (src.hasOwnProperty(k)) updated[k] = src[k]; }
    for (var p in patch) { if (patch.hasOwnProperty(p)) updated[p] = patch[p]; }
    list[idx] = updated;
    safeWrite(KEY_INCIDENTS, list);
    return updated;
  };

  Store.resetIncidents = function () {
    var defaults = (typeof MOCK !== 'undefined' && Array.isArray(MOCK.incidents)) ? MOCK.incidents.slice() : [];
    safeWrite(KEY_INCIDENTS, defaults);
    return defaults;
  };

  /* ─── Scan Records ─── */

  Store.getScans = function () {
    var data = safeRead(KEY_SCANS);
    if (data === null) {
      return (typeof MOCK !== 'undefined' && Array.isArray(MOCK.scans)) ? MOCK.scans.slice() : [];
    }
    return data;
  };

  Store.saveScans = function (scans) {
    if (!Array.isArray(scans)) {
      console.warn('[Store] saveScans: expected an array, got:', scans);
      return null;
    }
    safeWrite(KEY_SCANS, scans);
    return scans;
  };

  /* ─── Findings (Vulnerabilities) ─── */

  Store.getFindings = function () {
    var data = safeRead(KEY_FINDINGS);
    if (data === null) {
      return (typeof MOCK !== 'undefined' && Array.isArray(MOCK.vulnerabilities)) ? MOCK.vulnerabilities.slice() : [];
    }
    return data;
  };

  /* ─── Cross-tab Sync ─── */
  // Listen for storage events from other tabs and fire a custom DOM event
  // so pages can react without a full reload.
  window.addEventListener('storage', function (e) {
    if (!e.key) return;
    if (e.key.indexOf('tv-') !== 0) return; // only our keys
    var evt = null;
    try {
      evt = new CustomEvent('store:changed', {
        detail: { key: e.key, newValue: e.newValue },
        bubbles: true,
        cancelable: false
      });
    } catch (ex) {
      // IE fallback
      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('store:changed', true, false, { key: e.key, newValue: e.newValue });
    }
    document.dispatchEvent(evt);
  });

}());
