/**
 * HealthGuard AI — network.js (Healthcare Network Topology)
 * Depends on: mock-data.js, main.js, vis-network CDN
 */
(function () {
  'use strict';

  var NODE_COLORS = {
    none:     { background: '#0d1829', border: '#1e2d4a', highlight: { background: '#162035', border: '#2a3f6a' } },
    low:      { background: '#003d4f', border: '#00c8f0', highlight: { background: '#005266', border: '#00c8f0' } },
    medium:   { background: '#3d2e00', border: '#f59e0b', highlight: { background: '#523e00', border: '#f59e0b' } },
    high:     { background: '#3d1c00', border: '#f97316', highlight: { background: '#522600', border: '#f97316' } },
    critical: { background: '#3d0011', border: '#f43f5e', highlight: { background: '#52001a', border: '#f43f5e' } }
  };

  var NODE_SHAPES = {
    firewall: 'diamond',
    router:   'triangle',
    server:   'box',
    medical:  'star',
    host:     'ellipse',
    endpoint: 'dot'
  };

  var networkInstance = null;

  function showNodeDetails(nodeId) {
    var node = MOCK.networkNodes.find(function (n) { return n.id === nodeId; });
    var panel = document.getElementById('node-detail-content');
    if (!panel) return;

    if (!node) {
      panel.innerHTML = '<p class="empty-state" style="text-align:center;color:var(--text-muted);padding:1.5rem 0.5rem">Click a node to view details</p>';
      return;
    }

    panel.innerHTML =
      '<div class="node-detail__name">' + escHtml(node.label) + '</div>' +
      '<div class="node-detail__row"><span class="node-detail__key">IP Address</span><span class="node-detail__val"><code style="color:var(--accent-cyan)">' + escHtml(node.ip) + '</code></span></div>' +
      '<div class="node-detail__row"><span class="node-detail__key">Type</span><span class="node-detail__val">' + escHtml(node.type) + '</span></div>' +
      '<div class="node-detail__row"><span class="node-detail__key">Risk Level</span><span class="node-detail__val">' + TV.severityBadge(node.risk === 'none' ? 'info' : node.risk) + '</span></div>' +
      '<div class="node-detail__row"><span class="node-detail__key">Group</span><span class="node-detail__val">' + escHtml(node.group) + '</span></div>';
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('network-canvas');
    if (!container || typeof vis === 'undefined') {
      if (container) container.innerHTML = '<p style="color:var(--text-muted);padding:2rem;text-align:center">vis.js library failed to load. Check your internet connection.</p>';
      return;
    }

    var nodes = new vis.DataSet(
      MOCK.networkNodes.map(function (n) {
        return {
          id:    n.id,
          label: n.label + '\n' + n.ip,
          shape: NODE_SHAPES[n.type] || 'ellipse',
          color: NODE_COLORS[n.risk] || NODE_COLORS.none,
          font:  { color: '#b0bccc', size: 11, multi: true },
          title: 'Type: ' + n.type + ' | Risk: ' + n.risk + ' | IP: ' + n.ip,
          size:  n.type === 'firewall' ? 24 : n.type === 'router' ? 20 : 16
        };
      })
    );

    var edges = new vis.DataSet(
      MOCK.networkEdges.map(function (e) {
        return {
          from:  e.from,
          to:    e.to,
          label: e.label || '',
          color: { color: '#162035', highlight: '#00c8f0', hover: '#00c8f0' },
          font:  { color: '#8892a4', size: 10, align: 'middle' },
          arrows: { to: { enabled: true, scaleFactor: 0.6 } },
          smooth: { type: 'cubicBezier', forceDirection: 'none', roundness: 0.4 }
        };
      })
    );

    var options = {
      layout: { improvedLayout: true },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -4000,
          centralGravity: 0.3,
          springLength: 120,
          springConstant: 0.04
        },
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 150,
        navigationButtons: false,
        keyboard: true
      },
      nodes: {
        borderWidth: 2,
        borderWidthSelected: 3,
        shadow: { enabled: true, color: 'rgba(0,0,0,0.5)', size: 8, x: 2, y: 2 }
      },
      edges: {
        width: 1.5,
        selectionWidth: 2.5
      }
    };

    networkInstance = new vis.Network(container, { nodes: nodes, edges: edges }, options);

    // Node click handler
    networkInstance.on('click', function (params) {
      if (params.nodes.length > 0) {
        showNodeDetails(params.nodes[0]);
      } else {
        showNodeDetails(null);
      }
    });

    // Stabilization progress
    networkInstance.on('stabilizationProgress', function (params) {
      var pct = Math.round(params.iterations / params.total * 100);
      var statusEl = document.getElementById('network-status');
      if (statusEl) statusEl.textContent = 'Simulating physics… ' + pct + '%';
    });

    networkInstance.on('stabilizationIterationsDone', function () {
      var statusEl = document.getElementById('network-status');
      if (statusEl) statusEl.textContent = 'Ready — click a node to inspect';
      networkInstance.setOptions({ physics: { enabled: false } });
    });

    // Initialize empty detail panel
    showNodeDetails(null);

    // Control buttons
    var btnZoomIn  = document.getElementById('btn-zoom-in');
    var btnZoomOut = document.getElementById('btn-zoom-out');
    var btnFit     = document.getElementById('btn-fit');
    var btnPhysics = document.getElementById('btn-physics');

    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', function () {
        networkInstance.moveTo({ scale: networkInstance.getScale() * 1.25, animation: { duration: 200 } });
      });
    }
    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', function () {
        networkInstance.moveTo({ scale: networkInstance.getScale() * 0.8, animation: { duration: 200 } });
      });
    }
    if (btnFit) {
      btnFit.addEventListener('click', function () {
        networkInstance.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } });
      });
    }
    if (btnPhysics) {
      var physicsOn = false;
      btnPhysics.addEventListener('click', function () {
        physicsOn = !physicsOn;
        networkInstance.setOptions({ physics: { enabled: physicsOn } });
        btnPhysics.textContent = physicsOn ? '⏸ Pause Physics' : '▶ Resume Physics';
      });
    }
  });

}());
