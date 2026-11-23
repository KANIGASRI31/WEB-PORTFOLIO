/* ═══════════════════════════════════════════
   TelecomIQ — App Logic  (all modules wired)
═══════════════════════════════════════════ */
(function(){
  'use strict';

  /* ── Clock ── */
  function tick(){
    const el=document.getElementById('clock');
    if(el) el.textContent=new Date().toLocaleTimeString('en-IN',{hour12:false});
  }
  setInterval(tick,1000); tick();

  /* ── Navigation ── */
  const pageMap={
    dashboard:    ['Network Overview','Real-time platform summary'],
    network:      ['Failure Prediction','ML-based network failure analysis'],
    customers:    ['Customer Behaviour','Usage patterns, segmentation & churn'],
    preprocessing:['Data Preprocessing','Data collection, cleaning & preparation'],
    analytics:    ['Integrated Analytics','Unified decision-support dashboard'],
  };

  window.navigate=function(id){
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
    const pg=document.getElementById('page-'+id);
    if(pg) pg.classList.add('active');
    const lk=document.querySelector(`.nav-link[data-page="${id}"]`);
    if(lk) lk.classList.add('active');
    const [t,s]=pageMap[id]||['Dashboard',''];
    const tt=document.getElementById('topbar-title');
    const ts=document.getElementById('topbar-sub');
    if(tt) tt.textContent=t;
    if(ts) ts.textContent=s;
    setTimeout(()=>renderPageCharts(id),80);
    window.scrollTo(0,0);
  };

  document.querySelectorAll('.nav-link[data-page]').forEach(l=>{
    l.addEventListener('click',e=>{e.preventDefault();navigate(l.dataset.page);});
  });

  /* ── Counter animation ── */
  function counter(el,target,sfx,dec){
    sfx=sfx||''; dec=dec||0;
    const dur=1400,start=performance.now();
    (function step(now){
      const p=Math.min((now-start)/dur,1);
      const e=1-Math.pow(1-p,3);
      el.textContent=dec>0?(e*target).toFixed(dec)+sfx:Math.round(e*target).toLocaleString()+sfx;
      if(p<1) requestAnimationFrame(step);
    })(start);
  }

  /* ── Progress bars ── */
  function runBars(){
    setTimeout(()=>{
      document.querySelectorAll('[data-pct]').forEach(b=>{
        b.style.width=b.dataset.pct+'%';
      });
    },400);
  }

  /* ── Populate: node table (static data) ── */
  function buildNodeTable(){
    const tb=document.getElementById('nodeTableBody');
    if(!tb) return;
    tb.innerHTML=T.nodes.map(n=>{
      const sb=n.status==='normal'?'<span class="badge b-gr">✓ Normal</span>':
               n.status==='warning'?'<span class="badge b-or">⚠ Warning</span>':
               n.status==='failure'?'<span class="badge b-rd">✕ Failure</span>':
               '<span class="badge b-rd">✕ Critical</span>';
      const sc=n.signal>=70?'c-gr':n.signal>=45?'c-or':'c-rd';
      const lc=n.latency<=25?'c-gr':n.latency<=60?'c-or':'c-rd';
      const pc=n.pl<=1?'c-gr':n.pl<=5?'c-or':'c-rd';
      return`<tr>
        <td><strong>${n.name}</strong></td>
        <td><span class="badge b-bl">${n.type}</span></td>
        <td>${n.region}</td>
        <td class="mono ${sc}">${n.signal}%</td>
        <td class="mono ${lc}">${n.latency} ms</td>
        <td class="mono">${n.bw}%</td>
        <td class="mono ${pc}">${n.pl}%</td>
        <td class="mono">${n.uptime}%</td>
        <td>${sb}</td>
        <td><button class="btn" onclick="alert('Detailed diagnostics for ${n.name}')">Diagnose</button></td>
      </tr>`;
    }).join('');
  }

  /* ── Populate: prediction table (static/ML) ── */
  function buildPredTable(){
    const tb=document.getElementById('predTableBody');
    if(!tb) return;
    tb.innerHTML=T.predictions.map(p=>{
      const sb=p.sev==='critical'?'<span class="badge b-rd">🔴 Critical</span>':
               p.sev==='high'?'<span class="badge b-or">🟠 High</span>':
               '<span class="badge b-bl">🔵 Medium</span>';
      const pc=p.prob>=85?'c-rd':p.prob>=60?'c-or':'c-bl';
      return`<tr>
        <td><strong>${p.node}</strong></td>
        <td class="mono ${pc}">${p.prob}%</td>
        <td class="mono">${p.ttf}</td>
        <td style="max-width:260px">${p.reason}</td>
        <td>${sb}</td>
        <td><button class="btn btn-rd" onclick="alert('Dispatching maintenance alert for ${p.node}')">Alert Team</button></td>
      </tr>`;
    }).join('');
  }

  /* ── Populate: customer table (static) ── */
  function buildCustomerTable(){
    const tb=document.getElementById('customerTableBody');
    if(!tb) return;
    tb.innerHTML=T.customers.map(c=>{
      const cb=c.churn==='low'?'<span class="badge b-gr">Low</span>':
               c.churn==='medium'?'<span class="badge b-or">Medium</span>':
               '<span class="badge b-rd">High</span>';
      const sb=c.seg==='Premium'?'<span class="badge b-pu">Premium</span>':
               c.seg==='Standard'?'<span class="badge b-bl">Standard</span>':
               '<span class="badge b-rd">At-Risk</span>';
      return`<tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.plan}</td>
        <td class="mono">${c.tenure} mo</td>
        <td class="mono">₹${c.bill.toLocaleString()}</td>
        <td class="mono">${c.data} GB</td>
        <td class="mono">${c.calls} min</td>
        <td class="mono">₹${c.clv.toLocaleString()}</td>
        <td>${cb}</td>
        <td>${sb}</td>
      </tr>`;
    }).join('');
  }

  /* ── Populate: events feed ── */
  function buildEvents(){
    const wrap=document.getElementById('eventsFeed');
    if(!wrap) return;
    // Augment with ML alerts if available
    let events=[...T.events];
    if(window.mlResults&&window.mlResults.network&&window.mlResults.network.alerts){
      const mlAlerts=window.mlResults.network.alerts.slice(0,4).map(a=>({
        time:new Date().toLocaleTimeString('en-IN',{hour12:false,hour:'2-digit',minute:'2-digit'}),
        node:a.node,
        type:'ML Failure Alert',
        sev:a.sev,
        resolved:false,
        prob:a.prob,
      }));
      events=[...mlAlerts,...events].slice(0,10);
    }
    wrap.innerHTML=events.map(ev=>{
      const ic=ev.sev==='critical'?'ai-rd':ev.sev==='high'?'ai-or':ev.sev==='medium'?'ai-bl':'ai-gr';
      const em=ev.sev==='critical'?'🔴':ev.sev==='high'?'🟠':ev.sev==='medium'?'🔵':'🟢';
      const res=ev.resolved?'<span style="color:var(--green);font-size:11px;margin-left:6px">✓ Resolved</span>':'';
      const prob=ev.prob?`<span style="color:var(--red);font-size:11px;margin-left:6px">${ev.prob}% probability</span>`:'';
      return`<div class="alert">
        <div class="alert-ico ${ic}">${em}</div>
        <div class="alert-body">
          <p>${ev.type} — <strong>${ev.node}</strong>${res}${prob}</p>
          <small>${ev.time}</small>
        </div>
      </div>`;
    }).join('');
  }

  /* ── Populate: node tiles ── */
  function buildNodeTiles(){
    const grid=document.getElementById('nodeTiles');
    if(!grid) return;
    grid.innerHTML=T.nodes.map(n=>{
      const cls=n.status==='normal'?'nt-gr':n.status==='warning'?'nt-or':'nt-rd';
      const badge=n.status==='normal'?'<span class="badge b-gr" style="font-size:10px">Normal</span>':
                  n.status==='warning'?'<span class="badge b-or" style="font-size:10px">Warning</span>':
                  `<span class="badge b-rd" style="font-size:10px">${n.status==='failure'?'Failure':'Critical'}</span>`;
      return`<div class="ntile ${cls}">
        <div class="ntile-name">${n.name}</div>
        <div class="ntile-type">${n.type} · ${n.region}</div>
        ${badge}
        <div class="ntile-metrics">
          <span class="ntile-m">📶 ${n.signal}%</span>
          <span class="ntile-m">⏱ ${n.latency}ms</span>
          <span class="ntile-m">📡 ${n.bw}%</span>
        </div>
      </div>`;
    }).join('');
  }

  /* ── Populate: preprocessing table ── */
  function buildPrepTable(){
    const tb=document.getElementById('prepTableBody');
    if(!tb) return;
    tb.innerHTML=T.prepReport.map(r=>{
      const pct=((r.clean/r.raw)*100).toFixed(1);
      const pc=pct>=98?'c-gr':pct>=95?'c-or':'c-rd';
      return`<tr>
        <td><strong>${r.param}</strong></td>
        <td class="mono">${r.raw.toLocaleString()}</td>
        <td class="mono c-or">${r.miss}</td>
        <td class="mono c-rd">${r.out}</td>
        <td class="mono c-gr">${r.clean.toLocaleString()}</td>
        <td class="mono ${pc}">${pct}%</td>
        <td><span class="badge b-bl">${r.type}</span></td>
        <td style="font-size:11px;color:var(--txt3)">${r.method}</td>
      </tr>`;
    }).join('');
  }

  /* ── Populate: correlation heatmap ── */
  function buildCorrHeatmap(){
    const wrap=document.getElementById('corrHeatmap');
    if(!wrap) return;
    const feats=T.corrFeatures;
    const mat=T.corrMatrix;
    let html=`<table class="corr-table"><thead><tr><th></th>${feats.map(f=>`<th>${f}</th>`).join('')}</tr></thead><tbody>`;
    mat.forEach((row,i)=>{
      html+=`<tr><th>${feats[i]}</th>`;
      row.forEach((v,j)=>{
        const cls=i===j?'corr-diag':v>=0.7?'corr-high-pos':v>=0.4?'corr-mid-pos':v>=-0.4?'corr-low':v>=-0.7?'corr-mid-neg':'corr-high-neg';
        html+=`<td class="${cls}">${v.toFixed(2)}</td>`;
      });
      html+='</tr>';
    });
    html+='</tbody></table>';
    wrap.innerHTML=html;
  }

  /* ── Populate: usage heatmap ── */
  function buildUsageHeatmap(){
    const wrap=document.getElementById('usageHeatmap');
    if(!wrap) return;
    const uh=T.usageHeatmap;
    function col(v){
      if(v>=85) return'rgba(16,185,129,.7)';
      if(v>=70) return'rgba(16,185,129,.35)';
      if(v>=55) return'rgba(245,158,11,.35)';
      return'rgba(239,68,68,.3)';
    }
    let html=`<table class="heatmap"><thead><tr><th></th>${uh.days.map(d=>`<th>${d}</th>`).join('')}</tr></thead><tbody>`;
    uh.customers.forEach((c,i)=>{
      html+=`<tr><td class="row-lbl">${c}</td>${uh.values[i].map(v=>`<td style="background:${col(v)};color:var(--txt1)">${v}%</td>`).join('')}</tr>`;
    });
    html+='</tbody></table>';
    wrap.innerHTML=html;
  }

  /* ── Populate: CLV table ── */
  function buildCLVTable(){
    const tb=document.getElementById('clvTableBody');
    if(!tb) return;
    const sorted=[...T.customers].sort((a,b)=>b.clv-a.clv).slice(0,10);
    tb.innerHTML=sorted.map((c,i)=>{
      const medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`;
      return`<tr>
        <td>${medal}</td>
        <td><strong>${c.name}</strong></td>
        <td>${c.plan}</td>
        <td class="mono">${c.tenure} mo</td>
        <td class="mono">₹${c.bill.toLocaleString()}</td>
        <td class="mono c-gr"><strong>₹${c.clv.toLocaleString()}</strong></td>
        <td><span class="badge ${c.churn==='low'?'b-gr':c.churn==='medium'?'b-or':'b-rd'}">${c.churn}</span></td>
      </tr>`;
    }).join('');
  }

  /* ── Populate: region cards ── */
  function buildRegionCards(){
    const wrap=document.getElementById('regionCards');
    if(!wrap) return;
    const flags={'North':'🌍','South':'🌏','East':'🌐','West':'🌎','Central':'🏢'};
    wrap.innerHTML=T.regions.map(r=>{
      const sc=r.signal>=80?'var(--green)':r.signal>=60?'var(--orange)':'var(--red)';
      const sb=r.fail>0?'b-rd':r.warn>0?'b-or':'b-gr';
      return`<div class="region-card">
        <h4>${flags[r.name]||'📡'} ${r.name}
          <span class="badge ${sb}" style="margin-left:auto">${r.fail>0?'⚠ Failure':r.warn>0?'⚠ Warning':'✓ OK'}</span>
        </h4>
        <div class="mrow"><span class="mrow-lbl">Nodes</span><span class="mrow-val">${r.nodes}</span></div>
        <div class="mrow"><span class="mrow-lbl">Normal / Warn / Fail</span><span class="mrow-val">${r.normal}/${r.warn}/${r.fail}</span></div>
        <div class="mrow"><span class="mrow-lbl">Avg Signal</span><span class="mrow-val" style="color:${sc}">${r.signal}%</span></div>
        <div class="mrow"><span class="mrow-lbl">Avg Latency</span><span class="mrow-val">${r.latency} ms</span></div>
        <div class="mrow" style="border:0"><span class="mrow-lbl">Uptime</span><span class="mrow-val c-gr">${r.uptime}%</span></div>
        <div class="pbar" style="margin-top:8px"><div class="pfill pf-bl" data-pct="${r.signal}"></div></div>
      </div>`;
    }).join('');
  }

  /* ── Populate: churn list ── */
  function buildChurnList(){
    const wrap=document.getElementById('churnList');
    if(!wrap) return;
    const high=T.customers.filter(c=>c.churn==='high');
    wrap.innerHTML=high.map(c=>`<div class="crow">
      <div>
        <div class="crow-name">${c.name}</div>
        <div class="crow-plan">${c.plan} · ${c.tenure} months tenure · ₹${c.bill}/mo</div>
      </div>
      <span class="badge b-rd">High Risk</span>
    </div>`).join('');
  }

  /* ═══════════════════════════════════════════
     DASHBOARD REFRESH — from ML results
  ═══════════════════════════════════════════ */
  window.refreshDashboard = function(){
    const netML  = window.mlResults && window.mlResults.network;
    const custML = window.mlResults && window.mlResults.customer;
    const k      = T.kpi;

    // Network KPIs
    const totalNodes  = netML ? netML.totalNodes  : k.totalNodes;
    const failNodes   = netML ? netML.failureCount : k.failNodes;
    const activeNodes = totalNodes - failNodes;
    const networkHealth = netML ? netML.networkHealth : 72;
    const avgSignal   = netML ? netML.avgSignal   : k.avgSignal;
    const avgLatency  = netML ? netML.avgLatency  : k.avgLatency;
    const avgPl       = netML ? netML.avgPacketLoss : k.avgPl;
    const alertCount  = netML ? netML.alerts.length : k.predFailures;
    const netAcc      = netML ? netML.primaryMetrics.accuracy : k.modelAcc;

    // Customer KPIs
    const totalCustomers = custML ? custML.totalCustomers : k.totalCustomers;
    const churnRisk      = custML ? custML.highRisk       : k.churnRisk;
    const churnRate      = custML ? custML.churnRate      : 4.9;
    const premium        = custML ? (custML.segCounts.Premium || 0) : k.premium;
    const custAcc        = custML ? custML.metrics.accuracy : 91.8;

    // Update KPI counters
    const setKpi=(id,val,sfx,dec)=>{
      const el=document.getElementById(id);
      if(el) counter(el,val,sfx||'',dec||0);
    };
    setKpi('kpi-nodes',      totalNodes);
    setKpi('kpi-active',     activeNodes);
    setKpi('kpi-warn',       netML ? (netML.results.filter(r=>r.probability>40&&r.probability<=70).length) : k.warnNodes);
    setKpi('kpi-fail',       failNodes);
    setKpi('kpi-uptime',     netML ? (100-netML.failureRate) : k.uptime, '%', 1);
    setKpi('kpi-predfail',   alertCount);
    setKpi('kpi-customers',  totalCustomers);
    setKpi('kpi-churn',      churnRisk);
    setKpi('kpi-signal',     avgSignal, '%');
    setKpi('kpi-latency',    avgLatency, ' ms');
    setKpi('kpi-pl',         avgPl, '%', 1);
    setKpi('kpi-premium',    premium);
    setKpi('kpi-nps',        k.nps);
    setKpi('kpi-modelacc',   netAcc, '%', 1);
    setKpi('kpi-revenue',    k.revenue, 'L');
    setKpi('kpi-quality',    k.qualityScore, '%', 1);
    setKpi('kpi-processed',  window.processedNetwork ? window.processedNetwork.finalCount : k.dataProcessed);

    // Gauge label (dynamic network health)
    const gv=document.querySelector('.gauge-label .gval');
    const gl=document.querySelector('.gauge-label .glbl');
    if(gv) gv.textContent=networkHealth.toFixed(0);
    if(gl) gl.textContent=networkHealth>=80?'Good':networkHealth>=60?'Moderate':'Critical';

    // Analytics page health bars (dynamic)
    const hbars=document.querySelectorAll('.hbar-fill[data-pct]');
    hbars.forEach(b=>{
      b.style.width=b.dataset.pct+'%';
    });

    // Rebuild event feed with ML alerts
    buildEvents();

    // Update integrated analytics KPIs
    setKpi('dash-total-customers', totalCustomers);
    setKpi('dash-fail-nodes',      failNodes);
    setKpi('dash-health',          networkHealth, '%', 1);
    setKpi('dash-churn-pct',       churnRate, '%', 1);
    setKpi('dash-high-risk',       churnRisk);
    setKpi('dash-net-accuracy',    netAcc, '%', 1);
    setKpi('dash-cust-accuracy',   custAcc, '%', 1);

    // Dashboard recommendations (dynamic)
    buildDashboardRecommendations(netML, custML);

    // Model leaderboard (analytics page)
    if (typeof window.buildModelLeaderboard === 'function') {
      window.buildModelLeaderboard();
    }
  };

  /* ── Build dynamic recommendations ── */
  function buildDashboardRecommendations(netML, custML){
    const wrap=document.getElementById('dynamic-recs');
    if(!wrap) return;

    const recs=[];

    if(netML){
      const critAlerts=netML.alerts.filter(a=>a.sev==='critical');
      if(critAlerts.length){
        recs.push({cls:'rc-rd',icon:'🔴',title:'Immediate Action Required',
          text:`${critAlerts.length} node(s) have >80% failure probability: ${critAlerts.slice(0,2).map(a=>a.node).join(', ')}. Dispatch maintenance immediately.`});
      }
      const highAlerts=netML.alerts.filter(a=>a.sev==='high');
      if(highAlerts.length){
        recs.push({cls:'rc-or',icon:'🟠',title:'Preventive Maintenance',
          text:`${highAlerts.length} node(s) show high failure risk. Schedule inspection within 24 hours: ${highAlerts.map(a=>a.node).join(', ')}.`});
      }
      if(netML.networkHealth<70){
        recs.push({cls:'rc-rd',icon:'🔴',title:'Network Health Critical',
          text:`Overall network health is ${netML.networkHealth.toFixed(1)}% — below the 70% threshold. Immediate infrastructure review required.`});
      }
    }

    if(custML){
      if(custML.highRisk>0){
        recs.push({cls:'rc-or',icon:'🟠',title:'Churn Prevention Campaign',
          text:`${custML.highRisk} high-risk customers identified by the ML churn model. Issue targeted upgrade offers and loyalty discounts.`});
      }
      if(custML.churnRate>5){
        recs.push({cls:'rc-rd',icon:'🔴',title:'Churn Rate Elevated',
          text:`Monthly churn rate is ${custML.churnRate}% — exceeds the 5% threshold. Priority retention actions are required.`});
      }
      const atrisk=custML.segCounts['At-Risk']||0;
      if(atrisk>0){
        recs.push({cls:'rc-bl',icon:'🔵',title:'At-Risk Segment',
          text:`K-Means clustering identified ${atrisk} customers in the At-Risk segment with low tenure and usage. Offer onboarding support and discounts.`});
      }
    }

    // Always add positive/strategic items
    recs.push({cls:'rc-gr',icon:'🟢',title:'ML Models Deployed',
      text:`Logistic Regression and Naïve Bayes models are actively predicting failures and churn. Schedule monthly retraining with fresh data.`});
    recs.push({cls:'rc-cy',icon:'🔵',title:'Data Quality',
      text:`Dataset preprocessing pipeline is active. Ensure all CSV uploads pass the 95% quality threshold before model inference.`});

    wrap.innerHTML=recs.map(r=>`<div class="rec-card ${r.cls}"><h4>${r.icon} ${r.title}</h4><p>${r.text}</p></div>`).join('');
  }

  /* ═══════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════ */
  function init(){
    buildNodeTable();
    buildPredTable();
    buildCustomerTable();
    buildEvents();
    buildNodeTiles();
    buildPrepTable();
    buildCorrHeatmap();
    buildUsageHeatmap();
    buildCLVTable();
    buildRegionCards();
    buildChurnList();
    navigate('dashboard');
    setTimeout(runBars,600);
    // Initial dashboard counters (static fallback)
    setTimeout(()=>{
      const k=T.kpi;
      [
        ['kpi-nodes',k.totalNodes,''],
        ['kpi-active',k.activeNodes,''],
        ['kpi-warn',k.warnNodes,''],
        ['kpi-fail',k.failNodes,''],
        ['kpi-uptime',k.uptime,'%',1],
        ['kpi-signal',k.avgSignal,'%'],
        ['kpi-latency',k.avgLatency,' ms'],
        ['kpi-pl',k.avgPl,'%',1],
        ['kpi-customers',k.totalCustomers,''],
        ['kpi-churn',k.churnRisk,''],
        ['kpi-premium',k.premium,''],
        ['kpi-nps',k.nps,''],
        ['kpi-predfail',k.predFailures,''],
        ['kpi-modelacc',k.modelAcc,'%',1],
        ['kpi-revenue',k.revenue,'L'],
        ['kpi-quality',k.qualityScore,'%',1],
        ['kpi-processed',k.dataProcessed,''],
      ].forEach(([id,val,sfx,dec])=>{
        const el=document.getElementById(id);
        if(el) counter(el,val,sfx,dec||0);
      });
    },200);

    // Once ML results arrive, refresh dashboard
    setTimeout(()=>{
      if(window.mlResults) window.refreshDashboard();
    },1500);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();

})();


/* ═══════════════════════════════════════════
   DATE RANGE FILTERING
═══════════════════════════════════════════ */
window.dateFilterState = {
  active: false,
  fromDate: null,
  toDate: null,
  originalNetwork: null,
  originalCustomer: null
};

/* ── Loading Spinner Control ── */
window.showLoading = function(text, subtext) {
  const overlay = document.getElementById('loadingOverlay');
  const textEl = overlay.querySelector('.loading-text');
  const subtextEl = overlay.querySelector('.loading-subtext');
  if (textEl && text) textEl.textContent = text;
  if (subtextEl && subtext) subtextEl.textContent = subtext;
  overlay.classList.add('active');
};

window.hideLoading = function() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.remove('active');
};

window.applyDateFilter = function() {
  const fromInput = document.getElementById('date-from');
  const toInput = document.getElementById('date-to');
  const btnReset = document.getElementById('btn-reset-filter');

  if (!fromInput.value || !toInput.value) {
    alert('Please select both start and end dates.');
    return;
  }

  const fromDate = new Date(fromInput.value);
  const toDate = new Date(toInput.value);

  if (fromDate > toDate) {
    alert('Start date must be before end date.');
    return;
  }

  // Store original data on first filter
  if (!window.dateFilterState.originalNetwork && window.processedNetwork) {
    window.dateFilterState.originalNetwork = JSON.parse(JSON.stringify(window.processedNetwork));
  }
  if (!window.dateFilterState.originalCustomer && window.processedCustomer) {
    window.dateFilterState.originalCustomer = JSON.parse(JSON.stringify(window.processedCustomer));
  }

  window.dateFilterState.active = true;
  window.dateFilterState.fromDate = fromDate;
  window.dateFilterState.toDate = toDate;

  // Filter datasets
  if (window.dateFilterState.originalNetwork) {
    const filteredNetwork = filterDataByDate(window.dateFilterState.originalNetwork.rows, fromDate, toDate);
    window.processedNetwork = {
      ...window.dateFilterState.originalNetwork,
      rows: filteredNetwork,
      finalCount: filteredNetwork.length
    };
  }

  if (window.dateFilterState.originalCustomer) {
    const filteredCustomer = filterDataByDate(window.dateFilterState.originalCustomer.rows, fromDate, toDate);
    window.processedCustomer = {
      ...window.dateFilterState.originalCustomer,
      rows: filteredCustomer,
      finalCount: filteredCustomer.length
    };
  }

  // Re-run ML models with filtered data
  if (window.processedNetwork && typeof window.runNetworkML === 'function') {
    window.runNetworkML();
  }
  if (window.processedCustomer && typeof window.runCustomerML === 'function') {
    window.runCustomerML();
  }

  // Refresh dashboards
  if (typeof window.refreshDashboard === 'function') {
    window.refreshDashboard();
  }

  // Show reset button
  if (btnReset) btnReset.style.display = 'inline-block';

  // Visual feedback
  const dateLabel = fromInput.previousElementSibling;
  if (dateLabel) {
    dateLabel.style.color = 'var(--accent)';
    dateLabel.textContent = 'FILTERED:';
  }

  console.log(`✅ Date filter applied: ${fromInput.value} to ${toInput.value}`);
  console.log(`Network records: ${window.processedNetwork?.finalCount || 0}, Customer records: ${window.processedCustomer?.finalCount || 0}`);
};

window.resetDateFilter = function() {
  const fromInput = document.getElementById('date-from');
  const toInput = document.getElementById('date-to');
  const btnReset = document.getElementById('btn-reset-filter');

  // Restore original data
  if (window.dateFilterState.originalNetwork) {
    window.processedNetwork = JSON.parse(JSON.stringify(window.dateFilterState.originalNetwork));
  }
  if (window.dateFilterState.originalCustomer) {
    window.processedCustomer = JSON.parse(JSON.stringify(window.dateFilterState.originalCustomer));
  }

  // Reset state
  window.dateFilterState.active = false;
  window.dateFilterState.fromDate = null;
  window.dateFilterState.toDate = null;

  // Clear inputs
  fromInput.value = '';
  toInput.value = '';

  // Re-run ML models with original data
  if (window.processedNetwork && typeof window.runNetworkML === 'function') {
    window.runNetworkML();
  }
  if (window.processedCustomer && typeof window.runCustomerML === 'function') {
    window.runCustomerML();
  }

  // Refresh dashboards
  if (typeof window.refreshDashboard === 'function') {
    window.refreshDashboard();
  }

  // Hide reset button
  if (btnReset) btnReset.style.display = 'none';

  // Visual feedback
  const dateLabel = fromInput.previousElementSibling;
  if (dateLabel) {
    dateLabel.style.color = 'var(--txt3)';
    dateLabel.textContent = 'DATE RANGE:';
  }

  console.log('✅ Date filter reset - showing all data');
};

function filterDataByDate(rows, fromDate, toDate) {
  if (!rows || rows.length === 0) return rows;

  // Try to find a date/timestamp column
  const firstRow = rows[0];
  const dateColumns = Object.keys(firstRow).filter(k => 
    k.toLowerCase().includes('date') || 
    k.toLowerCase().includes('time') ||
    k.toLowerCase().includes('timestamp') ||
    k === 'created_at' || 
    k === 'updated_at'
  );

  if (dateColumns.length === 0) {
    console.warn('⚠️ No date column found - generating synthetic timestamps');
    // Generate synthetic timestamps for demo purposes
    const totalDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
    return rows.filter((_, idx) => {
      // Distribute rows evenly across the date range
      const syntheticDate = new Date(fromDate.getTime() + (idx / rows.length) * totalDays * 24 * 60 * 60 * 1000);
      return syntheticDate >= fromDate && syntheticDate <= toDate;
    });
  }

  const dateCol = dateColumns[0];
  console.log(`📅 Filtering by column: ${dateCol}`);

  return rows.filter(row => {
    const cellValue = row[dateCol];
    if (!cellValue) return true; // Keep rows without dates

    let rowDate;
    if (cellValue instanceof Date) {
      rowDate = cellValue;
    } else if (typeof cellValue === 'string') {
      rowDate = new Date(cellValue);
    } else if (typeof cellValue === 'number') {
      rowDate = new Date(cellValue);
    } else {
      return true; // Keep rows with unparseable dates
    }

    if (isNaN(rowDate.getTime())) return true; // Keep invalid dates
    return rowDate >= fromDate && rowDate <= toDate;
  });
}


/* ═══════════════════════════════════════════
   MODEL LEADERBOARD
═══════════════════════════════════════════ */
window.buildModelLeaderboard = function() {
  const wrap = document.getElementById('model-leaderboard-wrap');
  if (!wrap) return;

  const models = [];

  // Network models
  if (window.mlResults && window.mlResults.network) {
    const net = window.mlResults.network;
    models.push({
      name: 'Network Failure - Logistic Regression',
      type: 'Classification',
      module: 'Network',
      accuracy: net.primaryMetrics.accuracy,
      precision: net.primaryMetrics.precision,
      recall: net.primaryMetrics.recall,
      f1: net.primaryMetrics.f1,
      badge: 'b-bl'
    });
    
    if (net.naiveBayesMetrics) {
      models.push({
        name: 'Network Failure - Naïve Bayes',
        type: 'Classification',
        module: 'Network',
        accuracy: net.naiveBayesMetrics.accuracy,
        precision: net.naiveBayesMetrics.precision,
        recall: net.naiveBayesMetrics.recall,
        f1: net.naiveBayesMetrics.f1,
        badge: 'b-cy'
      });
    }
  }

  // Customer models
  if (window.mlResults && window.mlResults.customer) {
    const cust = window.mlResults.customer;
    
    if (cust.models && cust.models.randomForest) {
      models.push({
        name: 'Churn Prediction - Random Forest',
        type: 'Classification',
        module: 'Customer',
        accuracy: cust.models.randomForest.accuracy,
        precision: cust.models.randomForest.precision,
        recall: cust.models.randomForest.recall,
        f1: cust.models.randomForest.f1,
        badge: 'b-gr'
      });
    }
    
    if (cust.models && cust.models.logistic) {
      models.push({
        name: 'Churn Prediction - Logistic Regression',
        type: 'Classification',
        module: 'Customer',
        accuracy: cust.models.logistic.accuracy,
        precision: cust.models.logistic.precision,
        recall: cust.models.logistic.recall,
        f1: cust.models.logistic.f1,
        badge: 'b-pu'
      });
    }
    
    if (cust.models && cust.models.naiveBayes) {
      models.push({
        name: 'Churn Prediction - Naïve Bayes',
        type: 'Classification',
        module: 'Customer',
        accuracy: cust.models.naiveBayes.accuracy,
        precision: cust.models.naiveBayes.precision,
        recall: cust.models.naiveBayes.recall,
        f1: cust.models.naiveBayes.f1,
        badge: 'b-or'
      });
    }

    // K-Means clustering (no accuracy metric, use silhouette score if available)
    if (cust.kmeansInertia !== undefined) {
      models.push({
        name: 'Customer Segmentation - K-Means',
        type: 'Clustering',
        module: 'Customer',
        accuracy: null,
        precision: null,
        recall: null,
        f1: null,
        inertia: cust.kmeansInertia,
        badge: 'b-cy'
      });
    }
  }

  // Sort by accuracy (descending)
  models.sort((a, b) => {
    if (a.accuracy === null) return 1;
    if (b.accuracy === null) return -1;
    return b.accuracy - a.accuracy;
  });

  if (models.length === 0) {
    wrap.innerHTML = '<p style="color:var(--txt3);text-align:center;padding:20px">No ML models trained yet. Upload datasets and run preprocessing first.</p>';
    return;
  }

  let html = '<div style="overflow-x:auto"><table class="tbl"><thead><tr>';
  html += '<th>Rank</th><th>Model</th><th>Type</th><th>Module</th>';
  html += '<th>Accuracy</th><th>Precision</th><th>Recall</th><th>F1 Score</th>';
  html += '</tr></thead><tbody>';

  models.forEach((m, idx) => {
    const rank = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
    const accColor = m.accuracy >= 90 ? 'c-gr' : m.accuracy >= 80 ? 'c-bl' : m.accuracy >= 70 ? 'c-or' : 'c-rd';
    const rowClass = idx === 0 ? ' style="background:rgba(16,185,129,0.08)"' : '';
    
    html += `<tr${rowClass}>`;
    html += `<td style="font-size:18px">${rank}</td>`;
    html += `<td><strong>${m.name}</strong> <span class="badge ${m.badge}">${m.module}</span></td>`;
    html += `<td>${m.type}</td>`;
    html += `<td><span class="badge ${m.badge}">${m.module}</span></td>`;
    
    if (m.accuracy !== null) {
      html += `<td class="mono ${accColor}"><strong>${m.accuracy.toFixed(1)}%</strong></td>`;
      html += `<td class="mono">${m.precision.toFixed(3)}</td>`;
      html += `<td class="mono">${m.recall.toFixed(3)}</td>`;
      html += `<td class="mono">${m.f1.toFixed(3)}</td>`;
    } else {
      html += `<td class="mono c-cy">N/A (clustering)</td>`;
      html += `<td class="mono">—</td>`;
      html += `<td class="mono">—</td>`;
      html += `<td class="mono">Inertia: ${m.inertia.toFixed(1)}</td>`;
    }
    
    html += '</tr>';
  });

  html += '</tbody></table></div>';
  wrap.innerHTML = html;
};
