/* ═══════════════════════════════════════════════════════
   TelecomIQ — CSV Preprocessing Engine  (Module 1)
   Upload · Preview · Clean · Transform · Export
═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Sample CSVs ── */
  window.SAMPLE_NETWORK_CSV = `node_id,signal_strength,latency,bandwidth,packet_loss,uptime,status
n001,82,18,94,0.4,99.8,normal
n002,61,42,55,3.2,97.1,warning
n003,34,88,22,8.7,89.4,failure
n004,95,5,99,0.1,99.9,normal
n005,90,7,97,0.2,99.9,normal
n006,55,60,48,5.1,94.2,warning
n007,78,22,88,0.9,99.1,normal
n008,99,2,100,0.0,100.0,normal
n009,20,110,10,14.2,72.3,failure
n010,70,30,76,1.8,98.6,normal
n011,66,35,72,2.1,98.0,normal
n012,44,72,38,6.8,91.5,warning
n013,88,14,92,0.5,99.4,normal
n014,93,4,98,0.1,99.9,normal
n015,29,95,18,11.3,81.2,failure
n016,76,25,84,1.2,98.8,normal
n017,58,50,60,4.1,95.3,warning
n018,92,6,96,0.2,99.9,normal
n019,71,28,79,1.6,98.2,normal
n020,48,68,44,5.8,93.1,warning
n021,85,15,91,0.6,99.5,normal
n022,37,80,25,9.1,88.0,failure
n023,62,38,58,3.5,96.8,warning
n024,91,8,95,0.3,99.7,normal
n025,74,27,82,1.4,98.4,normal
n026,52,55,50,4.8,94.0,warning
n027,,32,88,1.1,99.0,normal
n028,80,19,,0.7,99.2,normal
n029,25,105,12,13.5,74.1,failure
n030,67,33,74,2.0,98.3,normal
n031,89,11,93,0.4,99.6,normal
n032,42,75,35,7.5,90.2,failure
n033,77,24,86,1.0,99.0,normal
n034,60,45,52,3.8,96.5,warning
n035,94,5,98,0.1,99.9,normal
n036,33,90,20,10.8,82.5,failure
n037,72,29,80,1.7,98.5,normal
n038,56,52,46,4.5,94.8,warning
n039,88,13,91,0.5,99.5,normal
n040,45,70,40,6.2,92.4,warning
n041,83,17,90,0.6,99.3,normal
n042,,48,53,3.9,96.2,warning
n043,96,4,99,0.1,99.9,normal
n044,27,100,15,12.1,76.8,failure
n045,69,31,77,1.9,98.1,normal
n046,53,57,47,4.6,93.9,warning
n047,87,12,92,0.4,99.6,normal
n048,41,78,32,8.0,89.7,failure
n049,75,26,83,1.3,98.6,normal
n050,63,40,56,3.3,96.9,warning
n051,86,16,90,0.7,99.4,normal
n052,38,82,28,8.9,87.6,failure
n053,65,37,62,3.0,97.2,normal
n054,92,6,96,0.2,99.8,normal
n055,50,62,45,5.3,93.6,warning
n056,79,21,87,0.8,99.1,normal
n057,,44,51,4.0,95.9,warning
n058,84,15,91,0.5,99.5,normal
n059,30,98,16,12.8,75.4,failure
n060,69,32,75,2.1,98.0,normal`;

  window.SAMPLE_CUSTOMER_CSV = `customer_id,plan,tenure,monthly_bill,data_usage_gb,call_duration_min,churn
c001,Unlimited Pro,36,1499,88,420,0
c002,Basic 2G,4,199,1.2,85,1
c003,5G Starter,12,599,32,215,0
c004,Unlimited Pro,48,1499,102,530,0
c005,Basic 4G,2,299,4.8,60,1
c006,5G Starter,8,599,25,180,0
c007,Unlimited Pro,60,1499,115,610,0
c008,Basic 2G,1,199,0.5,40,1
c009,5G Starter,18,599,55,290,0
c010,Basic 4G,3,299,7.2,95,1
c011,Unlimited Pro,24,1499,78,380,0
c012,5G Starter,6,599,19,140,0
c013,Enterprise,72,4999,220,900,0
c014,Basic 2G,2,199,0.8,55,1
c015,Basic 4G,5,299,9.1,110,0
c016,Unlimited Pro,30,1499,91,460,0
c017,5G Starter,9,599,28,200,0
c018,Basic 2G,1,199,0.3,30,1
c019,Enterprise,48,4999,195,820,0
c020,5G Starter,14,599,42,255,0
c021,Unlimited Pro,42,1499,96,490,0
c022,Basic 4G,3,299,6.5,88,1
c023,5G Starter,11,599,38,220,0
c024,Basic 2G,2,199,0.9,62,1
c025,Unlimited Pro,54,1499,108,560,0
c026,5G Starter,7,599,22,160,0
c027,Basic 4G,4,299,8.3,100,0
c028,Basic 2G,1,199,0.4,35,1
c029,Unlimited Pro,66,1499,120,640,0
c030,5G Starter,16,599,48,270,0
c031,Basic 4G,2,299,5.5,72,1
c032,Unlimited Pro,28,1499,84,410,0
c033,5G Starter,10,599,30,210,0
c034,Basic 2G,3,199,1.1,78,0
c035,Enterprise,60,4999,210,870,0
c036,Basic 4G,1,299,3.2,50,1
c037,5G Starter,13,599,36,235,0
c038,Unlimited Pro,22,1499,72,360,0
c039,Basic 2G,2,199,0.7,48,1
c040,5G Starter,15,599,45,260,0
c041,,18,599,40,230,0
c042,Basic 4G,4,299,7.8,105,0
c043,Unlimited Pro,38,1499,94,470,0
c044,Basic 2G,1,,0.6,42,1
c045,5G Starter,8,599,24,175,0
c046,Basic 4G,3,299,6.9,92,1
c047,Unlimited Pro,44,1499,99,510,0
c048,5G Starter,12,599,34,222,0
c049,Basic 2G,2,199,0.8,58,1
c050,Enterprise,36,4999,180,780,0
c051,Unlimited Pro,20,1499,68,340,0
c052,Basic 4G,2,299,4.2,65,1
c053,5G Starter,9,599,27,195,0
c054,Basic 2G,1,199,0.4,38,1
c055,Unlimited Pro,50,1499,105,540,0
c056,5G Starter,6,599,20,148,0
c057,Basic 4G,5,299,9.8,118,0
c058,Basic 2G,2,199,0.9,60,1
c059,Unlimited Pro,32,1499,86,430,0
c060,5G Starter,11,599,33,218,0
c061,Basic 4G,3,299,6.1,82,1
c062,Unlimited Pro,46,1499,101,520,0
c063,Basic 2G,1,199,0.5,36,1
c064,5G Starter,10,599,31,212,0
c065,Enterprise,54,4999,200,840,0
c066,Basic 4G,2,299,5.0,68,1
c067,5G Starter,7,599,23,165,0
c068,Unlimited Pro,34,1499,89,440,0
c069,Basic 2G,3,199,1.0,70,0
c070,5G Starter,13,599,37,238,0
c071,Basic 4G,4,299,8.0,108,0
c072,Unlimited Pro,26,1499,80,395,0
c073,5G Starter,8,599,26,185,0
c074,Basic 2G,1,199,0.3,32,1
c075,Enterprise,42,4999,188,800,0
c076,Basic 4G,2,299,4.5,63,1
c077,5G Starter,14,599,43,258,0
c078,Unlimited Pro,52,1499,106,550,0
c079,Basic 2G,2,199,0.8,52,1
c080,5G Starter,10,599,32,215,0`;

  /* ── CSV Parser ── */
  function parseCSV(text) {
    const lines = text.trim().split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map(v => v.trim());
      if (vals.length !== headers.length) continue;
      const row = {};
      headers.forEach((h, j) => { row[h] = vals[j]; });
      rows.push(row);
    }
    return { headers, rows };
  }

  /* ── Detect dataset type ── */
  function detectType(headers) {
    const net  = ['signal_strength', 'latency', 'bandwidth', 'packet_loss'];
    const cust = ['monthly_bill', 'data_usage_gb', 'call_duration_min', 'tenure'];
    const hasNet  = net.filter(c => headers.includes(c)).length;
    const hasCust = cust.filter(c => headers.includes(c)).length;
    return hasNet >= hasCust ? 'network' : 'customer';
  }

  /* ── Numeric columns by type ── */
  function getNumericCols(headers, type) {
    const netNum  = ['signal_strength', 'latency', 'bandwidth', 'packet_loss', 'uptime'];
    const custNum = ['tenure', 'monthly_bill', 'data_usage_gb', 'call_duration_min'];
    const list = type === 'network' ? netNum : custNum;
    return headers.filter(h => list.includes(h));
  }

  /* ── Detect missing values ── */
  function detectMissing(rows, headers) {
    const counts = {};
    headers.forEach(h => { counts[h] = 0; });
    rows.forEach(r => {
      headers.forEach(h => {
        if (r[h] === '' || r[h] === null || r[h] === undefined || r[h] === 'undefined') counts[h]++;
      });
    });
    return counts;
  }

  /* ── Remove duplicates ── */
  function removeDuplicates(rows) {
    const seen = new Set();
    const clean = [];
    let removed = 0;
    rows.forEach(r => {
      const key = JSON.stringify(r);
      if (!seen.has(key)) { seen.add(key); clean.push(r); }
      else removed++;
    });
    return { rows: clean, removed };
  }

  /* ── Impute missing ── */
  function imputeMissing(rows, headers, numericCols) {
    let handled = 0;
    const means = {};
    numericCols.forEach(col => {
      const vals = rows.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
      means[col] = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    });
    const catCols = headers.filter(h => !numericCols.includes(h));
    const modes = {};
    catCols.forEach(col => {
      const freq = {};
      rows.forEach(r => { if (r[col]) freq[r[col]] = (freq[r[col]] || 0) + 1; });
      modes[col] = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    });
    const cleaned = rows.map(r => {
      const nr = { ...r };
      headers.forEach(h => {
        if (nr[h] === '' || nr[h] === undefined || nr[h] === null) {
          nr[h] = numericCols.includes(h) ? means[h].toFixed(2) : modes[h];
          handled++;
        }
      });
      return nr;
    });
    return { rows: cleaned, handled };
  }

  /* ── Min-Max normalise ── */
  function normalise(rows, numericCols) {
    const mins = {}, maxs = {};
    numericCols.forEach(col => {
      const vals = rows.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
      mins[col] = Math.min(...vals);
      maxs[col] = Math.max(...vals);
    });
    return rows.map(r => {
      const nr = { ...r };
      numericCols.forEach(col => {
        const v = parseFloat(nr[col]);
        const range = maxs[col] - mins[col];
        nr[col + '_norm'] = range === 0 ? 0 : +((v - mins[col]) / range).toFixed(4);
      });
      return nr;
    });
  }

  /* ── Cast numeric strings to numbers ── */
  function castTypes(rows, numericCols) {
    return rows.map(r => {
      const nr = { ...r };
      numericCols.forEach(col => { nr[col] = parseFloat(nr[col]) || 0; });
      return nr;
    });
  }

  /* ── Full pipeline ── */
  window.runPreprocess = function (csvText) {
    const { headers, rows: rawRows } = parseCSV(csvText);
    const type = detectType(headers);
    const numericCols = getNumericCols(headers, type);
    const original = rawRows.length;

    const missingBefore = detectMissing(rawRows, headers);
    const totalMissing  = Object.values(missingBefore).reduce((a, b) => a + b, 0);

    const { rows: dedupedRows, removed: dupsRemoved } = removeDuplicates(rawRows);
    
    // Detect outliers BEFORE handling
    const outlierAnalysis = detectOutliers(dedupedRows, numericCols);
    
    const { rows: imputedRows, handled: missingHandled } = imputeMissing(dedupedRows, headers, numericCols);
    const typedRows      = castTypes(imputedRows, numericCols);
    const normalisedRows = normalise(typedRows, numericCols);

    const result = {
      type, headers, numericCols,
      originalCount:  original,
      dupsRemoved,
      missingHandled,
      finalCount:     normalisedRows.length,
      missingBefore,
      outlierAnalysis, // Add outlier data to result
      rawPreview:     rawRows.slice(0, 10),
      cleanedPreview: normalisedRows.slice(0, 10),
      allRows:        normalisedRows,
    };

    if (type === 'network') window.processedNetwork = result;
    else window.processedCustomer = result;

    return result;
  };

  /* ── Download helper ── */
  window.downloadSampleCSV = function (type) {
    const content = type === 'network' ? window.SAMPLE_NETWORK_CSV : window.SAMPLE_CUSTOMER_CSV;
    const name    = type === 'network' ? 'sample_network.csv' : 'sample_customer.csv';
    const blob    = new Blob([content], { type: 'text/csv' });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Download cleaned dataset ── */
  window.downloadCleanedCSV = function (type) {
    const data = type === 'network' ? window.processedNetwork : window.processedCustomer;
    if (!data || !data.allRows || !data.allRows.length) {
      alert('No cleaned data available. Please upload and process a dataset first.');
      return;
    }

    const rows = data.allRows;
    const headers = data.headers.filter(h => !h.endsWith('_norm')); // Exclude normalized columns for export
    
    // Build CSV content
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      const values = headers.map(h => {
        const val = row[h];
        // Handle commas and quotes in values
        if (val === undefined || val === null) return '';
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      });
      csv += values.join(',') + '\n';
    });
    
    // Trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `cleaned_${type}_${timestamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showStatus(`✓ Downloaded cleaned ${type} dataset (${rows.length} records)`, 'success');
  };

  /* ── Outlier detection using IQR method ── */
  function detectOutliers(rows, numericCols) {
    const outliersByCol = {};
    let totalOutliers = 0;
    
    numericCols.forEach(col => {
      const values = rows.map(r => parseFloat(r[col])).filter(v => !isNaN(v)).sort((a, b) => a - b);
      if (values.length === 0) return;
      
      const q1 = values[Math.floor(values.length * 0.25)];
      const q3 = values[Math.floor(values.length * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      
      const outliers = [];
      rows.forEach((r, i) => {
        const v = parseFloat(r[col]);
        if (!isNaN(v) && (v < lowerBound || v > upperBound)) {
          outliers.push({
            index: i,
            value: v,
            reason: v < lowerBound ? 'Below lower bound' : 'Above upper bound',
            deviation: v < lowerBound ? ((lowerBound - v) / iqr).toFixed(2) : ((v - upperBound) / iqr).toFixed(2)
          });
        }
      });
      
      totalOutliers += outliers.length;
      outliersByCol[col] = { 
        outliers, 
        lowerBound: lowerBound.toFixed(2), 
        upperBound: upperBound.toFixed(2), 
        q1: q1.toFixed(2), 
        q3: q3.toFixed(2),
        iqr: iqr.toFixed(2),
        count: outliers.length
      };
    });
    
    return { outliersByCol, totalOutliers };
  }

  /* ══════════════════════════════════════════════
     UI RENDERING — Module 1 preprocessing page
  ══════════════════════════════════════════════ */

  /* ── Render preview table ── */
  function renderPreviewTable(containerId, headers, rows, maxCols) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    const displayHeaders = maxCols ? headers.slice(0, maxCols) : headers;
    let html = '<div style="overflow-x:auto"><table class="tbl"><thead><tr>';
    displayHeaders.forEach(h => { html += `<th>${h}</th>`; });
    if (maxCols && headers.length > maxCols) html += `<th style="color:var(--txt3)">+${headers.length - maxCols} more</th>`;
    html += '</tr></thead><tbody>';
    rows.forEach(r => {
      html += '<tr>';
      displayHeaders.forEach(h => {
        const v = r[h];
        const empty = v === '' || v === undefined || v === null;
        html += `<td class="${empty ? 'c-rd' : ''} mono">${empty ? '⚠ missing' : v}</td>`;
      });
      if (maxCols && headers.length > maxCols) html += '<td></td>';
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    wrap.innerHTML = html;
  }

  /* ── Render cleaned preview table (show only original cols) ── */
  function renderCleanedPreviewTable(containerId, headers, rows) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    // filter out _norm columns for the preview display
    const displayHeaders = headers.filter(h => !h.endsWith('_norm'));
    const maxCols = Math.min(displayHeaders.length, 10);
    renderPreviewTable(containerId, displayHeaders, rows, maxCols);
  }

  /* ── Render missing value analysis ── */
  function renderMissingAnalysis(containerId, missingCounts, totalRows) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    const entries = Object.entries(missingCounts).filter(([, v]) => v > 0);
    if (!entries.length) {
      wrap.innerHTML = '<div style="color:var(--green);font-size:13px;padding:12px 0">✓ No missing values detected in this dataset.</div>';
      return;
    }
    let html = '';
    entries.forEach(([col, count]) => {
      const pct = ((count / totalRows) * 100).toFixed(1);
      const color = pct > 10 ? 'var(--red)' : pct > 5 ? 'var(--orange)' : 'var(--cyan)';
      html += `<div class="hbar-row">
        <div class="hbar-lbl" style="width:160px">${col}</div>
        <div class="hbar-track">
          <div class="hbar-fill" style="width:${Math.min(pct * 10, 100)}%;background:${color}"></div>
        </div>
        <div class="hbar-val" style="color:${color}">${count} (${pct}%)</div>
      </div>`;
    });
    wrap.innerHTML = html;
  }

  /* ── Show processing status ── */
  function showStatus(msg, type) {
    const el = document.getElementById('prep-status');
    if (!el) return;
    const colors = { info: 'var(--accent)', success: 'var(--green)', error: 'var(--red)', warn: 'var(--orange)' };
    el.style.display = 'block';
    el.style.color = colors[type] || 'var(--txt1)';
    el.textContent = msg;
  }

  /* ── Render outlier analysis ── */
  function renderOutlierAnalysis(containerId, outlierAnalysis) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    
    const { outliersByCol, totalOutliers } = outlierAnalysis;
    
    if (totalOutliers === 0) {
      wrap.innerHTML = '<div style="color:var(--green);font-size:13px;padding:12px 0">✓ No outliers detected using IQR method (Q1 - 1.5×IQR, Q3 + 1.5×IQR).</div>';
      return;
    }
    
    let html = `<div style="margin-bottom:14px;padding:10px 14px;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);border-radius:var(--r1);font-size:12px;color:var(--orange)">
      ⚠️ <strong>${totalOutliers}</strong> outliers detected across all columns using IQR method
    </div>`;
    
    Object.entries(outliersByCol).forEach(([col, data]) => {
      if (data.count === 0) return;
      
      const pct = ((data.count / (data.outliers.length + 100)) * 100).toFixed(1); // Rough percentage
      const color = data.count > 10 ? 'var(--red)' : data.count > 5 ? 'var(--orange)' : 'var(--cyan)';
      
      html += `<div class="hbar-row" style="margin-bottom:8px">
        <div class="hbar-lbl" style="width:200px">${col}</div>
        <div style="flex:1;display:flex;flex-direction:column;gap:3px">
          <div style="display:flex;align-items:center;gap:10px">
            <div class="hbar-track" style="flex:1">
              <div class="hbar-fill" style="width:${Math.min(data.count * 3, 100)}%;background:${color}"></div>
            </div>
            <div class="hbar-val" style="color:${color};min-width:60px">${data.count} outliers</div>
          </div>
          <div style="font-size:10px;color:var(--txt3)">
            IQR: ${data.iqr} | Bounds: [${data.lowerBound}, ${data.upperBound}] | Q1: ${data.q1}, Q3: ${data.q3}
          </div>
        </div>
      </div>`;
    });
    
    wrap.innerHTML = html;
  }

  /* ── Update preprocessing stat cards ── */
  function updatePrepStats(result) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    set('prep-stat-original',    result.originalCount.toLocaleString());
    set('prep-stat-duplicates',  result.dupsRemoved.toLocaleString());
    set('prep-stat-missing',     result.missingHandled.toLocaleString());
    set('prep-stat-final',       result.finalCount.toLocaleString());

    const retPct = ((result.finalCount / result.originalCount) * 100).toFixed(1);
    set('prep-stat-retention',   retPct + '%');

    const totalMissing = Object.values(result.missingBefore).reduce((a, b) => a + b, 0);
    set('prep-stat-total-missing', totalMissing.toLocaleString());
  }

  /* ── Main: process and render ── */
  function processAndRender(csvText, datasetLabel) {
    showStatus('⏳ Processing dataset…', 'info');

    setTimeout(() => {
      try {
        const result = window.runPreprocess(csvText);
        window._lastPrepResult = result;

        updatePrepStats(result);

        // Raw preview
        renderPreviewTable('raw-preview-table', result.headers, result.rawPreview, 8);

        // Missing value bars
        renderMissingAnalysis('missing-analysis-wrap', result.missingBefore, result.originalCount);

        // Outlier analysis
        if (result.outlierAnalysis) {
          renderOutlierAnalysis('outlier-analysis-wrap', result.outlierAnalysis);
        }

        // Cleaned preview
        renderCleanedPreviewTable('cleaned-preview-table', result.headers, result.cleanedPreview);

        // Show sections
        document.getElementById('prep-results-section').style.display = 'block';
        
        // Show download buttons
        const downloadBtn = document.getElementById(`btn-download-cleaned-${result.type}`);
        if (downloadBtn) downloadBtn.style.display = 'inline-flex';

        showStatus(`✓ ${datasetLabel} processed — ${result.finalCount.toLocaleString()} clean records ready.`, 'success');

        // Auto-trigger ML if data for both modules is available
        if (window.processedNetwork && typeof window.renderNetworkMLUI === 'function') {
          window.renderNetworkMLUI();
        }
        if (window.processedCustomer && typeof window.renderCustomerMLUI === 'function') {
          window.renderCustomerMLUI();
        }

        // Refresh dashboard if visible
        if (typeof window.refreshDashboard === 'function') {
          window.refreshDashboard();
        }

      } catch (e) {
        showStatus('✕ Error processing file: ' + e.message, 'error');
      }
    }, 50);
  }

  /* ── File upload handler ── */
  function attachUploadHandlers() {
    // Network upload
    const netInput = document.getElementById('network-csv-input');
    if (netInput) {
      netInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => processAndRender(e.target.result, 'Network dataset');
        reader.readAsText(file);
      });
    }

    // Customer upload
    const custInput = document.getElementById('customer-csv-input');
    if (custInput) {
      custInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => processAndRender(e.target.result, 'Customer dataset');
        reader.readAsText(file);
      });
    }

    // Load sample buttons
    const btnNet = document.getElementById('btn-load-sample-network');
    if (btnNet) {
      btnNet.addEventListener('click', () => processAndRender(window.SAMPLE_NETWORK_CSV, 'Sample network dataset'));
    }

    const btnCust = document.getElementById('btn-load-sample-customer');
    if (btnCust) {
      btnCust.addEventListener('click', () => processAndRender(window.SAMPLE_CUSTOMER_CSV, 'Sample customer dataset'));
    }

    // Download sample buttons
    document.querySelectorAll('[data-download-sample]').forEach(btn => {
      btn.addEventListener('click', () => window.downloadSampleCSV(btn.dataset.downloadSample));
    });
  }

  /* ── Init on DOMContentLoaded ── */
  function initPreprocess() {
    attachUploadHandlers();
    // Auto-load samples so modules 2 & 3 have data from first visit
    setTimeout(() => {
      processAndRender(window.SAMPLE_NETWORK_CSV,  'Sample network dataset');
      processAndRender(window.SAMPLE_CUSTOMER_CSV, 'Sample customer dataset');
    }, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPreprocess);
  else initPreprocess();

})();
