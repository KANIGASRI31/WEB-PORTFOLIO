# 📘 TelecomIQ User Guide

**Quick reference guide for using TelecomIQ Analytics Platform**

---

## 🚀 Getting Started (2 minutes)

### **Step 1: Open the Application**
```bash
# Option A: Double-click index.html in file explorer
# Option B: Right-click index.html → Open With → Your Browser
# Option C: Use VS Code Live Server extension
```

### **Step 2: Load Sample Data**
1. Click **"Data Preprocessing"** in the sidebar
2. Click **"⚡ Load Sample Network Data"**
3. Click **"⚡ Load Sample Customer Data"**
4. Wait 2-3 seconds for processing

### **Step 3: View Predictions**
1. Click **"Dashboard"** to see the overview
2. Click **"Failure Prediction"** to see network ML results
3. Click **"Customer Behaviour"** to see churn predictions
4. Click **"Integrated Analytics"** for the full report

**✅ Done! You're now viewing live ML predictions.**

---

## 📊 Module Guide

### **1️⃣ Dashboard** 🏠

**What you see:**
- 8 KPI cards (total nodes, failures, customers, churn risk)
- Network health gauge (0-100 score)
- Live node status tiles
- Recent events feed (includes ML alerts)
- 7-day performance trend chart
- Failure probability chart
- Churn rate chart

**What to do:**
- Monitor overall health
- Check for red/orange alerts
- Review recent events
- Click on node tiles for details

---

### **2️⃣ Data Preprocessing** 🔧

#### **Upload Your Own Data**

**Network CSV Requirements:**
```
Column Name       | Type   | Example
------------------|--------|----------
node_id           | Text   | BTS-001
signal_strength   | Number | 68.5
latency           | Number | 32.0
bandwidth         | Number | 71.2
packet_loss       | Number | 2.3
uptime            | Number | 98.7
status            | Text   | normal
```

**Customer CSV Requirements:**
```
Column Name         | Type   | Example
--------------------|--------|----------
customer_id         | Text   | C-1001
plan                | Text   | Premium
tenure              | Number | 24
monthly_bill        | Number | 1299
data_usage_gb       | Number | 45.5
call_duration_min   | Number | 320
churn               | Number | 0 or 1
```

#### **Processing Steps (Automatic)**
1. **Deduplication** - Removes identical rows
2. **Missing Values** - Fills blanks with averages
3. **Outliers** - Detects extreme values using IQR method
4. **Normalization** - Scales numbers to 0-1 range

#### **Download Cleaned Data**
- After processing, click **"💾 Download Cleaned Data"**
- File saves as: `network_cleaned_2024-01-20_14-30-00.csv`

---

### **3️⃣ Network Failure Prediction** 🌐

#### **What the ML Models Do**

**Model 1: Logistic Regression** (Primary)
- Looks at signal, latency, bandwidth, packet loss
- Calculates failure probability for each node
- Output: 0-100% chance of failure

**Model 2: Naïve Bayes** (Backup)
- Uses probability distributions
- Good for comparison

#### **Understanding the Results**

**Failure Probability:**
- 🔴 **>80%** = CRITICAL - Dispatch technician NOW
- 🟠 **50-80%** = HIGH - Schedule maintenance this week
- 🔵 **20-50%** = MEDIUM - Monitor closely
- 🟢 **<20%** = LOW - Normal operation

**Example Alert:**
```
Node BTS-007 has 87% failure probability
Reason: Low signal (42%) + High latency (65ms) + High packet loss (6.2%)
Action: Immediate field inspection required
```

#### **What You Can Do**
1. **View Alerts** - See nodes that need attention
2. **Check Predictions Table** - All nodes with probabilities
3. **Export Report** - Click **"📄 Export Network Report (PDF)"**
4. **Export Data** - Click **"📊 Export Network Data (Excel)"**

---

### **4️⃣ Customer Behaviour** 👥

#### **What the ML Models Do**

**Segmentation (K-Means):**
- Groups customers into 3 categories:
  - 🟣 **Premium** - High bills, loyal, heavy users
  - 🔵 **Standard** - Average usage, stable
  - 🔴 **At-Risk** - Low usage, new customers, likely to leave

**Churn Prediction (3 Models):**
- **Random Forest** ⭐ (Primary) - Most accurate (15 decision trees)
- **Logistic Regression** (Backup)
- **Naïve Bayes** (Backup)
- Output: 0-100% chance customer will cancel service

#### **Understanding the Results**

**Churn Probability:**
- 🔴 **>65%** = HIGH RISK - Call immediately, offer discount
- 🟠 **40-65%** = MEDIUM RISK - Send retention email
- 🟢 **<40%** = LOW RISK - Continue normal engagement

**Example Alert:**
```
Customer C-1234 has 92% churn probability
Segment: At-Risk
Tenure: 3 months
Monthly Bill: ₹599
Action: Contact with upgrade offer + 20% discount
```

#### **What You Can Do**
1. **View Segments Pie Chart** - See customer distribution
2. **Check High Risk Table** - Customers likely to leave
3. **Compare Models** - See which AI is most accurate (3 model cards)
4. **Export Report** - Click **"📄 Export Customer Report (PDF)"**
5. **Export Data** - Click **"📊 Export Customer Data (Excel)"**

---

### **5️⃣ Integrated Analytics** 📈

#### **What You See**
- All KPIs from both network and customer modules
- Model accuracy comparison chart
- **🏆 Model Leaderboard** - Rankings of all 6 AI models
- Smart recommendations based on your data
- RAG status table (traffic light indicators)

