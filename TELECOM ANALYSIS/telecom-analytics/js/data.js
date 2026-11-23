/* ═══════════════════════════════════════════════════════
   TelecomIQ  —  Complete Mock Data
═══════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.T = {};

  /* ── Nodes ── */
  T.nodes = [
    { id:'n01', name:'Tower-BTS-01', region:'North',   type:'BTS',    signal:82, latency:18, bw:94, pl:0.4, status:'normal',   uptime:99.8  },
    { id:'n02', name:'Tower-BTS-02', region:'South',   type:'BTS',    signal:61, latency:42, bw:55, pl:3.2, status:'warning',  uptime:97.1  },
    { id:'n03', name:'Tower-BTS-03', region:'East',    type:'BTS',    signal:34, latency:88, bw:22, pl:8.7, status:'critical', uptime:89.4  },
    { id:'n04', name:'Core-Router-A',region:'Central', type:'Router', signal:95, latency:5,  bw:99, pl:0.1, status:'normal',   uptime:99.99 },
    { id:'n05', name:'Core-Router-B',region:'Central', type:'Router', signal:90, latency:7,  bw:97, pl:0.2, status:'normal',   uptime:99.95 },
    { id:'n06', name:'Tower-BTS-04', region:'West',    type:'BTS',    signal:55, latency:60, bw:48, pl:5.1, status:'warning',  uptime:94.2  },
    { id:'n07', name:'Tower-BTS-05', region:'North',   type:'BTS',    signal:78, latency:22, bw:88, pl:0.9, status:'normal',   uptime:99.1  },
    { id:'n08', name:'Switch-Core-1',region:'Central', type:'Switch', signal:99, latency:2,  bw:100,pl:0.0, status:'normal',   uptime:100   },
    { id:'n09', name:'Tower-BTS-06', region:'South',   type:'BTS',    signal:20, latency:110,bw:10, pl:14.2,status:'failure',  uptime:72.3  },
    { id:'n10', name:'Tower-BTS-07', region:'East',    type:'BTS',    signal:70, latency:30, bw:76, pl:1.8, status:'normal',   uptime:98.6  },
    { id:'n11', name:'Tower-BTS-08', region:'West',    type:'BTS',    signal:66, latency:35, bw:72, pl:2.1, status:'normal',   uptime:98.0  },
    { id:'n12', name:'Tower-BTS-09', region:'North',   type:'BTS',    signal:44, latency:72, bw:38, pl:6.8, status:'warning',  uptime:91.5  },
    { id:'n13', name:'Tower-BTS-10', region:'South',   type:'BTS',    signal:88, latency:14, bw:92, pl:0.5, status:'normal',   uptime:99.4  },
    { id:'n14', name:'Switch-Edge-2',region:'East',    type:'Switch', signal:93, latency:4,  bw:98, pl:0.1, status:'normal',   uptime:99.9  },
    { id:'n15', name:'Tower-BTS-11', region:'West',    type:'BTS',    signal:29, latency:95, bw:18, pl:11.3,status:'critical', uptime:81.2  },
    { id:'n16', name:'Tower-BTS-12', region:'North',   type:'BTS',    signal:76, latency:25, bw:84, pl:1.2, status:'normal',   uptime:98.8  },
    { id:'n17', name:'Tower-BTS-13', region:'South',   type:'BTS',    signal:58, latency:50, bw:60, pl:4.1, status:'warning',  uptime:95.3  },
    { id:'n18', name:'Core-Router-C',region:'Central', type:'Router', signal:92, latency:6,  bw:96, pl:0.2, status:'normal',   uptime:99.9  },
    { id:'n19', name:'Tower-BTS-14', region:'East',    type:'BTS',    signal:71, latency:28, bw:79, pl:1.6, status:'normal',   uptime:98.2  },
    { id:'n20', name:'Tower-BTS-15', region:'West',    type:'BTS',    signal:48, latency:68, bw:44, pl:5.8, status:'warning',  uptime:93.1  },
  ];

  /* ── Failure Predictions ── */
  T.predictions = [
    { node:'Tower-BTS-06', prob:97, ttf:'Imminent',   reason:'Near-zero signal, extreme packet loss (14.2%)',    sev:'critical' },
    { node:'Tower-BTS-11', prob:88, ttf:'< 2 hrs',    reason:'Critical signal loss (29%) & high latency (95ms)', sev:'critical' },
    { node:'Tower-BTS-03', prob:81, ttf:'2–4 hrs',    reason:'Packet loss surge + bandwidth collapse to 22%',    sev:'critical' },
    { node:'Tower-BTS-02', prob:72, ttf:'4–8 hrs',    reason:'Latency spike (42ms) + degraded bandwidth (55%)',  sev:'high'     },
    { node:'Tower-BTS-09', prob:61, ttf:'8–12 hrs',   reason:'Intermittent signal drops (44%) detected',         sev:'high'     },
    { node:'Tower-BTS-04', prob:48, ttf:'12–24 hrs',  reason:'Moderate latency increase trend (60ms)',           sev:'medium'   },
    { node:'Tower-BTS-13', prob:39, ttf:'24–48 hrs',  reason:'Gradual bandwidth degradation observed',           sev:'medium'   },
    { node:'Tower-BTS-20', prob:28, ttf:'> 48 hrs',   reason:'Early warning: packet loss trending upward',       sev:'low'      },
  ];

  /* ── 24-hour history ── */
  T.h24 = (function(){
    const lbl = Array.from({length:24},(_,i)=>`${String(i).padStart(2,'0')}:00`);
    const r=(a,b,n=0)=>+(a+Math.random()*(b-a)+(Math.random()-.5)*n).toFixed(1);
    return {
      labels:  lbl,
      signal:  lbl.map(()=>r(55,92,10)),
      latency: lbl.map(()=>r(10,65,14)),
      bw:      lbl.map(()=>r(50,99,12)),
      pl:      lbl.map(()=>r(0.1,5.5,1.2)),
    };
  })();

  /* ── 7-day weekly ── */
  T.weekly = {
    labels:  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    signal:  [74,71,68,76,72,65,69],
    latency: [32,35,42,30,38,48,44],
    bw:      [82,79,75,85,80,70,73],
    pl:      [1.8,2.1,3.4,1.5,2.6,4.1,3.2],
  };

  /* ── 30-day trend ── */
  T.d30 = (function(){
    const lbl=Array.from({length:30},(_,i)=>`D${i+1}`);
    const r=(a,b)=>+(a+Math.random()*(b-a)).toFixed(1);
    return {
      labels:  lbl,
      signal:  lbl.map(()=>r(60,90)),
      latency: lbl.map(()=>r(15,60)),
      uptime:  lbl.map(()=>r(94,100)),
    };
  })();

  /* ── Region summary ── */
  T.regions = [
    { name:'North',   nodes:4, normal:3, warn:1, fail:0, signal:72, latency:28, uptime:97.4 },
    { name:'South',   nodes:4, normal:1, warn:2, fail:1, signal:57, latency:54, uptime:91.0 },
    { name:'East',    nodes:4, normal:3, warn:0, fail:1, signal:67, latency:37, uptime:96.5 },
    { name:'West',    nodes:4, normal:1, warn:2, fail:1, signal:50, latency:65, uptime:91.6 },
    { name:'Central', nodes:4, normal:4, warn:0, fail:0, signal:94, latency:5,  uptime:99.96},
  ];

  /* ── Revenue (12 months, ₹ lakhs) ── */
  T.revenue = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    values: [42.1,44.5,41.8,46.2,48.9,51.3,49.7,52.8,50.4,55.1,53.6,57.2],
    target: [45,45,45,47,49,50,51,52,52,54,54,56],
  };

  /* ── Churn history ── */
  T.churn = {
    labels:  ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    rate:    [5.2,4.8,6.1,5.5,4.2,3.9,4.7,5.3,6.0,4.4,5.1,4.9],
    newCust: [820,910,750,880,1020,1150,990,870,780,1100,950,860],
  };

  /* ── Churn reasons ── */
  T.churnReasons = {
    labels: ['Network Quality','Pricing','Competitor Offers','Poor Support','Billing Issues','Coverage Gaps'],
    values: [38,27,18,9,5,3],
  };

  /* ── Feature importance (failure prediction) ── */
  T.featureImp = {
    labels: ['Packet Loss','Signal Strength','Latency','Bandwidth','Uptime','Node Type','Region','Time of Day'],
    values: [0.31,0.26,0.19,0.11,0.07,0.03,0.02,0.01],
  };

  /* ── ML confusion matrix (Neural Network) ── */
  T.conf = { tp:1842, fp:48, fn:63, tn:2047 };

  /* ── Plan distribution ── */
  T.plans = {
    labels: ['Unlimited Pro','5G Starter','Basic 4G','Basic 2G','Enterprise'],
    values: [18845,13530,8720,5797,1428],
    colors: ['#8b5cf6','#3b82f6','#06b6d4','#f59e0b','#10b981'],
  };

  /* ── ML models ── */
  T.models = [
    { name:'Random Forest',  acc:94.2, prec:92.8, rec:91.5, f1:92.1, auc:0.961, time:'4.2s'  },
    { name:'Gradient Boost', acc:96.1, prec:95.3, rec:94.7, f1:95.0, auc:0.978, time:'11.8s' },
    { name:'SVM',            acc:89.6, prec:88.1, rec:87.4, f1:87.7, auc:0.934, time:'2.9s'  },
    { name:'Neural Network', acc:97.3, prec:96.8, rec:96.2, f1:96.5, auc:0.991, time:'38.4s' },
    { name:'Logistic Reg.',  acc:83.1, prec:81.4, rec:80.9, f1:81.1, auc:0.891, time:'0.8s'  },
    { name:'Decision Tree',  acc:87.4, prec:85.9, rec:86.2, f1:86.0, auc:0.912, time:'1.1s'  },
  ];

  /* ── Preprocessing report ── */
  T.prepReport = [
    { param:'Signal Strength', raw:4800, miss:48,  out:21,  clean:4731, type:'Float [0–100]',  method:'Mean imputation'      },
    { param:'Latency (ms)',     raw:4800, miss:31,  out:44,  clean:4725, type:'Float (ms)',     method:'Median imputation'    },
    { param:'Bandwidth (%)',    raw:4800, miss:22,  out:15,  clean:4763, type:'Float [0–100]',  method:'Mean imputation'      },
    { param:'Packet Loss (%)',  raw:4800, miss:57,  out:38,  clean:4705, type:'Float (%)',      method:'Median + IQR cap'     },
    { param:'Uptime (%)',       raw:4800, miss:8,   out:4,   clean:4788, type:'Float [0–100]',  method:'Mean imputation'      },
    { param:'Node Type',        raw:4800, miss:0,   out:0,   clean:4800, type:'Categorical',    method:'One-Hot Encoding'     },
    { param:'Region',           raw:4800, miss:0,   out:0,   clean:4800, type:'Categorical',    method:'Label Encoding'       },
    { param:'Customer ID',      raw:48320,miss:0,   out:0,   clean:48320,type:'String (UUID)',  method:'No processing needed' },
    { param:'Monthly Bill (₹)', raw:48320,miss:34,  out:22,  clean:48264,type:'Float (₹)',      method:'Mode imputation'      },
    { param:'Data Usage (GB)',  raw:48320,miss:56,  out:41,  clean:48223,type:'Float (GB)',     method:'Mean imputation'      },
    { param:'Call Duration',    raw:48320,miss:29,  out:18,  clean:48273,type:'Float (min)',    method:'Median imputation'    },
    { param:'Tenure (months)',  raw:48320,miss:12,  out:5,   clean:48303,type:'Integer',        method:'Mode imputation'      },
    { param:'Service Plan',     raw:48320,miss:7,   out:0,   clean:48313,type:'Categorical',    method:'One-Hot Encoding'     },
    { param:'Churn Label',      raw:48320,miss:0,   out:0,   clean:48320,type:'Binary (0/1)',   method:'No processing needed' },
  ];

  /* ── Customers (20) ── */
  T.customers = [
    { name:'Ravi Kumar',    plan:'Unlimited Pro', tenure:36, bill:1499, data:88,  calls:420, churn:'low',    seg:'Premium',  clv:53964 },
    { name:'Priya Sharma',  plan:'Basic 2G',      tenure:4,  bill:199,  data:1.2, calls:85,  churn:'high',   seg:'At-Risk',  clv:796   },
    { name:'Arun Babu',     plan:'5G Starter',    tenure:12, bill:599,  data:32,  calls:215, churn:'medium', seg:'Standard', clv:7188  },
    { name:'Meena Devi',    plan:'Unlimited Pro', tenure:48, bill:1499, data:102, calls:530, churn:'low',    seg:'Premium',  clv:71952 },
    { name:'Suresh Nair',   plan:'Basic 4G',      tenure:2,  bill:299,  data:4.8, calls:60,  churn:'high',   seg:'At-Risk',  clv:598   },
    { name:'Kavitha R',     plan:'5G Starter',    tenure:8,  bill:599,  data:25,  calls:180, churn:'medium', seg:'Standard', clv:4792  },
    { name:'Dinesh Pillai', plan:'Unlimited Pro', tenure:60, bill:1499, data:115, calls:610, churn:'low',    seg:'Premium',  clv:89940 },
    { name:'Lakshmi S',     plan:'Basic 2G',      tenure:1,  bill:199,  data:0.5, calls:40,  churn:'high',   seg:'At-Risk',  clv:199   },
    { name:'Vignesh M',     plan:'5G Starter',    tenure:18, bill:599,  data:55,  calls:290, churn:'low',    seg:'Standard', clv:10782 },
    { name:'Anjali Nair',   plan:'Basic 4G',      tenure:3,  bill:299,  data:7.2, calls:95,  churn:'high',   seg:'At-Risk',  clv:897   },
    { name:'Karthik S',     plan:'Unlimited Pro', tenure:24, bill:1499, data:78,  calls:380, churn:'low',    seg:'Premium',  clv:35976 },
    { name:'Deepa M',       plan:'5G Starter',    tenure:6,  bill:599,  data:19,  calls:140, churn:'medium', seg:'Standard', clv:3594  },
    { name:'Ramesh P',      plan:'Enterprise',    tenure:72, bill:4999, data:220, calls:900, churn:'low',    seg:'Premium',  clv:359928},
    { name:'Suja T',        plan:'Basic 2G',      tenure:2,  bill:199,  data:0.8, calls:55,  churn:'high',   seg:'At-Risk',  clv:398   },
    { name:'Murugan K',     plan:'Basic 4G',      tenure:5,  bill:299,  data:9.1, calls:110, churn:'medium', seg:'Standard', clv:1495  },
    { name:'Anitha B',      plan:'Unlimited Pro', tenure:30, bill:1499, data:91,  calls:460, churn:'low',    seg:'Premium',  clv:44970 },
    { name:'Senthil R',     plan:'5G Starter',    tenure:9,  bill:599,  data:28,  calls:200, churn:'medium', seg:'Standard', clv:5391  },
    { name:'Pavithra N',    plan:'Basic 2G',      tenure:1,  bill:199,  data:0.3, calls:30,  churn:'high',   seg:'At-Risk',  clv:199   },
    { name:'Bala K',        plan:'Enterprise',    tenure:48, bill:4999, data:195, calls:820, churn:'low',    seg:'Premium',  clv:239952},
    { name:'Saranya D',     plan:'5G Starter',    tenure:14, bill:599,  data:42,  calls:255, churn:'low',    seg:'Standard', clv:8386  },
  ];

  /* ── Network events ── */
  T.events = [
    { time:'11:34', node:'Tower-BTS-06',  type:'Signal Loss',          sev:'critical', resolved:false },
    { time:'10:52', node:'Tower-BTS-11',  type:'Critical Signal Drop',  sev:'critical', resolved:false },
    { time:'10:21', node:'Tower-BTS-03',  type:'Packet Loss Surge',    sev:'critical', resolved:false },
    { time:'09:18', node:'Tower-BTS-02',  type:'Latency Spike',        sev:'high',     resolved:false },
    { time:'08:44', node:'Tower-BTS-04',  type:'Bandwidth Degradation',sev:'medium',   resolved:false },
    { time:'08:12', node:'Tower-BTS-09',  type:'Intermittent Signal',  sev:'high',     resolved:false },
    { time:'07:30', node:'Core-Router-A', type:'Traffic Burst',        sev:'low',      resolved:true  },
    { time:'06:55', node:'Tower-BTS-02',  type:'Latency Warning',      sev:'medium',   resolved:true  },
    { time:'05:40', node:'Tower-BTS-05',  type:'Packet Loss',          sev:'low',      resolved:true  },
    { time:'04:12', node:'Tower-BTS-13',  type:'Bandwidth Warning',    sev:'medium',   resolved:true  },
  ];

  /* ── KPIs ── */
  T.kpi = {
    totalNodes:20, activeNodes:11, warnNodes:5, failNodes:4,
    uptime:97.4, avgSignal:68, avgLatency:38, avgBw:69, avgPl:3.5,
    totalCustomers:48320, churnRisk:1240, premium:18845, nps:62,
    predFailures:8, modelAcc:97.3, revenue:57.2,
    dataProcessed:49154, qualityScore:97.4,
  };

  /* ── Correlation matrix (network features) ── */
  T.corrFeatures = ['Signal','Latency','BW','P.Loss','Uptime'];
  T.corrMatrix = [
    [1.00, -0.72,  0.81, -0.68,  0.75],
    [-0.72, 1.00, -0.65,  0.79, -0.70],
    [0.81, -0.65,  1.00, -0.61,  0.69],
    [-0.68, 0.79, -0.61,  1.00, -0.84],
    [0.75, -0.70,  0.69, -0.84,  1.00],
  ];

  /* ── Usage heatmap (customers vs weekday activity %) ── */
  T.usageHeatmap = {
    customers: ['Ravi K','Meena D','Dinesh P','Ramesh P','Anitha B','Bala K','Karthik S','Vignesh M'],
    days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    values: [
      [85,80,90,88,92,60,55],
      [70,75,80,78,85,55,50],
      [90,88,92,95,98,70,65],
      [95,92,88,90,96,80,78],
      [75,72,80,82,88,60,58],
      [92,90,95,88,94,75,72],
      [80,78,85,82,90,65,60],
      [65,68,72,70,75,80,78],
    ],
  };

})();
