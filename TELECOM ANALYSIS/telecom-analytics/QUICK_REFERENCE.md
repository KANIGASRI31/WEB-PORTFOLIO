# 📋 TelecomIQ - Quick Reference Card

**One-page cheat sheet for TelecomIQ v2.0.0**

---

## 🚀 Quick Start

```bash
1. Open index.html in browser
2. Click "Data Preprocessing"
3. Click "Load Sample Network Data" + "Load Sample Customer Data"
4. Explore all 5 pages via sidebar
```

---

## 📊 Pages Overview

| Page | Icon | Purpose | Key Features |
|------|------|---------|--------------|
| **Dashboard** | 🏠 | Overview | 8 KPIs, gauge, tiles, alerts |
| **Preprocessing** | 🔧 | Data cleaning | Upload, clean, outliers, CSV download |
| **Network** | 🌐 | Failure prediction | LR+NB models, alerts, PDF/Excel export |
| **Customer** | 👥 | Churn analysis | RF+LR+NB models, K-Means, PDF/Excel export |
| **Analytics** | 📈 | Full report | Leaderboard, recommendations, PDF/Excel |

---

## 🎯 Key Features

### **Data Management**
- **Upload CSV**: Click upload zones, select file
- **Load Sample**: Click "⚡ Load Sample Data" buttons
- **Download Clean**: Click "💾 Download Cleaned Data" (after processing)
- **Date Filter**: Topbar → Select dates → "Apply" → "Reset"

### **ML Models**
| Model | Accuracy | Use Case |
|-------|----------|----------|
| **Random Forest** 🥇 | ~94% | Churn prediction (primary) |
| **Logistic Regression** | ~93% | Network failure (primary) |
| **Naïve Bayes** | ~89% | Backup for both |
| **K-Means** | N/A | Customer segmentation (3 clusters) |

### **Exports**
| Type | Button Text | Output |
|------|-------------|--------|
| **CSV** | 💾 Download Cleaned Data | `network_cleaned_2024-01-20_14-30-00.csv` |
| **PDF** | 📄 Export [Module] Report | Multi-page PDF (3-10 pages) |
| **Excel** | 📊 Export [Module] Data | Multi-sheet .xlsx workbook |

---

## 🔢 Understanding Metrics

### **Network Failure Probability**
- 🔴 **>80%** = CRITICAL → Dispatch NOW
- 🟠 **50-80%** = HIGH → Schedule this week
- 🔵 **20-50%** = MEDIUM → Monitor
- 🟢 **<20%** = LOW → Normal

### **Churn Probability**
- 🔴 **>65%** = HIGH RISK → Call + offer discount
- 🟠 **40-65%** = MEDIUM → Send retention email
- 🟢 **<40%** = LOW → Normal engagement

### **Customer Segments**
- 🟣 **Premium** → High bills, loyal, heavy users
- 🔵 **Standard** → Average usage, stable
- 🔴 **At-Risk** → Low usage, new, likely to churn

---

## ⌨️ Keyboard Shortcuts

```
F12          → Open DevTools (check console errors)
Ctrl + R     → Refresh page
Ctrl + Shift + M → Toggle device toolbar (test mobile)
Ctrl + P     → Print (for PDF reports)
Ctrl + S     → Save (exports)
```

---

## 🎨 Color Code

| Color | Meaning | Use Case |
|-------|---------|----------|
| 🔴 Red | Critical/Danger | Failures, high churn, errors |
| 🟠 Orange | Warning | Needs attention soon |
| 🔵 Blue | Info/Normal | Standard metrics |
| 🟢 Green | Success/Good | Healthy, on target |
| 🟣 Purple | Premium | High-value customers |
| 🔵 Cyan | Feature | New/enhanced features |

---

## 📂 CSV Column Names

### **Network CSV**
```
node_id, signal_strength, latency, bandwidth, 
packet_loss, uptime, status
```