#### **Model Leaderboard**
Shows all trained models ranked by accuracy:
```
🥇 #1: Random Forest Churn Prediction - 94.2%
🥈 #2: Logistic Regression Network Failure - 93.8%
🥉 #3: Logistic Regression Churn - 91.7%
#4: Naïve Bayes Network Failure - 89.5%
#5: Naïve Bayes Churn - 87.3%
#6: K-Means Customer Segmentation - N/A (clustering)
```

#### **Export Full Reports**
1. **PDF Report** - Click **"📄 Export PDF Report"**
   - 6-10 pages with tables, charts, recommendations
   - Professional format for managers/stakeholders
   - Opens in new tab, then save

2. **Excel Report** - Click **"📊 Export Excel Report"**
   - 6 spreadsheet tabs:
     - Executive Summary
     - Network Alerts
     - Network Predictions (all nodes)
     - High Churn Risk Customers
     - Customer Segments
     - Model Performance Metrics
   - Sortable, filterable data
   - Copy-paste friendly

---

## 📅 Date Range Filtering

### **How to Use**
1. Look at the **top bar** (next to the clock)
2. Click **first date box** → Select start date
3. Click **second date box** → Select end date
4. Click **"Apply"** button
5. All data filters to that date range
6. ML models re-run automatically
7. Click **"Reset"** to see all data again

### **When to Use**
- Compare summer vs winter performance
- Analyze Q1 vs Q4 churn rates
- Focus on recent data only
- Exclude outlier months

### **Note**
If your CSV doesn't have dates, the system generates synthetic timestamps for demo purposes.

---

## 💾 Exporting Data

### **Available Exports**

| Module | PDF Report | Excel Data |
|--------|-----------|-----------|
| Network Failure Prediction | ✅ | ✅ |
| Customer Behaviour | ✅ | ✅ |
| Integrated Analytics | ✅ | ✅ |
| Data Preprocessing | ❌ | ✅ (CSV) |

### **PDF vs Excel - When to Use What**

**Use PDF When:**
- Presenting to management
- Sharing with non-technical stakeholders
- Need printed reports
- Want summary + recommendations

**Use Excel When:**
- Need to do further analysis
- Want to sort/filter data
- Creating pivot tables
- Importing to other tools

---

## 🎨 UI Tips

### **Navigation**
- Click sidebar items to switch pages
- Sidebar shows **Live** indicator (top right)
- Clock shows current time
- Badges show alert counts

### **Colors Mean Things**
- 🔴 **Red** = Danger, critical, failure
- 🟠 **Orange** = Warning, attention needed
- 🔵 **Blue** = Info, normal
- 🟢 **Green** = Success, healthy, good

### **Mobile View**
- Works on phones/tablets
- Sidebar collapses automatically
- Tables scroll horizontally
- Date filter hides on small screens

---

## ⚡ Pro Tips

### **Speed Up Processing**
- Use date filters for large datasets (>50K records)
- Load sample data first to test workflows
- Export reports after hours (non-blocking but still takes 1-3 seconds)

### **Accuracy Tips**
- Upload clean CSVs (correct column names)
- Ensure data types are correct (numbers as numbers, not text)
- Include dates if you want time-based filtering
- More data = better predictions (aim for >1000 rows)

### **Troubleshooting**
| Problem | Solution |
|---------|----------|
| "No ML results available" | Run the ML model first by loading data |
| Charts not showing | Refresh page, check browser console |
| Date filter not working | Ensure CSV has date/timestamp column |
| Export button doesn't work | Check popup blocker settings |

---

## 🎯 Common Workflows

### **Daily Network Monitoring**
1. Open Dashboard
2. Check KPI cards for failures
3. Review "Recent Network Events" feed
4. If red alerts → Go to "Failure Prediction" page
5. Export PDF report for field team

### **Monthly Churn Review**
1. Load customer data
2. Go to "Customer Behaviour" page
3. Check churn rate KPI
4. Review "High Churn Risk" table
5. Export Excel for CRM import
6. Execute retention campaigns

### **Quarterly Executive Report**
1. Go to "Integrated Analytics"
2. Review all KPIs
3. Check recommendations section
4. Export full PDF report
5. Present to stakeholders

---

## ❓ FAQ

**Q: Can I use real data?**
A: Yes! Just upload your CSV files with the correct column names.

**Q: Is my data stored anywhere?**
A: No. Everything runs in your browser. No data is sent to any server.

**Q: How accurate are the predictions?**
A: On sample data: 92-97%. Real-world accuracy depends on data quality.

**Q: Can I change the ML models?**
A: Yes, but it requires code changes in `js/ml.js`. See README.md for details.

**Q: Why is Random Forest the primary churn model?**
A: It consistently achieves 2-4% higher accuracy than Logistic Regression on this data.

**Q: What's the difference between Logistic Regression and Naïve Bayes?**
A: LR uses gradient descent optimization. NB uses probability distributions. LR typically performs better on this data.

**Q: How does K-Means decide segments?**
A: It groups customers by similarity across tenure, bill, data usage, and call duration.

**Q: Can I add more segments?**
A: Yes, change `const kmeans = new KMeans(3, 100);` to `(4, 100)` in ml.js for 4 segments.

---

## 📞 Need Help?

- **Documentation**: See README.md for technical details
- **Changelog**: See CHANGELOG.md for version history
- **GitHub Issues**: Report bugs or request features
- **Email**: support@telecomiq.example.com

---

**Happy Analyzing! 📊✨**

*Last updated: January 2024 | Version 2.0.0*
