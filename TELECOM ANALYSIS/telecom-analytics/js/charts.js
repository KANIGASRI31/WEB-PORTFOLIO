/* ═══════════════════════════════════════════
   TelecomIQ — All Chart Renderers
═══════════════════════════════════════════ */
(function(){
  'use strict';

  const C={
    blue:'#3b82f6',cyan:'#06b6d4',green:'#10b981',
    orange:'#f59e0b',red:'#ef4444',purple:'#8b5cf6',pink:'#ec4899',
    grid:'#0d1e35',txt:'#94a3b8',card:'#0b1221'
  };

  Chart.defaults.color=C.txt;
  Chart.defaults.font.family='Inter,system-ui,sans-serif';
  Chart.defaults.font.size=12;

  const tip={backgroundColor:C.card,borderColor:'#162840',borderWidth:1,padding:10,cornerRadius:8};

  function destroy(key){if(window[key]){window[key].destroy();window[key]=null;}}

  /* helper: gradient fill */
  function gFill(ctx,color,alpha1=0.18,alpha2=0.01){
    const hex2rgb=h=>{const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return`${r},${g},${b}`};
    const g=ctx.createLinearGradient(0,0,0,340);
    g.addColorStop(0,`rgba(${hex2rgb(color)},${alpha1})`);
    g.addColorStop(1,`rgba(${hex2rgb(color)},${alpha2})`);
    return g;
  }

  /* ── 1. 24h Network Performance ── */
  window.renderNetPerfChart=function(){
    const el=document.getElementById('netPerfChart');if(!el)return;
    destroy('_netPerfChart');
    const h=T.h24;
    window._netPerfChart=new Chart(el,{
      type:'line',
      data:{labels:h.labels,datasets:[
        {label:'Signal (%)',data:h.signal,borderColor:C.blue,borderWidth:2,backgroundColor:gFill(el.getContext('2d'),C.blue),fill:true,tension:.4,pointRadius:0,pointHoverRadius:5},
        {label:'Bandwidth (%)',data:h.bw,borderColor:C.green,borderWidth:2,backgroundColor:gFill(el.getContext('2d'),C.green),fill:true,tension:.4,pointRadius:0,pointHoverRadius:5},
        {label:'Latency (ms)',data:h.latency,borderColor:C.orange,borderWidth:2,backgroundColor:gFill(el.getContext('2d'),C.orange),fill:true,tension:.4,pointRadius:0,pointHoverRadius:5},
        {label:'Packet Loss (%)',data:h.pl,borderColor:C.red,borderWidth:2,backgroundColor:gFill(el.getContext('2d'),C.red),fill:true,tension:.4,pointRadius:0,pointHoverRadius:5},
      ]},
      options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'top',labels:{boxWidth:12,padding:14}},tooltip:tip},scales:{x:{grid:{color:C.grid},ticks:{maxTicksLimit:8}},y:{grid:{color:C.grid},min:0}}},
    });
  };

  /* ── 2. Node status donut ── */
  window.renderNodeStatusChart=function(){
    const el=document.getElementById('nodeStatusChart');if(!el)return;
    destroy('_nodeStatusChart');
    window._nodeStatusChart=new Chart(el,{
      type:'doughnut',
      data:{labels:['Normal','Warning','Critical/Failure'],datasets:[{data:[11,5,4],backgroundColor:[C.green,C.orange,C.red],borderWidth:2,borderColor:C.card,hoverOffset:8}]},
      options:{responsive:true,maintainAspectRatio:false,cutout:'72%',plugins:{legend:{position:'bottom',labels:{boxWidth:12,padding:12}},tooltip:tip}},
    });
  };

  /* ── 3. Failure probability bar ── */
  window.renderFailureProbChart=function(){
    const el=document.getElementById('failureProbChart');if(!el)return;
    destroy('_failureProbChart');
    const p=T.predictions;
    window._failureProbChart=new Chart(el,{
      type:'bar',
      data:{labels:p.map(x=>x.node.replace('Tower-','').replace('Core-','')),datasets:[{label:'Failure Probability (%)',data:p.map(x=>x.prob),backgroundColor:p.map(x=>x.sev==='critical'?'rgba(239,68,68,.75)':x.sev==='high'?'rgba(245,158,11,.75)':'rgba(59,130,246,.75)'),borderColor:p.map(x=>x.sev==='critical'?C.red:x.sev==='high'?C.orange:C.blue),borderWidth:1,borderRadius:5}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:tip},scales:{x:{grid:{display:false}},y:{grid:{color:C.grid},min:0,max:100,ticks:{callback:v=>v+'%'}}}},
    });
  };

  /* ── 4. Churn + new customers ── */
  window.renderChurnChart=function(){
    const el=document.getElementById('churnChart');if(!el)return;
    destroy('_churnChart');
    const ch=T.churn;
    window._churnChart=new Chart(el,{
      type:'line',
      data:{labels:ch.labels,datasets:[
        {label:'Churn Rate (%)',data:ch.rate,borderColor:C.red,borderWidth:2,backgroundColor:gFill(el.getContext('2d'),C.red),fill:true,tension:.4,pointRadius:4,pointHoverRadius:6,yAxisID:'y'},
        {label:'New Customers',data:ch.newCust,borderColor:C.green,borderWidth:2,backgroundColor:gFill(el.getContext('2d'),C.green),fill:true,tension:.4,pointRadius:4,pointHoverRadius:6,yAxisID:'y1'},
      ]},
      options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'top',labels:{boxWidth:12,padding:14}},tooltip:tip},scales:{x:{grid:{color:C.grid}},y:{grid:{color:C.grid},position:'left',ticks:{callback:v=>v+'%'}},y1:{grid:{display:false},position:'right',ticks:{callback:v=>v.toLocaleString()}}}},
    });
  };

  /* ── 5. Customer segment donut ── */
  window.renderSegmentChart=function(){
    const el=document.getElementById('segmentChart');if(!el)return;
    destroy('_segmentChart');
    window._segmentChart=new Chart(el,{
      type:'doughnut',
      data:{labels:['Premium','Standard','At-Risk','Basic','Enterprise'],datasets:[{data:[39,28,21,12,3],backgroundColor:[C.purple,C.blue,C.red,C.orange,C.green],borderWidth:2,borderColor:C.card,hoverOffset:8}]},
      options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{position:'bottom',labels:{boxWidth:12,padding:12}},tooltip:tip}},
    });
  };

  /* ── 6. Radar: good vs critical node ── */
  window.renderRadarChart=function(){
    const el=document.getElementById('radarChart');if(!el)return;
    destroy('_radarChart');
    window._radarChart=new Chart(el,{
      type:'radar',
      data:{
        labels:['Signal','Bandwidth','Latency⁻¹','Packet Loss⁻¹','Uptime'],
        datasets:[
          {label:'BTS-01 (Healthy)',data:[82,94,88,96,99.8],borderColor:C.green,borderWidth:2,backgroundColor:'rgba(16,185,129,.12)',pointBackgroundColor:C.green},
          {label:'BTS-03 (Critical)',data:[34,22,15,12,89],borderColor:C.red,borderWidth:2,backgroundColor:'rgba(239,68,68,.1)',pointBackgroundColor:C.red},
          {label:'BTS-02 (Warning)',data:[61,55,52,70,97],borderColor:C.orange,borderWidth:2,backgroundColor:'rgba(245,158,11,.08)',pointBackgroundColor:C.orange},
        ],
      },
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{boxWidth:12,padding:12}},tooltip:tip},scales:{r:{min:0,max:100,grid:{color:C.grid},angleLines:{color:C.grid},ticks:{backdropColor:'transparent',stepSize:25}}}},
    });
  };

  /* ── 7. Data usage bar ── */
  window.renderDataUsageChart=function(){
    const el=document.getElementById('dataUsageChart');if(!el)return;
    destroy('_dataUsageChart');
    const top=T.customers.slice(0,8);
    window._dataUsageChart=new Chart(el,{
      type:'bar',
      data:{labels:top.map(c=>c.name.split(' ')[0]),datasets:[
        {label:'Data (GB)',data:top.map(c=>c.data),backgroundColor:'rgba(59,130,246,.7)',borderColor:C.blue,borderWidth:1,borderRadius:5,yAxisID:'y'},
        {label:'Calls (min)',data:top.map(c=>c.calls),backgroundColor:'rgba(139,92,246,.7)',borderColor:C.purple,borderWidth:1,borderRadius:5,yAxisID:'y1'},
      ]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{boxWidth:12,padding:14}},tooltip:tip},scales:{x:{grid:{display:false}},y:{grid:{color:C.grid},position:'left',ticks:{callback:v=>v+' GB'}},y1:{grid:{display:false},position:'right',ticks:{callback:v=>v+' m'}}}},
    });
  };

  /* ── 8. Weekly trend grouped bar ── */
  window.renderWeeklyChart=function(){
    const el=document.getElementById('weeklyChart');if(!el)return;
    destroy('_weeklyChart');
    const w=T.weekly;
    window._weeklyChart=new Chart(el,{
      type:'bar',
      data:{labels:w.labels,datasets:[
        {label:'Signal (%)',data:w.signal,backgroundColor:'rgba(59,130,246,.75)',borderRadius:4},
        {label:'Bandwidth (%)',data:w.bw,backgroundColor:'rgba(16,185,129,.75)',borderRadius:4},
        {label:'Latency (ms)',data:w.latency,backgroundColor:'rgba(245,158,11,.75)',borderRadius:4},
        {label:'Packet Loss',data:w.pl.map(v=>v*10),backgroundColor:'rgba(239,68,68,.75)',borderRadius:4},
      ]},
      options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'top',labels:{boxWidth:12,padding:14}},tooltip:tip},scales:{x:{grid:{display:false}},y:{grid:{color:C.grid}}}},
    });
  };

  /* ── 9. Region signal horizontal bar ── */
  window.renderRegionChart=function(){
    const el=document.getElementById('regionChart');if(!el)return;
    destroy('_regionChart');
    const r=T.regions;
    window._regionChart=new Chart(el,{
      type:'bar',
      data:{labels:r.map(x=>x.name),datasets:[
        {label:'Avg Signal (%)',data:r.map(x=>x.signal),backgroundColor:r.map(x=>x.signal>=80?'rgba(16,185,129,.75)':x.signal>=60?'rgba(245,158,11,.75)':'rgba(239,68,68,.75)'),borderRadius:5,borderSkipped:false},
        {label:'Avg Uptime (%)',data:r.map(x=>x.uptime),backgroundColor:'rgba(59,130,246,.5)',borderRadius:5,borderSkipped:false},
      ]},
      options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{position:'top',labels:{boxWidth:12,padding:14}},tooltip:tip},scales:{x:{grid:{color:C.grid},min:0,max:100,ticks:{callback:v=>v+'%'}},y:{grid:{display:false}}}},
    });
  };

  /* ── 10. Revenue area chart ── */
  window.renderRevenueChart=function(){
    const el=document.getElementById('revenueChart');if(!el)return;
    destroy('_revenueChart');
    const rv=T.revenue;
    window._revenueChart=new Chart(el,{
      type:'line',
      data:{labels:rv.labels,datasets:[
        {label:'Revenue (₹ Lakhs)',data:rv.values,borderColor:C.cyan,borderWidth:2.5,backgroundColor:gFill(el.getContext('2d'),C.cyan,0.22,0.01),fill:true,tension:.4,pointRadius:5,pointHoverRadius:7,pointBackgroundColor:C.cyan},
        {label:'Target',data:rv.target,borderColor:C.purple,borderWidth:1.5,borderDash:[5,4],fill:false,tension:.4,pointRadius:0},
      ]},
      options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'top',labels:{boxWidth:12,padding:14}},tooltip:tip},scales:{x:{grid:{color:C.grid}},y:{grid:{color:C.grid},ticks:{callback:v=>'₹'+v+'L'}}}},
    });
  };

  /* ── 11. Feature importance horizontal bar ── */
  window.renderFeatureImpChart=function(){
    const el=document.getElementById('featureImpChart');if(!el)return;
    destroy('_featureImpChart');
    const f=T.featureImp;
    window._featureImpChart=new Chart(el,{
      type:'bar',
      data:{labels:f.labels,datasets:[{label:'Importance Score',data:f.values,backgroundColor:f.values.map((_,i)=>`hsl(${220+i*18},75%,${60-i*4}%)`),borderRadius:5,borderSkipped:false}]},
      options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false},tooltip:tip},scales:{x:{grid:{color:C.grid},min:0,max:0.35,ticks:{callback:v=>v.toFixed(2)}},y:{grid:{display:false}}}},
    });
  };

  /* ── 12. Plan distribution pie ── */
  window.renderPlanChart=function(){
    const el=document.getElementById('planChart');if(!el)return;
    destroy('_planChart');
    window._planChart=new Chart(el,{
      type:'pie',
      data:{labels:T.plans.labels,datasets:[{data:T.plans.values,backgroundColor:T.plans.colors,borderWidth:2,borderColor:C.card,hoverOffset:8}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{boxWidth:12,padding:12}},tooltip:{...tip,callbacks:{label:ctx=>`${ctx.label}: ${ctx.parsed.toLocaleString()} (${((ctx.parsed/T.plans.values.reduce((a,b)=>a+b))*100).toFixed(1)}%)`}}}},
    });
  };

  /* ── 13. Churn reasons bar ── */
  window.renderChurnReasonsChart=function(){
    const el=document.getElementById('churnReasonsChart');if(!el)return;
    destroy('_churnReasonsChart');
    const cr=T.churnReasons;
    window._churnReasonsChart=new Chart(el,{
      type:'bar',
      data:{labels:cr.labels,datasets:[{label:'% of Churned Customers',data:cr.values,backgroundColor:['rgba(239,68,68,.8)','rgba(245,158,11,.8)','rgba(139,92,246,.8)','rgba(59,130,246,.8)','rgba(6,182,212,.8)','rgba(16,185,129,.8)'],borderRadius:5,borderSkipped:false}]},
      options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false},tooltip:tip},scales:{x:{grid:{color:C.grid},ticks:{callback:v=>v+'%'}},y:{grid:{display:false}}}},
    });
  };

  /* ── 14. ML model accuracy comparison ── */
  window.renderModelCompChart=function(){
    const el=document.getElementById('modelCompChart');if(!el)return;
    destroy('_modelCompChart');
    window._modelCompChart=new Chart(el,{
      type:'bar',
      data:{
        labels:T.models.map(m=>m.name),
        datasets:[
          {label:'Accuracy',data:T.models.map(m=>m.acc),backgroundColor:'rgba(59,130,246,.75)',borderRadius:4},
          {label:'Precision',data:T.models.map(m=>m.prec),backgroundColor:'rgba(16,185,129,.75)',borderRadius:4},
          {label:'Recall',data:T.models.map(m=>m.rec),backgroundColor:'rgba(245,158,11,.75)',borderRadius:4},
          {label:'F1 Score',data:T.models.map(m=>m.f1),backgroundColor:'rgba(139,92,246,.75)',borderRadius:4},
        ],
      },
      options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'top',labels:{boxWidth:12,padding:14}},tooltip:tip},scales:{x:{grid:{display:false}},y:{grid:{color:C.grid},min:75,max:100,ticks:{callback:v=>v+'%'}}}},
    });
  };

  /* ── 15. 30-day uptime line ── */
  window.renderUptimeChart=function(){
    const el=document.getElementById('uptimeChart');if(!el)return;
    destroy('_uptimeChart');
    window._uptimeChart=new Chart(el,{
      type:'line',
      data:{labels:T.d30.labels,datasets:[{label:'Network Uptime (%)',data:T.d30.uptime,borderColor:C.green,borderWidth:2,backgroundColor:gFill(el.getContext('2d'),C.green),fill:true,tension:.35,pointRadius:0,pointHoverRadius:4}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:tip},scales:{x:{grid:{display:false},ticks:{maxTicksLimit:8}},y:{grid:{color:C.grid},min:90,max:101,ticks:{callback:v=>v+'%'}}}},
    });
  };

  /* ── 16. Gauge (network health score) using doughnut ── */
  window.renderGaugeChart=function(){
    const el=document.getElementById('gaugeChart');if(!el)return;
    destroy('_gaugeChart');
    const score=72;
    window._gaugeChart=new Chart(el,{
      type:'doughnut',
      data:{datasets:[{data:[score,100-score],backgroundColor:[score>=80?C.green:score>=60?C.orange:C.red,'rgba(255,255,255,.04)'],borderWidth:0,hoverOffset:0}]},
      options:{responsive:true,maintainAspectRatio:false,circumference:180,rotation:-90,cutout:'78%',plugins:{legend:{display:false},tooltip:{enabled:false}}},
    });
  };

  /* ── Page chart dispatcher ── */
  window.renderPageCharts=function(page){
    const all={
      dashboard:    ()=>{renderNodeStatusChart();renderFailureProbChart();renderChurnChart();renderGaugeChart();renderUptimeChart();renderWeeklyChart();},
      network:      ()=>{
        renderNetPerfChart();renderRadarChart();renderFeatureImpChart();
        // Trigger ML charts if data is available
        if(window.mlResults&&window.mlResults.network){
          if(typeof window.renderNetworkMLUI==='function') window.renderNetworkMLUI();
        } else if(window.processedNetwork&&typeof window.runNetworkML==='function'){
          if(typeof window.renderNetworkMLUI==='function') window.renderNetworkMLUI();
        }
      },
      customers:    ()=>{
        renderChurnChart();renderRevenueChart();
        buildUsageHeatmapStatic();
        // Trigger ML charts if data is available
        if(window.processedCustomer&&typeof window.renderCustomerMLUI==='function'){
          window.renderCustomerMLUI();
        }
      },
      preprocessing:()=>{},
      analytics:    ()=>{
        renderNetPerfChart();renderNodeStatusChart();renderChurnChart();
        renderModelCompChart();renderRevenueChart();renderRegionChart();
        // Render segment chart from ML if available
        if(window.mlResults&&window.mlResults.customer){
          renderMLSegmentForAnalytics();
        } else {
          renderSegmentChart();
        }
      },
    };
    if(all[page]) all[page]();
  };

  /* ── Segment chart for analytics page (uses ML data if available) ── */
  function renderMLSegmentForAnalytics(){
    const el=document.getElementById('segmentChart');if(!el)return;
    destroy('_segmentChart');
    const custML=window.mlResults&&window.mlResults.customer;
    if(custML){
      const sc=custML.segCounts;
      window._segmentChart=new Chart(el,{
        type:'doughnut',
        data:{labels:['Premium','Standard','Basic','At-Risk'],datasets:[{data:[sc.Premium||0,sc.Standard||0,sc.Basic||0,sc['At-Risk']||0],backgroundColor:[C.purple,C.blue,C.cyan,C.red],borderWidth:2,borderColor:C.card,hoverOffset:8}]},
        options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{position:'bottom',labels:{boxWidth:12,padding:12}},tooltip:tip}},
      });
    } else {
      renderSegmentChart();
    }
  }

  /* ── Build usage heatmap (called from page dispatcher) ── */
  function buildUsageHeatmapStatic(){
    const wrap=document.getElementById('usageHeatmap');
    if(!wrap||wrap.innerHTML.trim()) return; // already built
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

})();
