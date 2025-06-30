# Intrusion Detection Dashboard - Quick Start Guide

## 🎯 Project Overview

This is a complete cybersecurity blue team project featuring:
- **Backend**: Python Flask API with SQLite database
- **Frontend**: React dashboard with Chart.js visualizations  
- **Detection**: Rule-based threat analysis engine
- **UI**: Cybersecurity-themed dark interface with Tailwind CSS

## ⚡ Quick Setup (Windows)

1. **Install Prerequisites**:
   - Python 3.7+ (download from python.org)
   - Node.js 14+ (download from nodejs.org)

2. **Run Setup Script**:
   ```powershell
   # In PowerShell (as Administrator)
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   .\scripts\setup.ps1
   ```

3. **Start the Application**:
   ```powershell
   # Terminal 1 - Backend
   cd backend
   venv\Scripts\Activate.ps1
   python app.py

   # Terminal 2 - Frontend  
   cd frontend
   npm start
   ```

4. **Access the Dashboard**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔍 Key Features

### Threat Detection Rules
- **Suspicious Ports**: Flags non-standard ports (not 22, 80, 443)
- **High Frequency**: Detects >10 connections per minute from single IP
- **Unusual Protocols**: Identifies non-standard protocols
- **Large Packets**: Flags packets >64KB (potential data exfiltration)

### Dashboard Components  
- **Real-time Alerts Table**: Color-coded by severity
- **Time-series Chart**: 24-hour alert trends
- **File Upload**: Drag-and-drop CSV processing
- **Statistics Panel**: Threat breakdown and metrics

## 📁 Sample Data

The project includes `backend/network_logs.csv` with realistic network traffic data including:
- Normal HTTP/HTTPS/SSH traffic
- Suspicious port connections (4444, 1337, etc.)
- High-frequency attack patterns
- Large packet transmissions
- Various protocols and packet sizes

## 🛠️ Tech Stack

**Backend**:
- Flask (web framework)
- Pandas (data analysis)
- SQLite (database)
- Flask-CORS (API support)

**Frontend**:
- React 18 (UI framework)
- Chart.js (visualizations)
- Tailwind CSS (styling)
- Axios (HTTP client)

## 📚 File Structure

```
intrusion-detection-dashboard/
├── backend/               # Python Flask API
│   ├── app.py            # Main API server
│   ├── analyzer.py       # Threat detection logic
│   ├── database.py       # SQLite operations
│   └── network_logs.csv  # Sample data
├── frontend/             # React dashboard
│   ├── src/
│   │   ├── App.js        # Main component
│   │   └── components/   # UI components
│   └── package.json      # Dependencies
├── scripts/              # Setup automation
└── README.md            # Full documentation
```

## 🎓 Learning Objectives

This project demonstrates:
- Network log analysis and parsing
- Cybersecurity threat detection
- RESTful API development
- Data visualization
- Modern web application architecture
- Database design and operations

## 🔧 Troubleshooting

**Python not found**:
- Install Python 3.7+ from python.org
- Ensure Python is in your PATH

**npm install fails**:
- Install Node.js 14+ from nodejs.org
- Clear npm cache: `npm cache clean --force`

**CORS errors**:
- Ensure backend is running on port 5000
- Frontend proxy is configured in package.json

**Database errors**:
- Delete alerts.db and restart backend
- Check file permissions in backend directory

## 📖 Next Steps

1. **Upload Custom Logs**: Use your own CSV files with the required format
2. **Customize Rules**: Modify detection logic in `analyzer.py`
3. **Extend UI**: Add new visualizations and components
4. **Deploy**: Configure for production deployment

## 🤝 Portfolio Usage

This project is perfect for:
- Cybersecurity portfolio demonstrations
- Blue team skill showcasing
- Technical interviews
- Educational purposes
- Security operations learning

## 📞 Support

- Check README.md for detailed documentation
- Review code comments for implementation details
- Use GitHub issues for bug reports
- Join cybersecurity communities for discussions

---

**Built for the cybersecurity community with ❤️**
