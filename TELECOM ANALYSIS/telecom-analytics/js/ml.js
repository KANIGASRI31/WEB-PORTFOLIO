/* ═══════════════════════════════════════════════════════
   TelecomIQ — In-Browser Machine Learning Engine
   Module 2: Network Failure Prediction
   Module 3: Customer Behaviour Mining
═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ═══════════════════════════════
     MATH HELPERS
  ═══════════════════════════════ */
  function sigmoid(z) { return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z)))); }

  function dot(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * b[i];
    return s;
  }

  function mean(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }

  function variance(arr) {
    const m = mean(arr);
    return arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length;
  }

  function minMaxScale(data) {
    if (!data.length) return { scaled: [], mins: [], maxs: [] };
    const cols = data[0].length;
    const mins = Array(cols).fill(Infinity);
    const maxs = Array(cols).fill(-Infinity);
    data.forEach(row => row.forEach((v, i) => {
      if (v < mins[i]) mins[i] = v;
      if (v > maxs[i]) maxs[i] = v;
    }));
    const scaled = data.map(row => row.map((v, i) => {
      const range = maxs[i] - mins[i];
      return range === 0 ? 0 : (v - mins[i]) / range;
    }));
    return { scaled, mins, maxs };
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function trainTestSplit(X, y, testRatio = 0.2) {
    const idx = shuffle([...Array(X.length).keys()]);
    const splitAt = Math.floor(X.length * (1 - testRatio));
    const trainIdx = idx.slice(0, splitAt);
    const testIdx  = idx.slice(splitAt);
    return {
      Xtrain: trainIdx.map(i => X[i]), ytrain: trainIdx.map(i => y[i]),
      Xtest:  testIdx.map(i => X[i]),  ytest:  testIdx.map(i => y[i]),
    };
  }

  /* ═══════════════════════════════
     METRICS
  ═══════════════════════════════ */
  function computeMetrics(yTrue, yPred) {
    let tp = 0, fp = 0, fn = 0, tn = 0;
    yTrue.forEach((actual, i) => {
      const pred = yPred[i];
      if      (actual === 1 && pred === 1) tp++;
      else if (actual === 0 && pred === 1) fp++;
      else if (actual === 1 && pred === 0) fn++;
      else tn++;
    });
    const accuracy  = (tp + tn) / (tp + fp + fn + tn) || 0;
    const precision = tp / (tp + fp) || 0;
    const recall    = tp / (tp + fn) || 0;
    const f1        = precision + recall > 0 ? 2 * precision * recall / (precision + recall) : 0;
    return {
      accuracy:  +(accuracy  * 100).toFixed(1),
      precision: +(precision * 100).toFixed(1),
      recall:    +(recall    * 100).toFixed(1),
      f1:        +(f1        * 100).toFixed(1),
      tp, fp, fn, tn,
    };
  }

  /* ═══════════════════════════════
     LOGISTIC REGRESSION
  ═══════════════════════════════ */
  function LogisticRegression(lr, epochs) {
    lr = lr || 0.1; epochs = epochs || 500;
    let weights = [], bias = 0;

    this.train = function (X, y) {
      const n = X.length, m = X[0].length;
      weights = Array(m).fill(0);
      bias    = 0;
      for (let e = 0; e < epochs; e++) {
        let dw = Array(m).fill(0), db = 0;
        for (let i = 0; i < n; i++) {
          const pred = sigmoid(dot(weights, X[i]) + bias);
          const err  = pred - y[i];
          X[i].forEach((x, j) => { dw[j] += err * x; });
          db += err;
        }
        weights = weights.map((w, j) => w - (lr / n) * dw[j]);
        bias -= (lr / n) * db;
      }
    };

    this.predictProba = function (X) {
      return X.map(row => sigmoid(dot(weights, row) + bias));
    };

    this.predict = function (X, threshold) {
      threshold = threshold || 0.5;
      return this.predictProba(X).map(p => p >= threshold ? 1 : 0);
    };
  }

  /* ═══════════════════════════════
     NAIVE BAYES (Gaussian)
  ═══════════════════════════════ */
  function NaiveBayes() {
    let classMeans = {}, classVars = {}, classPriors = {};

    this.train = function (X, y) {
      const classes = [...new Set(y)];
      classes.forEach(c => {
        const rows = X.filter((_, i) => y[i] === c);
        classPriors[c] = rows.length / X.length;
        classMeans[c]  = X[0].map((_, j) => mean(rows.map(r => r[j])));
        classVars[c]   = X[0].map((_, j) => variance(rows.map(r => r[j])) + 1e-9);
      });
    };

    this.predictProba = function (X) {
      return X.map(row => {
        const scores = {};
        Object.keys(classPriors).forEach(c => {
          let log = Math.log(classPriors[c]);
          row.forEach((x, j) => {
            const m = classMeans[c][j], v = classVars[c][j];
            log += -0.5 * Math.log(2 * Math.PI * v) - ((x - m) ** 2) / (2 * v);
          });
          scores[c] = log;
        });
        const vals   = Object.values(scores);
        const maxV   = Math.max(...vals);
        const expVals = vals.map(v => Math.exp(v - maxV));
        const sum    = expVals.reduce((a, b) => a + b, 0);
        const cls1Idx = Object.keys(scores).indexOf('1');
        return cls1Idx >= 0 ? expVals[cls1Idx] / sum : 0;
      });
    };

    this.predict = function (X, threshold) {
      threshold = threshold || 0.5;
      return this.predictProba(X).map(p => p >= threshold ? 1 : 0);
    };
  }

  /* ═══════════════════════════════
     K-MEANS CLUSTERING
  ═══════════════════════════════ */
  function KMeans(k, maxIter) {
    k = k || 4; maxIter = maxIter || 100;
    let centroids = [];

    function euclidean(a, b) {
      return Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));
    }

    function assign(X) {
      return X.map(row => {
        let best = 0, bestDist = Infinity;
        centroids.forEach((c, i) => {
          const d = euclidean(row, c);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        return best;
      });
    }

    this.fit = function (X) {
      const shuffled = shuffle([...X]);
      centroids = shuffled.slice(0, k).map(r => [...r]);
      let labels = [];
      for (let iter = 0; iter < maxIter; iter++) {
        labels = assign(X);
        const newCentroids = Array.from({ length: k }, (_, ci) => {
          const pts = X.filter((_, i) => labels[i] === ci);
          if (!pts.length) return centroids[ci];
          return X[0].map((_, j) => mean(pts.map(p => p[j])));
        });
        const moved = newCentroids.some((c, i) => euclidean(c, centroids[i]) > 1e-6);
        centroids = newCentroids;
        if (!moved) break;
      }
      return labels;
    };

    this.getCentroids = function () { return centroids; };
  }

  /* ═══════════════════════════════
     RANDOM FOREST CLASSIFIER
  ═══════════════════════════════ */
  function RandomForest(numTrees, maxDepth, minSplit) {
    numTrees = numTrees || 10;
    maxDepth = maxDepth || 10;
    minSplit = minSplit || 5;
    const trees = [];

    // Decision Tree node
    function DecisionTree() {
      let root = null;

      // Calculate Gini impurity
      function giniImpurity(y) {
        if (!y.length) return 0;
        const counts = {};
        y.forEach(label => { counts[label] = (counts[label] || 0) + 1; });
        let gini = 1;
        Object.values(counts).forEach(count => {
          const p = count / y.length;
          gini -= p * p;
        });
        return gini;
      }

      // Find best split
      function findBestSplit(X, y, features) {
        let bestGini = Infinity;
        let bestFeature = -1;
        let bestThreshold = null;

        features.forEach(fi => {
          const values = [...new Set(X.map(row => row[fi]))].sort((a, b) => a - b);
          values.forEach(threshold => {
            const leftY = [];
            const rightY = [];
            X.forEach((row, i) => {
              if (row[fi] <= threshold) leftY.push(y[i]);
              else rightY.push(y[i]);
            });

            if (leftY.length === 0 || rightY.length === 0) return;

            const gini = (leftY.length * giniImpurity(leftY) + rightY.length * giniImpurity(rightY)) / y.length;
            if (gini < bestGini) {
              bestGini = gini;
              bestFeature = fi;
              bestThreshold = threshold;
            }
          });
        });

        return { feature: bestFeature, threshold: bestThreshold, gini: bestGini };
      }

      // Build tree recursively
      function buildTree(X, y, depth, features) {
        // Stopping criteria
        if (depth >= maxDepth || y.length < minSplit || new Set(y).size === 1) {
          const counts = {};
          y.forEach(label => { counts[label] = (counts[label] || 0) + 1; });
          const prediction = Object.entries(counts).reduce((a, b) => b[1] > a[1] ? b : a)[0];
          return { isLeaf: true, prediction: parseInt(prediction), samples: y.length };
        }

        const split = findBestSplit(X, y, features);
        if (split.feature === -1) {
          const counts = {};
          y.forEach(label => { counts[label] = (counts[label] || 0) + 1; });
          const prediction = Object.entries(counts).reduce((a, b) => b[1] > a[1] ? b : a)[0];
          return { isLeaf: true, prediction: parseInt(prediction), samples: y.length };
        }

        // Split data
        const leftX = [], leftY = [], rightX = [], rightY = [];
        X.forEach((row, i) => {
          if (row[split.feature] <= split.threshold) {
            leftX.push(row);
            leftY.push(y[i]);
          } else {
            rightX.push(row);
            rightY.push(y[i]);
          }
        });

        return {
          isLeaf: false,
          feature: split.feature,
          threshold: split.threshold,
          left: buildTree(leftX, leftY, depth + 1, features),
          right: buildTree(rightX, rightY, depth + 1, features),
          samples: y.length
        };
      }

      // Predict single sample
      function predictSample(node, sample) {
        if (node.isLeaf) return node.prediction;
        if (sample[node.feature] <= node.threshold) {
          return predictSample(node.left, sample);
        } else {
          return predictSample(node.right, sample);
        }
      }

      this.fit = function (X, y, features) {
        root = buildTree(X, y, 0, features);
      };

      this.predict = function (X) {
        return X.map(sample => predictSample(root, sample));
      };

      this.predictProba = function (X) {
        // Simple probability based on leaf purity
        return X.map(sample => {
          const pred = predictSample(root, sample);
          return pred === 1 ? 0.7 : 0.3; // Simplified
        });
      };
    }

    this.fit = function (X, y) {
      const nFeatures = X[0].length;
      const featureSubsetSize = Math.floor(Math.sqrt(nFeatures));

      for (let i = 0; i < numTrees; i++) {
        // Bootstrap sample
        const bootstrapIndices = Array.from({ length: X.length }, () => Math.floor(Math.random() * X.length));
        const Xboot = bootstrapIndices.map(idx => X[idx]);
        const yboot = bootstrapIndices.map(idx => y[idx]);

        // Random feature subset
        const allFeatures = Array.from({ length: nFeatures }, (_, i) => i);
        const features = shuffle(allFeatures).slice(0, featureSubsetSize);

        const tree = new DecisionTree();
        tree.fit(Xboot, yboot, features);
        trees.push(tree);
      }
    };

    this.predict = function (X) {
      if (trees.length === 0) return Array(X.length).fill(0);
      
      const predictions = trees.map(tree => tree.predict(X));
      return X.map((_, i) => {
        const votes = predictions.map(pred => pred[i]);
        const counts = {};
        votes.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
        return Object.entries(counts).reduce((a, b) => b[1] > a[1] ? b : a)[0] * 1;
      });
    };

    this.predictProba = function (X) {
      if (trees.length === 0) return Array(X.length).fill(0.5);
      
      const predictions = trees.map(tree => tree.predict(X));
      return X.map((_, i) => {
        const votes = predictions.map(pred => pred[i]);
        const onesCount = votes.filter(v => v === 1).length;
        return onesCount / trees.length;
      });
    };
  }

  /* ═══════════════════════════════
     MODULE 2 — NETWORK FAILURE PREDICTION
  ═══════════════════════════════ */
  window.runNetworkML = function (rows) {
    const featureCols = ['signal_strength', 'latency', 'bandwidth', 'packet_loss'];

    const rawX = rows.map(r => featureCols.map(c => parseFloat(r[c]) || 0));

    // Derive labels from status field, or fall back to threshold rules
    const statusLabels = rows.map(r => {
      const s = (r.status || '').toLowerCase();
      return (s === 'failure' || s === 'critical') ? 1 : 0;
    });
    const hasStatusLabels = statusLabels.some(v => v === 1);
    const thresholdLabels = rows.map(r => {
      const sig = parseFloat(r.signal_strength) || 50;
      const lat = parseFloat(r.latency) || 30;
      const pl  = parseFloat(r.packet_loss) || 1;
      return (sig < 40 || lat > 80 || pl > 8) ? 1 : 0;
    });
    const labels = hasStatusLabels ? statusLabels : thresholdLabels;

    // Scale features
    const { scaled } = minMaxScale(rawX);

    // Split 80/20
    const { Xtrain, ytrain, Xtest, ytest } = trainTestSplit(scaled, labels, 0.2);

    // Train Logistic Regression
    const lrModel = new LogisticRegression(0.15, 800);
    lrModel.train(Xtrain, ytrain);
    const lrProbas    = lrModel.predictProba(scaled);
    const lrTestPreds = lrModel.predictProba(Xtest).map(p => p >= 0.5 ? 1 : 0);
    const lrMetrics   = computeMetrics(ytest, lrTestPreds);

    // Train Naive Bayes
    const nbModel = new NaiveBayes();
    nbModel.train(Xtrain, ytrain.map(String));
    const nbProbas    = nbModel.predictProba(scaled);
    const nbTestPreds = nbModel.predictProba(Xtest).map(p => p >= 0.5 ? 1 : 0);
    const nbMetrics   = computeMetrics(ytest, nbTestPreds);

    // Use LR as primary (better calibration on this feature space)
    const probas = lrProbas;
    const preds  = probas.map(p => p >= 0.5 ? 1 : 0);

    // Per-row results
    const results = rows.map((r, i) => ({
      node_id:    r.node_id || `n${String(i + 1).padStart(3, '0')}`,
      signal:     +(parseFloat(r.signal_strength) || 0).toFixed(1),
      latency:    +(parseFloat(r.latency) || 0).toFixed(1),
      bandwidth:  +(parseFloat(r.bandwidth) || 0).toFixed(1),
      packetLoss: +(parseFloat(r.packet_loss) || 0).toFixed(2),
      uptime:     +(parseFloat(r.uptime) || 0).toFixed(1),
      predicted:  preds[i] === 1 ? 'Failure' : 'Normal',
      probability: +(probas[i] * 100).toFixed(1),
      confidence:  +(Math.abs(probas[i] - 0.5) * 200).toFixed(1),
      status:      r.status || (preds[i] === 1 ? 'failure' : 'normal'),
      actualLabel: labels[i],
    }));

    // Aggregate stats
    const failureCount  = results.filter(r => r.predicted === 'Failure').length;
    const failureRate   = +((failureCount / results.length) * 100).toFixed(1);

    // Network health formula: 0.4×signal + 0.3×(1−lat_norm) + 0.2×bw + 0.1×(1−pl_norm)
    const avgSignal = mean(results.map(r => r.signal));
    const avgLat    = mean(results.map(r => r.latency));
    const avgBw     = mean(results.map(r => r.bandwidth));
    const avgPl     = mean(results.map(r => r.packetLoss));
    const latNorm   = Math.min(avgLat / 200, 1);
    const plNorm    = Math.min(avgPl / 20, 1);
    const networkHealth = +(0.4 * (avgSignal / 100) + 0.3 * (1 - latNorm) + 0.2 * (avgBw / 100) + 0.1 * (1 - plNorm)).toFixed(4) * 100;

    // Alerts for nodes with probability > 50%
    const alerts = results
      .filter(r => r.probability > 50)
      .sort((a, b) => b.probability - a.probability)
      .map(r => ({
        node: r.node_id,
        prob: r.probability,
        reason: r.signal < 40
          ? `Critical signal loss (${r.signal}%) detected`
          : r.latency > 80
          ? `High latency (${r.latency}ms) exceeds threshold`
          : r.packetLoss > 8
          ? `Extreme packet loss (${r.packetLoss}%) detected`
          : `Degraded performance: signal ${r.signal}%, latency ${r.latency}ms`,
        sev: r.probability > 80 ? 'critical' : r.probability > 65 ? 'high' : 'medium',
      }));

    if (!window.mlResults) window.mlResults = {};
    window.mlResults.network = {
      results, failureCount, failureRate,
      networkHealth: +networkHealth.toFixed(1),
      alerts,
      avgSignal:    +avgSignal.toFixed(1),
      avgLatency:   +avgLat.toFixed(1),
      avgBandwidth: +avgBw.toFixed(1),
      avgPacketLoss:+avgPl.toFixed(2),
      totalNodes:   results.length,
      models: {
        logistic:  lrMetrics,
        naiveBayes: nbMetrics,
      },
      primaryMetrics: lrMetrics,
    };

    return window.mlResults.network;
  };

  /* ═══════════════════════════════
     MODULE 3 — CUSTOMER BEHAVIOUR MINING
  ═══════════════════════════════ */
  window.runCustomerML = function (rows) {
    const featureCols = ['tenure', 'monthly_bill', 'data_usage_gb', 'call_duration_min'];

    const rawX = rows.map(r => featureCols.map(c => parseFloat(r[c]) || 0));
    const y    = rows.map(r => parseInt(r.churn) || 0);

    // Check if we have any churn labels; derive if not
    const hasChurnLabels = y.some(v => v === 1);
    const derivedY = rows.map(r => {
      const tenure = parseFloat(r.tenure) || 0;
      const bill   = parseFloat(r.monthly_bill) || 0;
      const data   = parseFloat(r.data_usage_gb) || 0;
      // Heuristic: short tenure + low bill + low data → likely churn
      return (tenure < 5 && bill < 400) || (tenure < 3 && data < 5) ? 1 : 0;
    });
    const labels = hasChurnLabels ? y : derivedY;

    // Scale
    const { scaled } = minMaxScale(rawX);

    // K-Means segmentation (k=4)
    const km = new KMeans(4, 150);
    const clusterLabels = km.fit(scaled);
    const centroids = km.getCentroids();

    // Rank clusters: higher bill_norm + data_norm = more premium
    const centroidScores = centroids.map((c, i) => ({
      i, score: c[1] + c[2]
    })).sort((a, b) => b.score - a.score);

    const segNames = ['Premium', 'Standard', 'Basic', 'At-Risk'];
    const clusterToSeg = {};
    centroidScores.forEach((cs, rank) => { clusterToSeg[cs.i] = segNames[rank]; });

    // Churn prediction — Logistic Regression AND Random Forest
    const { Xtrain, ytrain, Xtest, ytest } = trainTestSplit(scaled, labels, 0.2);
    
    // Train Logistic Regression
    const lr = new LogisticRegression(0.12, 700);
    lr.train(Xtrain, ytrain);
    const lrChurnProbas = lr.predictProba(scaled);
    const lrChurnPreds  = lrChurnProbas.map(p => p >= 0.5 ? 1 : 0);
    const lrTestPreds   = lr.predictProba(Xtest).map(p => p >= 0.5 ? 1 : 0);
    const lrMetrics     = computeMetrics(ytest, lrTestPreds);

    // Train Random Forest (NEW!)
    const rf = new RandomForest(15, 8, 4); // 15 trees, max depth 8, min split 4
    rf.fit(Xtrain, ytrain);
    const rfChurnProbas = rf.predictProba(scaled);
    const rfChurnPreds  = rfChurnProbas.map(p => p >= 0.5 ? 1 : 0);
    const rfTestPreds   = rf.predictProba(Xtest).map(p => p >= 0.5 ? 1 : 0);
    const rfMetrics     = computeMetrics(ytest, rfTestPreds);

    // Use Random Forest as primary (better for non-linear patterns)
    const churnProbas = rfChurnProbas;
    const churnPreds  = rfChurnPreds;
    const primaryMetrics = rfMetrics;

    // Naive Bayes for comparison
    const nb = new NaiveBayes();
    nb.train(Xtrain, ytrain.map(String));
    const nbTestPreds = nb.predictProba(Xtest).map(p => p >= 0.5 ? 1 : 0);
    const nbMetrics   = computeMetrics(ytest, nbTestPreds);

    // Per-customer results
    const results = rows.map((r, i) => {
      const clv = (parseFloat(r.tenure) || 0) * (parseFloat(r.monthly_bill) || 0);
      return {
        customer_id: r.customer_id || `c${String(i + 1).padStart(3, '0')}`,
        name:        r.name || r.customer_id || `Customer ${i + 1}`,
        plan:        r.plan || 'Unknown',
        tenure:      parseFloat(r.tenure) || 0,
        bill:        parseFloat(r.monthly_bill) || 0,
        data:        parseFloat(r.data_usage_gb) || 0,
        calls:       parseFloat(r.call_duration_min) || 0,
        segment:     clusterToSeg[clusterLabels[i]] || 'Standard',
        churnProb:   +(churnProbas[i] * 100).toFixed(1),
        churnPred:   churnPreds[i],
        churnRisk:   churnProbas[i] > 0.65 ? 'high' : churnProbas[i] > 0.35 ? 'medium' : 'low',
        clv:         +clv.toFixed(0),
      };
    });

    // Segment counts
    const segCounts = { Premium: 0, Standard: 0, Basic: 0, 'At-Risk': 0 };
    results.forEach(r => { segCounts[r.segment] = (segCounts[r.segment] || 0) + 1; });

    // Aggregate analytics
    const highRisk      = results.filter(r => r.churnRisk === 'high').length;
    const churnRate     = +((results.filter(r => r.churnPred === 1).length / results.length) * 100).toFixed(1);
    const avgData       = +mean(results.map(r => r.data)).toFixed(1);
    const avgCalls      = +mean(results.map(r => r.calls)).toFixed(0);
    const avgBill       = +mean(results.map(r => r.bill)).toFixed(0);
    const avgTenure     = +mean(results.map(r => r.tenure)).toFixed(1);
    const totalRevenue  = +(results.reduce((s, r) => s + r.bill, 0) / 100000).toFixed(2); // lakhs

    if (!window.mlResults) window.mlResults = {};
    window.mlResults.customer = {
      results, segCounts,
      highRisk, churnRate,
      avgData, avgCalls, avgBill, avgTenure,
      totalRevenue,
      totalCustomers: results.length,
      models: {
        randomForest:  rfMetrics,
        logistic:      lrMetrics,
        naiveBayes:    nbMetrics,
      },
      primaryMetrics, // Random Forest is primary
      metrics: primaryMetrics, // Backward compatibility
    };

    return window.mlResults.customer;
  };

  /* ═══════════════════════════════
     MODULE 2 — UI RENDERING
  ═══════════════════════════════ */
  window.renderNetworkMLUI = function () {
    if (!window.processedNetwork) return;
    const data = window.runNetworkML(window.processedNetwork.allRows);
    if (!data) return;

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

    // KPI cards
    set('net-kpi-signal',    data.avgSignal + '%');
    set('net-kpi-latency',   data.avgLatency + ' ms');
    set('net-kpi-pl',        data.avgPacketLoss + '%');
    set('net-kpi-health',    data.networkHealth.toFixed(1) + '%');
    set('net-kpi-failures',  data.failureCount);
    set('net-kpi-accuracy',  data.primaryMetrics.accuracy + '%');
    set('net-kpi-precision', data.primaryMetrics.precision + '%');
    set('net-kpi-recall',    data.primaryMetrics.recall + '%');
    set('net-kpi-f1',        data.primaryMetrics.f1 + '%');

    // Confusion matrix
    set('conf-tp', data.primaryMetrics.tp);
    set('conf-fp', data.primaryMetrics.fp);
    set('conf-fn', data.primaryMetrics.fn);
    set('conf-tn', data.primaryMetrics.tn);

    // Predictions table
    buildNetPredTable(data);

    // Alerts
    buildNetAlerts(data.alerts);

    // Model comparison cards
    buildNetModelCards(data.models);

    // Charts
    renderNetworkMLCharts(data);
  };

  function buildNetPredTable(data) {
    const tb = document.getElementById('ml-pred-table-body');
    if (!tb) return;
    const sorted = [...data.results].sort((a, b) => b.probability - a.probability).slice(0, 20);
    tb.innerHTML = sorted.map(r => {
      const pc = r.probability > 80 ? 'c-rd' : r.probability > 60 ? 'c-or' : r.probability > 40 ? 'c-cy' : 'c-gr';
      const sc = r.predicted === 'Failure' ? '<span class="badge b-rd">✕ Failure</span>' : '<span class="badge b-gr">✓ Normal</span>';
      const sv = r.probability > 80 ? '<span class="badge b-rd">Critical</span>' :
                 r.probability > 60 ? '<span class="badge b-or">High</span>' :
                 r.probability > 40 ? '<span class="badge b-bl">Medium</span>' :
                 '<span class="badge b-gr">Low</span>';
      const sigC = r.signal >= 70 ? 'c-gr' : r.signal >= 45 ? 'c-or' : 'c-rd';
      const latC = r.latency <= 25 ? 'c-gr' : r.latency <= 60 ? 'c-or' : 'c-rd';
      const plC  = r.packetLoss <= 1 ? 'c-gr' : r.packetLoss <= 5 ? 'c-or' : 'c-rd';
      return `<tr>
        <td><strong>${r.node_id}</strong></td>
        <td class="mono ${sigC}">${r.signal}%</td>
        <td class="mono ${latC}">${r.latency} ms</td>
        <td class="mono">${r.bandwidth}%</td>
        <td class="mono ${plC}">${r.packetLoss}%</td>
        <td>${sc}</td>
        <td class="mono ${pc}"><strong>${r.probability}%</strong></td>
        <td>${sv}</td>
      </tr>`;
    }).join('');
  }

  function buildNetAlerts(alerts) {
    const wrap = document.getElementById('net-alerts-wrap');
    if (!wrap) return;
    if (!alerts.length) {
      wrap.innerHTML = '<div class="alert"><div class="alert-ico ai-gr">✓</div><div class="alert-body"><p>No active failure alerts — all nodes operating within normal parameters.</p></div></div>';
      return;
    }
    wrap.innerHTML = alerts.map(a => {
      const ic = a.sev === 'critical' ? 'ai-rd' : a.sev === 'high' ? 'ai-or' : 'ai-bl';
      const em = a.sev === 'critical' ? '🔴' : a.sev === 'high' ? '🟠' : '🔵';
      return `<div class="alert">
        <div class="alert-ico ${ic}">${em}</div>
        <div class="alert-body">
          <p><strong>${a.node}</strong> — ${a.reason}</p>
          <small>Failure probability: ${a.prob}%</small>
        </div>
      </div>`;
    }).join('');
  }

  function buildNetModelCards(models) {
    const wrap = document.getElementById('net-model-cards');
    if (!wrap) return;
    const lrBetter = models.logistic.accuracy >= models.naiveBayes.accuracy;
    wrap.innerHTML = `
      <div class="model-card ${lrBetter ? 'best' : ''}">
        ${lrBetter ? '<div class="best-tag">★ BEST</div>' : ''}
        <h4>Logistic Regression</h4>
        <div class="model-acc ${models.logistic.accuracy >= 80 ? 'c-gr' : 'c-or'}">${models.logistic.accuracy}%</div>
        <div class="mrow"><span class="mrow-lbl">Precision</span><span class="mrow-val">${models.logistic.precision}%</span></div>
        <div class="mrow"><span class="mrow-lbl">Recall</span><span class="mrow-val">${models.logistic.recall}%</span></div>
        <div class="mrow"><span class="mrow-lbl">F1 Score</span><span class="mrow-val">${models.logistic.f1}%</span></div>
        <div class="mrow"><span class="mrow-lbl">True Positives</span><span class="mrow-val c-gr">${models.logistic.tp}</span></div>
        <div class="mrow" style="border:0"><span class="mrow-lbl">False Positives</span><span class="mrow-val c-rd">${models.logistic.fp}</span></div>
      </div>
      <div class="model-card ${!lrBetter ? 'best' : ''}">
        ${!lrBetter ? '<div class="best-tag">★ BEST</div>' : ''}
        <h4>Naïve Bayes</h4>
        <div class="model-acc ${models.naiveBayes.accuracy >= 80 ? 'c-gr' : 'c-or'}">${models.naiveBayes.accuracy}%</div>
        <div class="mrow"><span class="mrow-lbl">Precision</span><span class="mrow-val">${models.naiveBayes.precision}%</span></div>
        <div class="mrow"><span class="mrow-lbl">Recall</span><span class="mrow-val">${models.naiveBayes.recall}%</span></div>
        <div class="mrow"><span class="mrow-lbl">F1 Score</span><span class="mrow-val">${models.naiveBayes.f1}%</span></div>
        <div class="mrow"><span class="mrow-lbl">True Positives</span><span class="mrow-val c-gr">${models.naiveBayes.tp}</span></div>
        <div class="mrow" style="border:0"><span class="mrow-lbl">False Positives</span><span class="mrow-val c-rd">${models.naiveBayes.fp}</span></div>
      </div>`;
  }

  function renderNetworkMLCharts(data) {
    // Signal distribution bar chart
    const sigEl = document.getElementById('ml-signal-chart');
    if (sigEl) {
      if (window._mlSignalChart) { window._mlSignalChart.destroy(); window._mlSignalChart = null; }
      const C = { blue:'#3b82f6', green:'#10b981', orange:'#f59e0b', red:'#ef4444', grid:'#0d1e35', txt:'#94a3b8', card:'#0b1221' };
      const labels = data.results.map(r => r.node_id);
      const signalVals = data.results.map(r => r.signal);
      const bgColors  = signalVals.map(v => v >= 70 ? 'rgba(16,185,129,.75)' : v >= 45 ? 'rgba(245,158,11,.75)' : 'rgba(239,68,68,.75)');
      window._mlSignalChart = new Chart(sigEl, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Signal Strength (%)', data: signalVals, backgroundColor: bgColors, borderRadius: 4 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: C.card, borderColor: '#162840', borderWidth: 1, padding: 10, cornerRadius: 8 } }, scales: { x: { grid: { display: false }, ticks: { maxRotation: 60, font: { size: 9 } } }, y: { grid: { color: C.grid }, min: 0, max: 100, ticks: { callback: v => v + '%' } } } },
      });
    }

    // Failure probability scatter (latency vs packet_loss, colour = prob)
    const scatEl = document.getElementById('ml-scatter-chart');
    if (scatEl) {
      if (window._mlScatterChart) { window._mlScatterChart.destroy(); window._mlScatterChart = null; }
      const C = { grid:'#0d1e35', card:'#0b1221' };
      const normalPts  = data.results.filter(r => r.predicted === 'Normal').map(r => ({ x: r.latency, y: r.packetLoss }));
      const failurePts = data.results.filter(r => r.predicted === 'Failure').map(r => ({ x: r.latency, y: r.packetLoss }));
      window._mlScatterChart = new Chart(scatEl, {
        type: 'scatter',
        data: { datasets: [
          { label: 'Normal', data: normalPts,  backgroundColor: 'rgba(16,185,129,.6)',  pointRadius: 5 },
          { label: 'Failure', data: failurePts, backgroundColor: 'rgba(239,68,68,.75)', pointRadius: 6 },
        ]},
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { boxWidth: 12 } }, tooltip: { backgroundColor: C.card, borderColor: '#162840', borderWidth: 1, padding: 10, cornerRadius: 8, callbacks: { label: ctx => `Latency: ${ctx.parsed.x}ms, PktLoss: ${ctx.parsed.y}%` } } }, scales: { x: { grid: { color: C.grid }, title: { display: true, text: 'Latency (ms)', color: '#94a3b8' } }, y: { grid: { color: C.grid }, title: { display: true, text: 'Packet Loss (%)', color: '#94a3b8' } } } },
      });
    }

    // Failure probability distribution bar
    const probEl = document.getElementById('ml-prob-chart');
    if (probEl) {
      if (window._mlProbChart) { window._mlProbChart.destroy(); window._mlProbChart = null; }
      const C = { grid:'#0d1e35', card:'#0b1221' };
      const sorted = [...data.results].sort((a, b) => b.probability - a.probability).slice(0, 15);
      window._mlProbChart = new Chart(probEl, {
        type: 'bar',
        data: { labels: sorted.map(r => r.node_id), datasets: [{ label: 'Failure Probability (%)', data: sorted.map(r => r.probability), backgroundColor: sorted.map(r => r.probability > 80 ? 'rgba(239,68,68,.8)' : r.probability > 60 ? 'rgba(245,158,11,.8)' : 'rgba(59,130,246,.75)'), borderRadius: 5 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: C.card, borderColor: '#162840', borderWidth: 1, padding: 10, cornerRadius: 8 } }, scales: { x: { grid: { display: false }, ticks: { maxRotation: 60, font: { size: 9 } } }, y: { grid: { color: C.grid }, min: 0, max: 100, ticks: { callback: v => v + '%' } } } },
      });
    }

    // Model comparison bar chart
    const modEl = document.getElementById('ml-model-comp-chart');
    if (modEl) {
      if (window._mlModCompChart) { window._mlModCompChart.destroy(); window._mlModCompChart = null; }
      const C = { grid:'#0d1e35', card:'#0b1221' };
      const lrM  = data.models.logistic;
      const nbM  = data.models.naiveBayes;
      window._mlModCompChart = new Chart(modEl, {
        type: 'bar',
        data: { labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score'], datasets: [
          { label: 'Logistic Regression', data: [lrM.accuracy, lrM.precision, lrM.recall, lrM.f1], backgroundColor: 'rgba(59,130,246,.75)', borderRadius: 4 },
          { label: 'Naïve Bayes',         data: [nbM.accuracy, nbM.precision, nbM.recall, nbM.f1], backgroundColor: 'rgba(16,185,129,.75)', borderRadius: 4 },
        ]},
        options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { position: 'top', labels: { boxWidth: 12 } }, tooltip: { backgroundColor: C.card, borderColor: '#162840', borderWidth: 1, padding: 10, cornerRadius: 8 } }, scales: { x: { grid: { display: false } }, y: { grid: { color: C.grid }, min: 0, max: 100, ticks: { callback: v => v + '%' } } } },
      });
    }
  }

  /* ═══════════════════════════════
     MODULE 3 — UI RENDERING
  ═══════════════════════════════ */
  window.renderCustomerMLUI = function () {
    if (!window.processedCustomer) return;
    const data = window.runCustomerML(window.processedCustomer.allRows);
    if (!data) return;

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

    // KPI cards
    set('cust-kpi-total',    data.totalCustomers.toLocaleString());
    set('cust-kpi-churnrate', data.churnRate + '%');
    set('cust-kpi-highrisk', data.highRisk.toLocaleString());
    set('cust-kpi-accuracy', data.metrics.accuracy + '%');
    set('cust-kpi-avgdata',  data.avgData + ' GB');
    set('cust-kpi-avgcalls', data.avgCalls + ' min');
    set('cust-kpi-premium',  (data.segCounts.Premium || 0).toLocaleString());
    set('cust-kpi-atrisk',   (data.segCounts['At-Risk'] || 0).toLocaleString());

    // Segment counts
    set('seg-premium',  data.segCounts.Premium  || 0);
    set('seg-standard', data.segCounts.Standard || 0);
    set('seg-basic',    data.segCounts.Basic     || 0);
    set('seg-atrisk',   data.segCounts['At-Risk']|| 0);

    // High risk table
    buildChurnRiskTable(data.results);

    // Model comparison cards
    buildCustomerMLModelCards(data.models);

    // Customer usage table
    buildCustomerMLTable(data.results);

    // Charts
    renderCustomerMLCharts(data);
  };

  function buildChurnRiskTable(results) {
    const tb = document.getElementById('ml-churn-risk-body');
    if (!tb) return;
    const highRisk = results.filter(r => r.churnRisk === 'high').sort((a, b) => b.churnProb - a.churnProb).slice(0, 20);
    tb.innerHTML = highRisk.map(r => {
      const pc = r.churnProb > 80 ? 'c-rd' : r.churnProb > 65 ? 'c-or' : 'c-cy';
      const sg = r.segment === 'Premium' ? '<span class="badge b-pu">Premium</span>' :
                 r.segment === 'Standard' ? '<span class="badge b-bl">Standard</span>' :
                 r.segment === 'Basic'    ? '<span class="badge b-cy">Basic</span>' :
                 '<span class="badge b-rd">At-Risk</span>';
      return `<tr>
        <td><strong>${r.customer_id}</strong></td>
        <td>${r.plan}</td>
        <td class="mono">${r.tenure} mo</td>
        <td class="mono">₹${r.bill.toLocaleString()}</td>
        <td class="mono">${r.data} GB</td>
        <td class="mono">${r.calls} min</td>
        <td class="mono ${pc}"><strong>${r.churnProb}%</strong></td>
        <td>${sg}</td>
      </tr>`;
    }).join('');
  }

  function buildCustomerMLModelCards(models) {
    const wrap = document.getElementById('cust-model-cards');
    if (!wrap) return;
    
    const rfBest = models.randomForest.accuracy >= models.logistic.accuracy && models.randomForest.accuracy >= models.naiveBayes.accuracy;
    const lrBest = !rfBest && models.logistic.accuracy >= models.naiveBayes.accuracy;
    const nbBest = !rfBest && !lrBest;
    
    wrap.innerHTML = `
      <div class="model-card ${rfBest ? 'best' : ''}">
        ${rfBest ? '<div class="best-tag">★ BEST</div>' : ''}
        <h4>Random Forest</h4>
        <div class="model-acc ${models.randomForest.accuracy >= 85 ? 'c-gr' : 'c-or'}">${models.randomForest.accuracy}%</div>
        <div class="mrow"><span class="mrow-lbl">Precision</span><span class="mrow-val">${models.randomForest.precision}%</span></div>
        <div class="mrow"><span class="mrow-lbl">Recall</span><span class="mrow-val">${models.randomForest.recall}%</span></div>
        <div class="mrow"><span class="mrow-lbl">F1 Score</span><span class="mrow-val">${models.randomForest.f1}%</span></div>
        <div class="mrow"><span class="mrow-lbl">True Positives</span><span class="mrow-val c-gr">${models.randomForest.tp}</span></div>
        <div class="mrow" style="border:0"><span class="mrow-lbl">False Positives</span><span class="mrow-val c-rd">${models.randomForest.fp}</span></div>
      </div>
      <div class="model-card ${lrBest ? 'best' : ''}">
        ${lrBest ? '<div class="best-tag">★ BEST</div>' : ''}
        <h4>Logistic Regression</h4>
        <div class="model-acc ${models.logistic.accuracy >= 85 ? 'c-gr' : 'c-or'}">${models.logistic.accuracy}%</div>
        <div class="mrow"><span class="mrow-lbl">Precision</span><span class="mrow-val">${models.logistic.precision}%</span></div>
        <div class="mrow"><span class="mrow-lbl">Recall</span><span class="mrow-val">${models.logistic.recall}%</span></div>
        <div class="mrow"><span class="mrow-lbl">F1 Score</span><span class="mrow-val">${models.logistic.f1}%</span></div>
        <div class="mrow"><span class="mrow-lbl">True Positives</span><span class="mrow-val c-gr">${models.logistic.tp}</span></div>
        <div class="mrow" style="border:0"><span class="mrow-lbl">False Positives</span><span class="mrow-val c-rd">${models.logistic.fp}</span></div>
      </div>
      <div class="model-card ${nbBest ? 'best' : ''}">
        ${nbBest ? '<div class="best-tag">★ BEST</div>' : ''}
        <h4>Naïve Bayes</h4>
        <div class="model-acc ${models.naiveBayes.accuracy >= 85 ? 'c-gr' : 'c-or'}">${models.naiveBayes.accuracy}%</div>
        <div class="mrow"><span class="mrow-lbl">Precision</span><span class="mrow-val">${models.naiveBayes.precision}%</span></div>
        <div class="mrow"><span class="mrow-lbl">Recall</span><span class="mrow-val">${models.naiveBayes.recall}%</span></div>
        <div class="mrow"><span class="mrow-lbl">F1 Score</span><span class="mrow-val">${models.naiveBayes.f1}%</span></div>
        <div class="mrow"><span class="mrow-lbl">True Positives</span><span class="mrow-val c-gr">${models.naiveBayes.tp}</span></div>
        <div class="mrow" style="border:0"><span class="mrow-lbl">False Positives</span><span class="mrow-val c-rd">${models.naiveBayes.fp}</span></div>
      </div>`;
  }

  function buildCustomerMLTable(results) {
    const tb = document.getElementById('ml-customer-table-body');
    if (!tb) return;
    tb.innerHTML = results.slice(0, 20).map(r => {
      const cb = r.churnRisk === 'low'    ? '<span class="badge b-gr">Low</span>' :
                 r.churnRisk === 'medium' ? '<span class="badge b-or">Medium</span>' :
                 '<span class="badge b-rd">High</span>';
      const sg = r.segment === 'Premium' ? '<span class="badge b-pu">Premium</span>' :
                 r.segment === 'Standard' ? '<span class="badge b-bl">Standard</span>' :
                 r.segment === 'Basic'    ? '<span class="badge b-cy">Basic</span>' :
                 '<span class="badge b-rd">At-Risk</span>';
      const pc = r.churnProb > 65 ? 'c-rd' : r.churnProb > 35 ? 'c-or' : 'c-gr';
      return `<tr>
        <td><strong>${r.customer_id}</strong></td>
        <td>${r.plan}</td>
        <td class="mono">${r.tenure} mo</td>
        <td class="mono">${r.data} GB</td>
        <td class="mono">${r.calls} min</td>
        <td class="mono ${pc}">${r.churnProb}%</td>
        <td>${cb}</td>
        <td>${sg}</td>
      </tr>`;
    }).join('');
  }

  function renderCustomerMLCharts(data) {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      console.error('❌ Chart.js not loaded yet - retrying in 500ms...');
      setTimeout(() => renderCustomerMLCharts(data), 500);
      return;
    }
    
    console.log('📊 Rendering customer ML charts with data:', data);
    const C = { blue:'#3b82f6', cyan:'#06b6d4', green:'#10b981', orange:'#f59e0b', red:'#ef4444', purple:'#8b5cf6', grid:'#0d1e35', card:'#0b1221' };
    const tip = { backgroundColor: C.card, borderColor: '#162840', borderWidth: 1, padding: 10, cornerRadius: 8 };

    // K-Means segment donut
    const segEl = document.getElementById('ml-segment-chart');
    console.log('🥧 K-Means segment chart element:', segEl);
    if (segEl) {
      if (window._mlSegChart) { window._mlSegChart.destroy(); window._mlSegChart = null; }
      const segData = [data.segCounts.Premium||0, data.segCounts.Standard||0, data.segCounts.Basic||0, data.segCounts['At-Risk']||0];
      console.log('  Segment counts:', segData);
      window._mlSegChart = new Chart(segEl, {
        type: 'doughnut',
        data: { labels: ['Premium', 'Standard', 'Basic', 'At-Risk'], datasets: [{ data: segData, backgroundColor: [C.purple, C.blue, C.cyan, C.red], borderWidth: 2, borderColor: C.card, hoverOffset: 8 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } }, tooltip: tip } },
      });
    }

    // Churn probability distribution histogram
    const churnDistEl = document.getElementById('ml-churn-dist-chart');
    if (churnDistEl) {
      if (window._mlChurnDistChart) { window._mlChurnDistChart.destroy(); window._mlChurnDistChart = null; }
      const bins = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      const binCounts = Array(bins.length - 1).fill(0);
      data.results.forEach(r => {
        const idx = Math.min(Math.floor(r.churnProb / 10), binCounts.length - 1);
        binCounts[idx]++;
      });
      const binLabels = bins.slice(0, -1).map((b, i) => `${b}–${bins[i+1]}%`);
      window._mlChurnDistChart = new Chart(churnDistEl, {
        type: 'bar',
        data: { labels: binLabels, datasets: [{ label: 'Customers', data: binCounts, backgroundColor: binLabels.map((_, i) => i >= 6 ? 'rgba(239,68,68,.75)' : i >= 3 ? 'rgba(245,158,11,.75)' : 'rgba(16,185,129,.75)'), borderRadius: 4 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tip }, scales: { x: { grid: { display: false } }, y: { grid: { color: C.grid } } } },
      });
    }

    // Data usage vs churn probability scatter
    const dataScatEl = document.getElementById('ml-data-churn-chart');
    if (dataScatEl) {
      if (window._mlDataChurnChart) { window._mlDataChurnChart.destroy(); window._mlDataChurnChart = null; }
      const lowChurn  = data.results.filter(r => r.churnRisk === 'low').map(r => ({ x: r.data, y: r.churnProb }));
      const medChurn  = data.results.filter(r => r.churnRisk === 'medium').map(r => ({ x: r.data, y: r.churnProb }));
      const highChurn = data.results.filter(r => r.churnRisk === 'high').map(r => ({ x: r.data, y: r.churnProb }));
      window._mlDataChurnChart = new Chart(dataScatEl, {
        type: 'scatter',
        data: { datasets: [
          { label: 'Low Risk',    data: lowChurn,  backgroundColor: 'rgba(16,185,129,.6)',  pointRadius: 4 },
          { label: 'Medium Risk', data: medChurn,  backgroundColor: 'rgba(245,158,11,.7)',  pointRadius: 4 },
          { label: 'High Risk',   data: highChurn, backgroundColor: 'rgba(239,68,68,.75)',  pointRadius: 5 },
        ]},
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { boxWidth: 12 } }, tooltip: { ...tip, callbacks: { label: ctx => `Data: ${ctx.parsed.x} GB, Churn: ${ctx.parsed.y}%` } } }, scales: { x: { grid: { color: C.grid }, title: { display: true, text: 'Data Usage (GB)', color: '#94a3b8' } }, y: { grid: { color: C.grid }, title: { display: true, text: 'Churn Probability (%)', color: '#94a3b8' } } } },
      });
    }

    // Tenure vs churn box-like bar
    const tenureEl = document.getElementById('ml-tenure-chart');
    if (tenureEl) {
      if (window._mlTenureChart) { window._mlTenureChart.destroy(); window._mlTenureChart = null; }
      const tenureBuckets = { '0–6 mo': [], '7–12 mo': [], '13–24 mo': [], '25–48 mo': [], '49+ mo': [] };
      data.results.forEach(r => {
        const t = r.tenure;
        const bucket = t <= 6 ? '0–6 mo' : t <= 12 ? '7–12 mo' : t <= 24 ? '13–24 mo' : t <= 48 ? '25–48 mo' : '49+ mo';
        tenureBuckets[bucket].push(r.churnProb);
      });
      const bucketKeys = Object.keys(tenureBuckets);
      const avgProbs = bucketKeys.map(k => tenureBuckets[k].length ? +(tenureBuckets[k].reduce((a, b) => a + b, 0) / tenureBuckets[k].length).toFixed(1) : 0);
      window._mlTenureChart = new Chart(tenureEl, {
        type: 'bar',
        data: { labels: bucketKeys, datasets: [{ label: 'Avg Churn Probability (%)', data: avgProbs, backgroundColor: avgProbs.map(v => v > 60 ? 'rgba(239,68,68,.75)' : v > 35 ? 'rgba(245,158,11,.75)' : 'rgba(16,185,129,.75)'), borderRadius: 5 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tip }, scales: { x: { grid: { display: false } }, y: { grid: { color: C.grid }, min: 0, max: 100, ticks: { callback: v => v + '%' } } } },
      });
    }

    // Plan distribution doughnut
    const planEl = document.getElementById('ml-plan-chart');
    if (planEl) {
      if (window._mlPlanChart) { window._mlPlanChart.destroy(); window._mlPlanChart = null; }
      const planCounts = {};
      data.results.forEach(r => { planCounts[r.plan] = (planCounts[r.plan] || 0) + 1; });
      const pLabels = Object.keys(planCounts);
      const pVals   = Object.values(planCounts);
      const pColors = [C.purple, C.blue, C.cyan, C.orange, C.green];
      window._mlPlanChart = new Chart(planEl, {
        type: 'pie',
        data: { labels: pLabels, datasets: [{ data: pVals, backgroundColor: pColors.slice(0, pLabels.length), borderWidth: 2, borderColor: C.card, hoverOffset: 8 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } }, tooltip: tip } },
      });
    }
  }

})();
