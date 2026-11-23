# 📡 TelecomIQ — Intelligent Telecommunication Network Analytics Platform

**Advanced ML-powered analytics platform for network failure prediction, customer churn analysis, and data-driven decision support.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-green.svg)](.)
[![Status](https://img.shields.io/badge/status-production-success.svg)](.)

---

## 🎯 Overview

TelecomIQ is a comprehensive web-based analytics solution designed for telecommunication network operators. It combines real-time data processing, machine learning predictions, and interactive visualizations to help network engineers and business analysts make informed decisions.

### **Key Capabilities**
- 🔧 **Automated Data Preprocessing** — Clean, normalize, and prepare datasets for ML
- 🌐 **Network Failure Prediction** — Logistic Regression & Naïve Bayes models
- 👥 **Customer Churn Analysis** — Random Forest, LR, NB + K-Means segmentation
- 📊 **Integrated Analytics Dashboard** — Unified view with PDF/Excel export
- 📅 **Date Range Filtering** — Time-series analysis and comparisons
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile

---

## 🏗️ Architecture

### **Technology Stack**
| Layer | Technology |
|-------|-----------|
| **Frontend** | Pure HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Charts** | Chart.js 4.4.3 |
| **ML Engine** | Custom in-browser implementations (no external ML libs) |
| **Reports** | jsPDF 2.5.1, jsPDF-autotable 3.5.31, XLSX 0.18.5 |
| **Styling** | CSS Grid, Flexbox, Custom Properties (CSS Variables) |
| **Deployment** | Static hosting (no backend required) |

### **File Structure**
```
telecom-analytics/
├── index.html              # Main HTML (single-page app)
├── README.md               # Documentation (this file)
├── css/
│   └── main.css            # All styles with responsive breakpoints
├── js/
│   ├── data.js             # Static sample data & constants
│   ├── preprocess.js       # Data cleaning & CSV handling
│   ├── ml.js               # ML models (LR, NB, RF, K-Means)
│   ├── charts.js           # Chart.js configurations
│   ├── app.js              # App logic, navigation, date filtering
│   └── reports.js          # PDF & Excel export functions
└── .gitignore              # Git ignore patterns
```

---

## 🚀 Quick Start

### **Installation**
```bash
# Clone the repository
git clone https://github.com/yourusername/telecom-analytics.git
cd telecom-analytics

# Option 1: Open directly in browser
open index.html

# Option 2: Use a local server
python -m http.server 8000
# Navigate to http://localhost:8000

# Option 3: Use Live Server (VS Code extension)
# Right-click index.html → "Open with Live Server"
```

### **No Build Step Required**
This is a pure client-side application with zero dependencies to install. Just open `index.html` in any modern browser.

---

## 📖 Usage Guide

### **Module 1: Data Preprocessing**

1. **Upload CSV Files**
   - Click "Data Preprocessing" in sidebar
   - Upload network.csv (columns: `node_id`, `signal_strength`, `latency`, `bandwidth`, `packet_loss`, `uptime`, `status`)
   - Upload customer.csv (columns: `customer_id`, `plan`, `tenure`, `monthly_bill`, `data_usage_gb`, `call_duration_min`, `churn`)
   - Or click "Load Sample Data" to use built-in datasets

2. **Automated Processing**
   - **Deduplication**: Removes exact duplicate rows
   - **Missing Value Imputation**: Mean for numeric, mode for categorical
   - **Outlier Detection**: IQR method (Q1 - 1.5×IQR, Q3 + 1.5×IQR)
   - **Normalization**: Min-Max scaling to [0, 1]

3. **Download Cleaned Data**
   - Click "💾 Download Cleaned Data" button
   - CSV exports with timestamp (e.g., `network_cleaned_2024-01-15_10-30-45.csv`)

### **Module 2: Network Failure Prediction**

**Models Trained:**
- **Logistic Regression** (Primary) — Gradient descent with sigmoid activation
- **Naïve Bayes** (Backup) — Gaussian distribution assumptions

**Workflow:**
1. Navigate to "Failure Prediction" page
2. System automatically uses processed network data
3. View:
   - Failure probability per node
   - Critical alerts (>80% probability)
   - Model accuracy, precision, recall, F1
   - Confusion matrix
4. Export:
   - Click "📄 Export Network Report (PDF)" for stakeholders
   - Click "📊 Export Network Data (Excel)" for detailed analysis

### **Module 3: Customer Behaviour Mining**

**Models Trained:**
- **Random Forest** ⭐ (Primary Churn) — 15 trees, max depth 8
- **Logistic Regression** (Backup)
- **Naïve Bayes** (Backup)
- **K-Means Clustering** — 3 segments (Premium, Standard, At-Risk)

**Workflow:**
1. Navigate to "Customer Behaviour" page
2. View:
   - Customer segments with pie chart
   - High churn risk customers (>65% probability)
   - Model comparison cards (RF vs LR vs NB)
   - Segment-wise breakdown
3. Export:
   - Click "📄 Export Customer Report (PDF)"
   - Click "📊 Export Customer Data (Excel)"

### **Module 4: Integrated Analytics**

**Features:**
- **Executive Dashboard**: All KPIs in one view
- **Model Leaderboard**: Ranks all 6 models by accuracy
- **Smart Recommendations**: Auto-generated based on ML outputs
- **RAG Status Table**: Traffic-light indicators for KPIs
- **Multi-model Comparison**: Side-by-side accuracy charts

**Date Range Filtering:**
1. Click date pickers in top bar
2. Select start and end dates
3. Click "Apply"
4. All modules re-run with filtered data
5. Click "Reset" to restore full dataset

---

## 🤖 Machine Learning Models

### **1. Logistic Regression**
```
Algorithm: Batch Gradient Descent
Loss: Binary Cross-Entropy
Learning Rate: 0.15
Epochs: 800
Activation: Sigmoid
```

### **2. Naïve Bayes**
```
Type: Gaussian Naïve Bayes
Assumptions: Features are independent
Prior: Uniform (equal class probabilities)
```

### **3. Random Forest** ⭐
```
Trees: 15
Max Depth: 8
Min Split: 4 samples
Splitting: Gini Impurity
Bootstrap: 80% of data per tree
Feature Subset: √n features per split
```

### **4. K-Means Clustering**
```
Clusters: 3 (Premium, Standard, At-Risk)
Initialization: K-Means++
Iterations: 100 max
Convergence: Centroid movement < 0.01
```

---

## 📊 Export Formats

### **PDF Reports**
- **Analytics Report**: Full executive summary (6-10 pages)
- **Network Report**: Failure predictions + alerts (3-5 pages)
- **Customer Report**: Churn analysis + segments (3-5 pages)

**PDF Contains:**
- Professional header with branding
- Summary tables with metrics
- Alert/risk tables
- Recommendations section
- Page numbers + footer

### **Excel Reports**
- **Analytics Workbook**: 6 sheets (Summary, Network Alerts, Predictions, High Risk, Segments, Metrics)
- **Network Workbook**: 3 sheets (Summary, Alerts, All Predictions)
- **Customer Workbook**: 3 sheets (Summary, Segments, High Risk)

**Excel Features:**
- Multi-sheet organization
- Formatted headers
- Sortable/filterable data
- Copy-paste friendly

---

## 🎨 UI Features

### **Design System**
- **Color Palette**: Dark navy (#04070f) base with blue (#3b82f6) accents
- **Typography**: Inter (UI), JetBrains Mono (code/data)
- **Icons**: Emoji-based for universality
- **Charts**: Chart.js with custom dark theme

### **Responsive Breakpoints**
- **1024px**: 4-column stat grid, stacked 3-column layouts
- **768px**: Sidebar collapses, 2-column grids
- **480px**: Single-column mobile view, hidden date filter

### **Accessibility**
- Semantic HTML5 structure
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast colors (WCAG AA compliant)

---

## ⚙️ Configuration

### **ML Model Parameters** (in `ml.js`)
```javascript
// Logistic Regression
const lr = new LogisticRegression(0.15, 800); // lr, epochs

// Random Forest
const rf = new RandomForest(15, 8, 4); // trees, depth, minSplit

// K-Means
const kmeans = new KMeans(3, 100); // clusters, maxIter
```

### **Thresholds** (in `data.js`)
```javascript
const THRESHOLDS = {
  signal: { critical: 45, warning: 70 },
  latency: { critical: 60, warning: 25 },
  packetLoss: { critical: 5, warning: 1 },
  churnProb: { high: 0.65, medium: 0.4 }
};
```

---

## 🧪 Testing

### **Browser Compatibility**
| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |

### **Sample Data**
Built-in sample datasets:
- **Network**: 4,800 records (20 nodes × 240 timestamps)
- **Customer**: 48,320 records (CRM data)

### **Manual Testing Checklist**
```
[ ] Upload CSV → Preprocessing shows stats
[ ] Click "Load Sample Data" → Tables populate
[ ] Download cleaned CSV → File downloads
[ ] Network ML → Model cards show accuracy
[ ] Customer ML → Segments + churn predictions
[ ] Date filter → Apply → Data refreshes
[ ] Export PDF → Opens in new tab
[ ] Export Excel → Downloads .xlsx file
[ ] Mobile view → Responsive layout works
```

---

## 🐛 Troubleshooting

### **Issue: "No ML results available" when exporting**
**Solution**: Run the ML models first by uploading/loading data on the respective pages.

### **Issue: Charts not rendering**
**Solution**: Ensure Chart.js CDN is loaded. Check browser console for errors.

### **Issue: Date filter not working**
**Solution**: Upload data with a `timestamp`, `date`, or `created_at` column. Or use sample data.

### **Issue: Mobile layout broken**
**Solution**: Clear browser cache. Ensure `viewport` meta tag is present.

---

## 📈 Performance

| Metric | Value |
|--------|-------|
| **Load Time** | <2s (on 3G) |
| **ML Training** | 0.5-2s (depends on dataset size) |
| **Memory Usage** | ~50-80MB (with 50K records) |
| **Chart Render** | <100ms per chart |
| **PDF Generation** | 1-3s (3-10 pages) |

**Optimization Tips:**
- Use date filtering for large datasets (>100K records)
- Train models on a subset for faster prototyping
- Export reports after hours to avoid UI blocking

---

## 🛠️ Customization

### **Add a New Model**
1. Implement model class in `ml.js`:
```javascript
class MyNewModel {
  train(X, y) { /* training logic */ }
  predict(X) { /* prediction logic */ }
}
```

2. Integrate in `runCustomerML()` or `runNetworkML()`:
```javascript
const myModel = new MyNewModel();
myModel.train(Xtrain, ytrain);
const myMetrics = computeMetrics(ytest, myModel.predict(Xtest));
```

3. Add to model leaderboard in `app.js`:
```javascript
models.push({
  name: 'My New Model',
  accuracy: myMetrics.accuracy,
  ...
});
```

### **Change Theme Colors**
Edit CSS variables in `main.css`:
```css
:root {
  --bg-base: #04070f;    /* Background */
  --accent: #3b82f6;     /* Primary blue */
  --green: #10b981;      /* Success */
  --red: #ef4444;        /* Danger */
}
```

---

## 📚 Resources

### **Documentation**
- [Chart.js Docs](https://www.chartjs.org/docs/latest/)
- [jsPDF API](https://github.com/parallax/jsPDF)
- [SheetJS (XLSX)](https://docs.sheetjs.com/)

### **Research Papers**
- Logistic Regression: Hosmer & Lemeshow (2000)
- Random Forest: Breiman (2001)
- K-Means: MacQueen (1967)

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Coding Standards:**
- ES6+ JavaScript (no jQuery)
- Pure CSS (no preprocessors)
- Semantic HTML5
- Comments for complex algorithms

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Credits

**Developed by:**
- CSA 1614 — Data Warehousing & Data Mining
- SIMATS Engineering

**Technologies:**
- Chart.js by Chart.js Contributors
- jsPDF by James Hall
- SheetJS by SheetJS LLC

---

## 📧 Contact

For questions, issues, or feature requests:
- **GitHub Issues**: [Open an issue](https://github.com/yourusername/telecom-analytics/issues)
- **Email**: support@telecomiq.example.com
- **Documentation**: [Wiki](https://github.com/yourusername/telecom-analytics/wiki)

---

## 🎯 Roadmap

### **Version 2.1** (Q2 2024)
- [ ] Real-time WebSocket integration
- [ ] Advanced feature engineering (PCA, LDA)
- [ ] Neural network models (in-browser TensorFlow.js)
- [ ] Multi-language support (i18n)

### **Version 3.0** (Q3 2024)
- [ ] Backend API (Node.js + MongoDB)
- [ ] User authentication & multi-tenancy
- [ ] Scheduled report emails
- [ ] Model versioning & A/B testing

---

**⭐ Star this repo if TelecomIQ helps your network operations!**

*Last updated: January 2024*