### **Customer CSV**
```
customer_id, plan, tenure, monthly_bill, 
data_usage_gb, call_duration_min, churn
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| "No ML results" | Load data first, then navigate to page |
| Charts not showing | Refresh page, check console (F12) |
| Export doesn't work | Allow popups, check console |
| Date filter fails | Ensure CSV has date/timestamp column |
| Mobile looks broken | Clear cache, check viewport meta tag |

---

## 📈 Model Leaderboard (Typical)

```
🥇 Random Forest Churn      → 94.2%
🥈 Logistic Regression Net  → 93.8%
🥉 Logistic Regression Churn → 91.7%
#4 Naïve Bayes Network      → 89.5%
#5 Naïve Bayes Churn        → 87.3%
#6 K-Means Segmentation     → N/A (clustering)
```

---

## 🔄 Common Workflows

### **Daily Network Monitoring**
```
1. Dashboard → Check KPI cards
2. Review "Recent Events" feed
3. If red alerts → "Failure Prediction" page
4. Export PDF → Send to field team
```

### **Monthly Churn Review**
```
1. "Customer Behaviour" → Check churn rate
2. Review "High Risk" table
3. Export Excel → Import to CRM
4. Execute retention campaigns
```

### **Quarterly Executive Report**
```
1. "Integrated Analytics" page
2. Review recommendations
3. Export full PDF report
4. Present to stakeholders
```

---

## 📊 Export Sheets

### **Analytics Excel (6 sheets)**
```
1. Executive Summary
2. Network Alerts
3. Network Predictions
4. High Churn Risk
5. Customer Segments
6. Model Metrics
```

### **Network Excel (3 sheets)**
```
1. Summary
2. Failure Alerts
3. All Predictions
```

### **Customer Excel (3 sheets)**
```
1. Summary
2. Customer Segments
3. High Risk Customers
```

---

## 🎯 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Network Uptime | ≥99% | Monitor |
| Signal Strength | ≥75% | Monitor |
| Latency | ≤30ms | Monitor |
| Packet Loss | ≤1% | Monitor |
| Churn Rate | ≤3% | Monitor |
| ML Accuracy | ≥80% | 92-97% ✅ |
| Data Quality | ≥95% | 97.4% ✅ |

---

## 📱 Responsive Breakpoints

```
Desktop  : >1024px → Full layout
Tablet   : 768-1024px → 4-col stats, sidebar
Mobile   : 480-768px → 2-col stats, no sidebar
Small    : <480px → 1-col, compact
```

---

## ⚡ Pro Tips

1. **Speed**: Use date filters for large datasets (>50K)
2. **Accuracy**: Aim for >1000 rows minimum
3. **Reports**: Export PDFs for managers, Excel for analysts
4. **Mobile**: Date filter auto-hides on small screens
5. **Testing**: Use sample data to learn features first
6. **Custom**: Edit `js/ml.js` to tune model hyperparameters

---

## 🔗 Quick Links

| Resource | Location |
|----------|----------|
| Full Documentation | README.md |
| User Guide | USER_GUIDE.md |
| Version History | CHANGELOG.md |
| Features List | FEATURES.md |
| Deployment Guide | DEPLOYMENT.md |
| License | LICENSE |

---

## 📞 Support

**Console Errors?** → F12 → Check "Console" tab  
**GitHub Issues** → Report bugs/requests  
**Documentation** → README.md has all details  

---

## ✅ Pre-Flight Checklist

Before demo/presentation:
```
✅ Open index.html
✅ Load sample data
✅ Test all 5 pages
✅ Try one export (PDF or Excel)
✅ Test date filter
✅ Check on mobile (DevTools)
✅ Close other tabs (performance)
```

---

## 🎓 Academic Info

**Course**: CSA 1614 - Data Warehousing & Data Mining  
**Institution**: SIMATS Engineering  
**Version**: 2.0.0  
**Status**: Production Ready  

---

## 🌟 Highlights

- ✅ 6 ML models (RF, LR, NB, K-Means)
- ✅ 15+ interactive charts
- ✅ 3 export types (CSV, PDF, Excel)
- ✅ Date range filtering
- ✅ Responsive design (3 breakpoints)
- ✅ Zero dependencies (just open HTML)
- ✅ 1000+ lines documentation

---

**Print this page for quick reference during demos!**

*Version 2.0.0 | January 2024*
