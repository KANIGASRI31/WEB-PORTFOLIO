/* ═══════════════════════════════════════════
   TelecomIQ — Report Export Functions
   Enhanced PDF and Excel report generation with clear formatting
═══════════════════════════════════════════ */

/* ── ANALYTICS PDF EXPORT (COMPREHENSIVE) ── */
window.exportAnalyticsPDF = function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const netML = window.mlResults && window.mlResults.network;
  const custML = window.mlResults && window.mlResults.customer;
  
  if (!netML && !custML) {
    alert('⚠️ No data available. Please load sample data and run ML models first.');
    return;
  }
  
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit' });

  // ===== PAGE 1: COVER & EXECUTIVE SUMMARY =====
  
  // Header with branding
  doc.setFillColor(8, 13, 26);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('TelecomIQ', 105, 18, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Integrated Analytics Report', 105, 27, { align: 'center' });
  
  doc.setFontSize(9);
  doc.text(`Generated on ${dateStr} at ${timeStr}`, 105, 35, { align: 'center' });

  // Report period box
  let yPos = 50;
  doc.setFillColor(240, 245, 255);
  doc.roundedRect(14, yPos, 182, 18, 3, 3, 'F');
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORT PERIOD:', 20, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(window.dateFilterState && window.dateFilterState.active 
    ? `${window.dateFilterState.fromDate.toLocaleDateString()} to ${window.dateFilterState.toDate.toLocaleDateString()}`
    : 'All Available Data (No Date Filter Applied)', 20, yPos + 14);

  yPos += 28;

  // Executive Summary Section
  doc.setFillColor(59, 130, 246);
  doc.rect(14, yPos, 5, 8, 'F');
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('EXECUTIVE SUMMARY', 22, yPos + 6);
  yPos += 15;

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Key Performance Indicators across Network Operations and Customer Analytics', 14, yPos);
  yPos += 10;

  const totalNodes = netML ? netML.totalNodes : 20;
  const failNodes = netML ? netML.failureCount : 0;
  const networkHealth = netML ? netML.networkHealth.toFixed(1) : 'N/A';
  const netAccuracy = netML ? netML.primaryMetrics.accuracy : 'N/A';
  const avgSignal = netML ? netML.avgSignal : 'N/A';
  const avgLatency = netML ? netML.avgLatency : 'N/A';
  
  const totalCustomers = custML ? custML.totalCustomers : 0;
  const highRisk = custML ? custML.highRisk : 0;
  const churnRate = custML ? custML.churnRate.toFixed(1) : 'N/A';
  const custAccuracy = custML ? custML.primaryMetrics.accuracy : 'N/A';
  const primaryModel = custML ? custML.primaryModel : 'N/A';

  const summaryData = [
    ['NETWORK METRICS', '', '', ''],
    ['Total Network Nodes Monitored', totalNodes, 'Network Health Score', `${networkHealth}%`],
    ['Nodes Predicted to Fail', failNodes, 'ML Model Accuracy', `${netAccuracy}%`],
    ['Average Signal Strength', `${avgSignal}%`, 'Average Latency', `${avgLatency} ms`],
    ['', '', '', ''],
    ['CUSTOMER METRICS', '', '', ''],
    ['Total Active Customers', totalCustomers.toLocaleString(), 'Churn Rate', `${churnRate}%`],
    ['High Churn Risk Customers', highRisk.toLocaleString(), 'Primary ML Model', primaryModel],
    ['Churn Model Accuracy', `${custAccuracy}%`, 'Risk Threshold', '> 65%'],
  ];

  doc.autoTable({
    startY: yPos,
    body: summaryData,
    theme: 'plain',
    styles: { 
      fontSize: 9,
      cellPadding: 3,
      lineColor: [220, 220, 220],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [60, 60, 60], cellWidth: 55 },
      1: { textColor: [0, 0, 0], cellWidth: 35 },
      2: { fontStyle: 'bold', textColor: [60, 60, 60], cellWidth: 50 },
      3: { textColor: [0, 0, 0], cellWidth: 42 }
    },
    didParseCell: function(data) {
      if (data.row.index === 0 || data.row.index === 5) {
        data.cell.styles.fillColor = [59, 130, 246];
        data.cell.styles.textColor = [255, 255, 255];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.halign = 'left';
      }
      if (data.row.index === 4) {
        data.cell.styles.fillColor = [250, 250, 250];
      }
    },
    margin: { left: 14, right: 14 }
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // Status Indicators
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFillColor(59, 130, 246);
  doc.rect(14, yPos, 5, 8, 'F');
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('STATUS INDICATORS', 22, yPos + 6);
  yPos += 12;

  const getStatus = (value, good, warning) => {
    if (value === 'N/A') return { text: '⚪ NO DATA', color: [150, 150, 150] };
    const num = parseFloat(value);
    if (num >= good) return { text: '🟢 GOOD', color: [16, 185, 129] };
    if (num >= warning) return { text: '🟠 WARNING', color: [245, 158, 11] };
    return { text: '🔴 CRITICAL', color: [239, 68, 68] };
  };

  const networkStatus = getStatus(networkHealth, 80, 60);
  const failStatus = failNodes === 0 ? { text: '🟢 GOOD', color: [16, 185, 129] } : 
                     failNodes <= 3 ? { text: '🟠 WARNING', color: [245, 158, 11] } :
                     { text: '🔴 CRITICAL', color: [239, 68, 68] };
  const churnStatus = getStatus(100 - parseFloat(churnRate), 95, 90);

  const statusData = [
    ['Network Health', `${networkHealth}%`, networkStatus.text, 'Based on signal, latency, bandwidth, packet loss'],
    ['Failure Risk', `${failNodes} nodes`, failStatus.text, 'Nodes with >50% failure probability'],
    ['Customer Retention', `${100 - parseFloat(churnRate)}%`, churnStatus.text, 'Inverse of churn rate'],
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Metric', 'Value', 'Status', 'Description']],
    body: statusData,
    theme: 'striped',
    headStyles: { 
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 35, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 77, fontSize: 8, textColor: [100, 100, 100] }
    },
    margin: { left: 14, right: 14 }
  });

  // ===== PAGE 2: NETWORK FAILURE ALERTS =====
  
  if (netML && netML.alerts && netML.alerts.length > 0) {
    doc.addPage();
    yPos = 20;

    doc.setFillColor(239, 68, 68);
    doc.rect(14, yPos, 5, 8, 'F');
    doc.setTextColor(239, 68, 68);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('🚨 NETWORK FAILURE ALERTS', 22, yPos + 6);
    yPos += 12;

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${netML.alerts.length} node(s) require immediate attention based on ML predictions`, 14, yPos);
    yPos += 10;

    const alertData = netML.alerts.slice(0, 20).map((a, idx) => [
      idx + 1,
      a.node,
      `${a.prob.toFixed(1)}%`,
      a.sev.toUpperCase(),
      a.reason.substring(0, 60) + (a.reason.length > 60 ? '...' : '')
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['#', 'Node ID', 'Failure Prob.', 'Severity', 'Reason / Contributing Factors']],
      body: alertData,
      theme: 'grid',
      headStyles: { 
        fillColor: [239, 68, 68],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold'
      },
      styles: { fontSize: 8, cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 30, fontStyle: 'bold' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 25, halign: 'center', fontStyle: 'bold' },
        4: { cellWidth: 92, fontSize: 7.5 }
      },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 3) {
          const severity = data.cell.raw;
          if (severity === 'CRITICAL') {
            data.cell.styles.fillColor = [254, 226, 226];
            data.cell.styles.textColor = [127, 29, 29];
          } else if (severity === 'HIGH') {
            data.cell.styles.fillColor = [254, 243, 199];
            data.cell.styles.textColor = [120, 53, 15];
          }
        }
      },
      margin: { left: 14, right: 14 }
    });

    // Action Items Box
    yPos = doc.lastAutoTable.finalY + 10;
    if (yPos < 260) {
      doc.setFillColor(255, 250, 230);
      doc.roundedRect(14, yPos, 182, 20, 3, 3, 'F');
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.5);
      doc.roundedRect(14, yPos, 182, 20, 3, 3, 'S');
      
      doc.setTextColor(120, 53, 15);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('⚡ RECOMMENDED ACTIONS:', 20, yPos + 7);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('• Dispatch maintenance teams to CRITICAL nodes immediately', 20, yPos + 13);
      doc.text('• Schedule preventive maintenance for HIGH severity nodes within 24-48 hours', 20, yPos + 18);
    }
  }

  // ===== PAGE 3: HIGH CHURN RISK CUSTOMERS =====
  
  if (custML && custML.highRiskCustomers && custML.highRiskCustomers.length > 0) {
    doc.addPage();
    yPos = 20;

    doc.setFillColor(239, 68, 68);
    doc.rect(14, yPos, 5, 8, 'F');
    doc.setTextColor(239, 68, 68);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('📉 HIGH CHURN RISK CUSTOMERS', 22, yPos + 6);
    yPos += 12;

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${custML.highRisk} customer(s) identified with >65% probability of churning (${primaryModel} model)`, 14, yPos);
    yPos += 10;

    const churnData = custML.highRiskCustomers.slice(0, 25).map((c, idx) => [
      idx + 1,
      c.customer_id || `CUST-${idx + 1}`,
      `${(c.churnProba * 100).toFixed(1)}%`,
      c.plan || 'Standard',
      `${c.tenure || 0} mo`,
      `₹${(c.monthly_bill || 0).toLocaleString()}`,
      c.segment || 'Standard'
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['#', 'Customer ID', 'Churn Prob.', 'Plan', 'Tenure', 'Monthly Bill', 'Segment']],
      body: churnData,
      theme: 'grid',
      headStyles: { 
        fillColor: [239, 68, 68],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold'
      },
      styles: { fontSize: 8, cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 35, fontStyle: 'bold' },
        2: { cellWidth: 25, halign: 'center', fontStyle: 'bold' },
        3: { cellWidth: 25 },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 28, halign: 'right' },
        6: { cellWidth: 30 }
      },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 2) {
          const prob = parseFloat(data.cell.raw);
          if (prob >= 80) {
            data.cell.styles.fillColor = [254, 226, 226];
            data.cell.styles.textColor = [127, 29, 29];
          } else if (prob >= 65) {
            data.cell.styles.fillColor = [254, 243, 199];
            data.cell.styles.textColor = [120, 53, 15];
          }
        }
      },
      margin: { left: 14, right: 14 }
    });

    // Retention Strategy Box
    yPos = doc.lastAutoTable.finalY + 10;
    if (yPos < 255) {
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(14, yPos, 182, 25, 3, 3, 'F');
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.5);
      doc.roundedRect(14, yPos, 182, 25, 3, 3, 'S');
      
      doc.setTextColor(6, 95, 70);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('💡 RETENTION STRATEGIES:', 20, yPos + 7);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('• Contact customers with >80% churn probability within 24 hours', 20, yPos + 13);
      doc.text('• Offer plan upgrades, loyalty discounts, or personalized packages', 20, yPos + 18);
      doc.text('• Schedule customer satisfaction calls for 65-80% risk customers', 20, yPos + 23);
    }
  }

  // ===== PAGE 4: CUSTOMER SEGMENTATION =====
  
  if (custML && custML.segCounts) {
    doc.addPage();
    yPos = 20;

    doc.setFillColor(139, 92, 246);
    doc.rect(14, yPos, 5, 8, 'F');
    doc.setTextColor(139, 92, 246);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('👥 CUSTOMER SEGMENTATION ANALYSIS', 22, yPos + 6);
    yPos += 12;

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('K-Means clustering results showing customer distribution across behavioral segments', 14, yPos);
    yPos += 10;

    const totalCust = Object.values(custML.segCounts).reduce((a, b) => a + b, 0);
    const segData = Object.entries(custML.segCounts).map(([seg, count]) => [
      seg,
      count.toLocaleString(),
      `${((count / totalCust) * 100).toFixed(1)}%`,
      getSegmentDescription(seg)
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Segment', 'Customer Count', 'Percentage', 'Description']],
      body: segData,
      theme: 'striped',
      headStyles: { 
        fillColor: [139, 92, 246],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 35, fontStyle: 'bold' },
        1: { cellWidth: 35, halign: 'center' },
        2: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
        3: { cellWidth: 82, fontSize: 8.5, textColor: [80, 80, 80] }
      },
      margin: { left: 14, right: 14 }
    });
  }

  // ===== FINAL PAGE: RECOMMENDATIONS =====
  
  doc.addPage();
  yPos = 20;

  doc.setFillColor(6, 182, 212);
  doc.rect(14, yPos, 5, 8, 'F');
  doc.setTextColor(6, 182, 212);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('🎯 STRATEGIC RECOMMENDATIONS', 22, yPos + 6);
  yPos += 15;

  const recommendations = [];
  
  if (netML) {
    const critAlerts = netML.alerts ? netML.alerts.filter(a => a.sev === 'critical').length : 0;
    if (critAlerts > 0) {
      recommendations.push({
        priority: 'HIGH',
        color: [239, 68, 68],
        title: 'Critical Network Infrastructure',
        text: `${critAlerts} node(s) require immediate field inspection and repair to prevent service outages.`
      });
    }
    
    if (parseFloat(networkHealth) < 70) {
      recommendations.push({
        priority: 'HIGH',
        color: [239, 68, 68],
        title: 'Network Health Below Threshold',
        text: `Overall health score is ${networkHealth}% (target: 80%+). Conduct comprehensive infrastructure audit.`
      });
    }
  }
  
  if (custML) {
    if (highRisk > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        color: [245, 158, 11],
        title: 'Churn Prevention Campaign',
        text: `Launch targeted retention campaign for ${highRisk} high-risk customers. Estimated revenue at risk: ₹${(highRisk * 1200).toLocaleString()}/month.`
      });
    }
    
    if (parseFloat(churnRate) > 5) {
      recommendations.push({
        priority: 'MEDIUM',
        color: [245, 158, 11],
        title: 'Elevated Churn Rate',
        text: `Monthly churn at ${churnRate}% exceeds industry standard (3-5%). Review service quality and competitive pricing.`
      });
    }
  }
  
  recommendations.push({
    priority: 'LOW',
    color: [16, 185, 129],
    title: 'ML Model Maintenance',
    text: 'Schedule monthly model retraining with fresh data to maintain prediction accuracy above 90%.'
  });
  
  recommendations.push({
    priority: 'LOW',
    color: [16, 185, 129],
    title: 'Data Quality Monitoring',
    text: 'Continue automated data preprocessing pipeline. Maintain data quality score above 95% threshold.'
  });

  recommendations.forEach((rec, idx) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Priority badge
    doc.setFillColor(...rec.color);
    doc.roundedRect(14, yPos, 25, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(rec.priority, 26.5, yPos + 5.5, { align: 'center' });
    
    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${idx + 1}. ${rec.title}`, 42, yPos + 5.5);
    
    yPos += 10;
    
    // Description
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(rec.text, 175);
    doc.text(lines, 17, yPos);
    yPos += lines.length * 5 + 8;
  });

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(14, 285, 196, 285);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'normal');
    doc.text('TelecomIQ Analytics Platform', 14, 290);
    doc.text('CSA 1614 - Data Warehousing & Data Mining | SIMATS Engineering', 105, 290, { align: 'center' });
    doc.text(`Page ${i} of ${pageCount}`, 196, 290, { align: 'right' });
  }

  // Save
  const filename = `TelecomIQ_Analytics_Report_${dateStr.replace(/ /g, '_')}.pdf`;
  doc.save(filename);
  console.log(`✅ Comprehensive PDF report exported: ${filename}`);
};

// Helper function for segment descriptions
function getSegmentDescription(segment) {
  const descriptions = {
    'Premium': 'High-value customers with elevated usage and strong loyalty',
    'Standard': 'Average customers with moderate usage patterns',
    'Basic': 'Light users with minimal service engagement',
    'At-Risk': 'Low tenure, low usage - high probability of churn'
  };
  return descriptions[segment] || 'Customer segment based on usage patterns';
}

/* ── Network Module PDF Export ── */
window.exportNetworkPDF = function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const netML = window.mlResults && window.mlResults.network;
  const dateStr = new Date().toLocaleDateString('en-IN');
  const timeStr = new Date().toLocaleTimeString('en-IN', { hour12: false });

  if (!netML) {
    alert('⚠️ No network ML results available. Please run the network failure prediction model first.');
    return;
  }

  // Header
  doc.setFillColor(8, 13, 26);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Network Failure Prediction Report', 105, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${dateStr} ${timeStr}`, 105, 22, { align: 'center' });
  doc.text(`Model: Logistic Regression | Accuracy: ${netML.primaryMetrics.accuracy}%`, 105, 28, { align: 'center' });

  let yPos = 45;

  // Summary metrics
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('📊 Network Summary', 14, yPos);
  yPos += 10;

  const summaryData = [
    ['Total Nodes Monitored', netML.totalNodes],
    ['Nodes at Failure Risk', netML.failureCount],
    ['Network Health Score', `${netML.networkHealth.toFixed(1)}%`],
    ['Avg Signal Strength', `${netML.avgSignal}%`],
    ['Avg Latency', `${netML.avgLatency} ms`],
    ['Avg Packet Loss', `${netML.avgPacketLoss}%`],
    ['Model Accuracy', `${netML.primaryMetrics.accuracy}%`],
    ['Model Precision', netML.primaryMetrics.precision.toFixed(3)],
    ['Model Recall', netML.primaryMetrics.recall.toFixed(3)],
    ['Model F1 Score', netML.primaryMetrics.f1.toFixed(3)]
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    margin: { left: 14, right: 14 }
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // Critical alerts
  if (netML.alerts && netML.alerts.length > 0) {
    doc.setTextColor(239, 68, 68);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('🚨 Failure Alerts', 14, yPos);
    yPos += 10;

    const alertData = netML.alerts.map(a => [
      a.node,
      `${a.prob.toFixed(1)}%`,
      a.sev.toUpperCase(),
      a.reason
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Node ID', 'Failure Prob.', 'Severity', 'Reason']],
      body: alertData,
      theme: 'grid',
      headStyles: { fillColor: [239, 68, 68], textColor: 255 },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 }
    });

    yPos = doc.lastAutoTable.finalY + 15;
  }

  // All predictions
  if (netML.results && netML.results.length > 0) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setTextColor(59, 130, 246);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('📋 All Node Predictions', 14, yPos);
    yPos += 10;

    const predData = netML.results.slice(0, 30).map(r => [
      r.node_id || r.nodeId || 'N/A',
      `${r.signal_strength?.toFixed(0) || '—'}%`,
      `${r.latency?.toFixed(0) || '—'} ms`,
      `${r.packet_loss?.toFixed(2) || '—'}%`,
      r.prediction === 1 ? 'FAIL' : 'OK',
      `${r.probability?.toFixed(1) || '—'}%`
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Node', 'Signal', 'Latency', 'Pkt Loss', 'Pred', 'Prob']],
      body: predData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8 }
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`TelecomIQ Network Report | Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
  }

  const filename = `TelecomIQ_Network_${dateStr.replace(/\//g, '-')}.pdf`;
  doc.save(filename);
  console.log(`✅ Network PDF exported: ${filename}`);
};

/* ── Customer Module PDF Export ── */
window.exportCustomerPDF = function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const custML = window.mlResults && window.mlResults.customer;
  const dateStr = new Date().toLocaleDateString('en-IN');
  const timeStr = new Date().toLocaleTimeString('en-IN', { hour12: false });

  if (!custML) {
    alert('⚠️ No customer ML results available. Please run the customer behaviour analysis first.');
    return;
  }

  // Header
  doc.setFillColor(8, 13, 26);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Behaviour Analysis Report', 105, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${dateStr} ${timeStr}`, 105, 22, { align: 'center' });
  doc.text(`Primary Model: ${custML.primaryModel} | Accuracy: ${custML.primaryMetrics.accuracy}%`, 105, 28, { align: 'center' });

  let yPos = 45;

  // Summary
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('📊 Customer Summary', 14, yPos);
  yPos += 10;

  const summaryData = [
    ['Total Customers', custML.totalCustomers],
    ['High Churn Risk', custML.highRisk],
    ['Churn Rate', `${custML.churnRate.toFixed(1)}%`],
    ['Model Accuracy', `${custML.primaryMetrics.accuracy}%`],
    ['Model Precision', custML.primaryMetrics.precision.toFixed(3)],
    ['Model Recall', custML.primaryMetrics.recall.toFixed(3)],
    ['Model F1 Score', custML.primaryMetrics.f1.toFixed(3)],
    ['Avg Data Usage', `${custML.avgDataUsage.toFixed(1)} GB`],
    ['Avg Call Duration', `${custML.avgCallDuration.toFixed(0)} min`]
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [139, 92, 246], textColor: 255 },
    margin: { left: 14, right: 14 }
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // Segmentation
  if (custML.segCounts) {
    doc.setTextColor(139, 92, 246);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('📊 Customer Segments (K-Means)', 14, yPos);
    yPos += 10;

    const segData = Object.entries(custML.segCounts).map(([seg, count]) => [
      seg,
      count,
      `${((count / custML.totalCustomers) * 100).toFixed(1)}%`
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Segment', 'Count', 'Percentage']],
      body: segData,
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246], textColor: 255 },
      margin: { left: 14, right: 14 }
    });

    yPos = doc.lastAutoTable.finalY + 15;
  }

  // High risk customers
  if (custML.highRiskCustomers && custML.highRiskCustomers.length > 0) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setTextColor(239, 68, 68);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('🚨 High Churn Risk Customers', 14, yPos);
    yPos += 10;

    const churnData = custML.highRiskCustomers.slice(0, 25).map(c => [
      c.customer_id || c.id || 'N/A',
      `${(c.churnProba * 100).toFixed(1)}%`,
      c.plan || 'Standard',
      `${c.tenure || 0} mo`,
      `₹${c.monthly_bill || 0}`
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Customer ID', 'Churn Prob.', 'Plan', 'Tenure', 'Bill']],
      body: churnData,
      theme: 'grid',
      headStyles: { fillColor: [239, 68, 68], textColor: 255 },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 }
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`TelecomIQ Customer Report | Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
  }

  const filename = `TelecomIQ_Customer_${dateStr.replace(/\//g, '-')}.pdf`;
  doc.save(filename);
  console.log(`✅ Customer PDF exported: ${filename}`);
};

/* ── Network Module Excel Export ── */
window.exportNetworkExcel = function() {
  const netML = window.mlResults && window.mlResults.network;
  const dateStr = new Date().toLocaleDateString('en-IN');

  if (!netML) {
    alert('⚠️ No network ML results available. Please run the network failure prediction model first.');
    return;
  }

  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary
  const summaryData = [
    ['TelecomIQ Network Failure Prediction Report'],
    [`Generated: ${dateStr}`],
    [],
    ['Network Metrics', ''],
    ['Total Nodes', netML.totalNodes],
    ['Nodes at Failure Risk', netML.failureCount],
    ['Network Health Score', `${netML.networkHealth.toFixed(1)}%`],
    ['Avg Signal Strength', `${netML.avgSignal}%`],
    ['Avg Latency', `${netML.avgLatency} ms`],
    ['Avg Packet Loss', `${netML.avgPacketLoss}%`],
    [],
    ['Model Performance', ''],
    ['Model', 'Logistic Regression'],
    ['Accuracy', `${netML.primaryMetrics.accuracy}%`],
    ['Precision', netML.primaryMetrics.precision.toFixed(3)],
    ['Recall', netML.primaryMetrics.recall.toFixed(3)],
    ['F1 Score', netML.primaryMetrics.f1.toFixed(3)]
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

  // Sheet 2: Failure Alerts
  if (netML.alerts && netML.alerts.length > 0) {
    const alertData = [
      ['Node ID', 'Failure Probability (%)', 'Severity', 'Reason'],
      ...netML.alerts.map(a => [a.node, a.prob.toFixed(1), a.sev.toUpperCase(), a.reason])
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(alertData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Failure Alerts');
  }

  // Sheet 3: All Predictions
  if (netML.results && netML.results.length > 0) {
    const predData = [
      ['Node ID', 'Signal (%)', 'Latency (ms)', 'Bandwidth (%)', 'Packet Loss (%)', 'Prediction', 'Failure Prob (%)'],
      ...netML.results.map(r => [
        r.node_id || r.nodeId || 'N/A',
        r.signal_strength?.toFixed(1) || '—',
        r.latency?.toFixed(1) || '—',
        r.bandwidth?.toFixed(1) || '—',
        r.packet_loss?.toFixed(2) || '—',
        r.prediction === 1 ? 'FAILURE' : 'NORMAL',
        r.probability?.toFixed(1) || '—'
      ])
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(predData);
    XLSX.utils.book_append_sheet(wb, ws3, 'All Predictions');
  }

  const filename = `TelecomIQ_Network_${dateStr.replace(/\//g, '-')}.xlsx`;
  XLSX.writeFile(wb, filename);
  console.log(`✅ Network Excel exported: ${filename}`);
};

/* ── Customer Module Excel Export ── */
window.exportCustomerExcel = function() {
  const custML = window.mlResults && window.mlResults.customer;
  const dateStr = new Date().toLocaleDateString('en-IN');

  if (!custML) {
    alert('⚠️ No customer ML results available. Please run the customer behaviour analysis first.');
    return;
  }

  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary
  const summaryData = [
    ['TelecomIQ Customer Behaviour Analysis Report'],
    [`Generated: ${dateStr}`],
    [],
    ['Customer Metrics', ''],
    ['Total Customers', custML.totalCustomers],
    ['High Churn Risk', custML.highRisk],
    ['Churn Rate', `${custML.churnRate.toFixed(1)}%`],
    ['Avg Data Usage', `${custML.avgDataUsage.toFixed(1)} GB`],
    ['Avg Call Duration', `${custML.avgCallDuration.toFixed(0)} min`],
    [],
    ['Model Performance', ''],
    ['Primary Model', custML.primaryModel],
    ['Accuracy', `${custML.primaryMetrics.accuracy}%`],
    ['Precision', custML.primaryMetrics.precision.toFixed(3)],
    ['Recall', custML.primaryMetrics.recall.toFixed(3)],
    ['F1 Score', custML.primaryMetrics.f1.toFixed(3)]
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

  // Sheet 2: Segmentation
  if (custML.segCounts) {
    const segData = [
      ['Segment', 'Count', 'Percentage (%)'],
      ...Object.entries(custML.segCounts).map(([seg, count]) => [
        seg,
        count,
        ((count / custML.totalCustomers) * 100).toFixed(1)
      ])
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(segData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Segments');
  }

  // Sheet 3: High Risk Customers
  if (custML.highRiskCustomers && custML.highRiskCustomers.length > 0) {
    const churnData = [
      ['Customer ID', 'Churn Prob (%)', 'Plan', 'Tenure (mo)', 'Monthly Bill', 'Data Usage (GB)', 'Call Duration (min)'],
      ...custML.highRiskCustomers.map(c => [
        c.customer_id || c.id || 'N/A',
        (c.churnProba * 100).toFixed(1),
        c.plan || 'Standard',
        c.tenure || 0,
        c.monthly_bill || 0,
        c.data_usage_gb?.toFixed(1) || '—',
        c.call_duration_min?.toFixed(0) || '—'
      ])
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(churnData);
    XLSX.utils.book_append_sheet(wb, ws3, 'High Risk');
  }

  const filename = `TelecomIQ_Customer_${dateStr.replace(/\//g, '-')}.xlsx`;
  XLSX.writeFile(wb, filename);
  console.log(`✅ Customer Excel exported: ${filename}`);
};

/* ── Excel Export ── */
window.exportAnalyticsExcel = function() {
  const netML = window.mlResults && window.mlResults.network;
  const custML = window.mlResults && window.mlResults.customer;
  const dateStr = new Date().toLocaleDateString('en-IN');

  const wb = XLSX.utils.book_new();

  // Sheet 1: Executive Summary
  const summaryData = [
    ['TelecomIQ Analytics Report'],
    [`Generated: ${dateStr}`],
    [],
    ['Network Metrics', ''],
    ['Total Nodes', netML ? netML.totalNodes : 20],
    ['Nodes at Failure Risk', netML ? netML.failureCount : 0],
    ['Network Health Score', netML ? `${netML.networkHealth.toFixed(1)}%` : '—'],
    ['Network Model Accuracy', netML ? `${netML.primaryMetrics.accuracy}%` : '—'],
    ['Avg Signal Strength', netML ? `${netML.avgSignal}%` : '—'],
    ['Avg Latency', netML ? `${netML.avgLatency} ms` : '—'],
    ['Avg Packet Loss', netML ? `${netML.avgPacketLoss}%` : '—'],
    [],
    ['Customer Metrics', ''],
    ['Total Customers', custML ? custML.totalCustomers : 0],
    ['High Churn Risk', custML ? custML.highRisk : 0],
    ['Churn Rate', custML ? `${custML.churnRate.toFixed(1)}%` : '—'],
    ['Churn Model Accuracy', custML ? `${custML.primaryMetrics.accuracy}%` : '—'],
    ['Avg Data Usage', custML ? `${custML.avgDataUsage.toFixed(1)} GB` : '—'],
    ['Avg Call Duration', custML ? `${custML.avgCallDuration.toFixed(0)} min` : '—']
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Executive Summary');

  // Sheet 2: Network Failure Alerts
  if (netML && netML.alerts && netML.alerts.length > 0) {
    const alertData = [
      ['Node ID', 'Failure Probability (%)', 'Severity', 'Reason'],
      ...netML.alerts.map(a => [
        a.node,
        a.prob.toFixed(1),
        a.sev.toUpperCase(),
        a.reason
      ])
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(alertData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Network Alerts');
  }

  // Sheet 3: Network Predictions (all nodes)
  if (netML && netML.results && netML.results.length > 0) {
    const predData = [
      ['Node ID', 'Signal (%)', 'Latency (ms)', 'Bandwidth (%)', 'Packet Loss (%)', 'Prediction', 'Failure Probability (%)'],
      ...netML.results.map(r => [
        r.node_id || r.nodeId || 'N/A',
        r.signal_strength?.toFixed(1) || '—',
        r.latency?.toFixed(1) || '—',
        r.bandwidth?.toFixed(1) || '—',
        r.packet_loss?.toFixed(2) || '—',
        r.prediction === 1 ? 'FAILURE' : 'NORMAL',
        r.probability?.toFixed(1) || '—'
      ])
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(predData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Network Predictions');
  }

  // Sheet 4: High Churn Risk Customers
  if (custML && custML.highRiskCustomers && custML.highRiskCustomers.length > 0) {
    const churnData = [
      ['Customer ID', 'Churn Probability (%)', 'Plan', 'Tenure (months)', 'Monthly Bill', 'Data Usage (GB)', 'Call Duration (min)'],
      ...custML.highRiskCustomers.map(c => [
        c.customer_id || c.id || 'N/A',
        (c.churnProba * 100).toFixed(1),
        c.plan || 'Standard',
        c.tenure || 0,
        c.monthly_bill || 0,
        c.data_usage_gb?.toFixed(1) || '—',
        c.call_duration_min?.toFixed(0) || '—'
      ])
    ];
    const ws4 = XLSX.utils.aoa_to_sheet(churnData);
    XLSX.utils.book_append_sheet(wb, ws4, 'High Churn Risk');
  }

  // Sheet 5: Customer Segmentation
  if (custML && custML.segCounts) {
    const segData = [
      ['Segment', 'Count', 'Percentage (%)'],
      ...Object.entries(custML.segCounts).map(([seg, count]) => [
        seg,
        count,
        ((count / custML.totalCustomers) * 100).toFixed(1)
      ])
    ];
    const ws5 = XLSX.utils.aoa_to_sheet(segData);
    XLSX.utils.book_append_sheet(wb, ws5, 'Customer Segments');
  }

  // Sheet 6: Model Performance Metrics
  const metricsData = [
    ['Model Performance Metrics'],
    [],
    ['Network Failure Prediction', ''],
    ['Model', 'Logistic Regression'],
    ['Accuracy', netML ? `${netML.primaryMetrics.accuracy}%` : '—'],
    ['Precision', netML ? netML.primaryMetrics.precision.toFixed(3) : '—'],
    ['Recall', netML ? netML.primaryMetrics.recall.toFixed(3) : '—'],
    ['F1 Score', netML ? netML.primaryMetrics.f1.toFixed(3) : '—'],
    [],
    ['Customer Churn Prediction', ''],
    ['Primary Model', custML ? custML.primaryModel : '—'],
    ['Accuracy', custML ? `${custML.primaryMetrics.accuracy}%` : '—'],
    ['Precision', custML ? custML.primaryMetrics.precision.toFixed(3) : '—'],
    ['Recall', custML ? custML.primaryMetrics.recall.toFixed(3) : '—'],
    ['F1 Score', custML ? custML.primaryMetrics.f1.toFixed(3) : '—']
  ];
  const ws6 = XLSX.utils.aoa_to_sheet(metricsData);
  XLSX.utils.book_append_sheet(wb, ws6, 'Model Metrics');

  // Save
  const filename = `TelecomIQ_Analytics_${dateStr.replace(/\//g, '-')}.xlsx`;
  XLSX.writeFile(wb, filename);
  console.log(`✅ Excel report exported: ${filename}`);
};
