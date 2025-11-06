#  Intrusion Detection Dashboard

**A comprehensive cybersecurity blue team tool for network traffic analysis and threat detection**

*Created by **Omer Surucu** | More projects at [shieldpy.com](https://shieldpy.com)*

![Dashboard Preview](https://img.shields.io/badge/Status-Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.7+-blue)
![React](https://img.shields.io/badge/React-18.2+-blue)
![License](https://img.shields.io/badge/License-MIT%20with%20Attribution-green)

##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Detection Rules](#detection-rules)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Future Improvements](#future-improvements)
- [Author](#author)
- [License](#license)

##  Overview

The **Intrusion Detection Dashboard** is a web-based cybersecurity tool designed for blue team operations. It provides real-time network traffic analysis, automated threat detection, and comprehensive security monitoring through an intuitive dashboard interface.

This project demonstrates practical cybersecurity skills including:
- Network log analysis and parsing
- Rule-based threat detection algorithms
- Security incident visualization
- RESTful API development
- Modern web application architecture

**Target Audience**: Entry-level cybersecurity professionals, SOC analysts, security students, and blue team practitioners.

##  Features

###  **Advanced Threat Detection**
- **Suspicious Port Analysis**: Detects connections to non-standard ports (outside 22, 80, 443)
- **High-Frequency Connection Detection**: Flags IPs with >10 connections per minute
- **Protocol Anomaly Detection**: Identifies unusual or potentially malicious protocols
- **Large Packet Analysis**: Detects oversized packets that may indicate data exfiltration

###  **Real-Time Dashboard**
- Interactive security alerts table with severity classification
- Dynamic Chart.js visualizations showing alert trends over time
- Color-coded threat levels (Critical, High, Medium, Low)
- Real-time system health monitoring and status indicators

###  **Robust Architecture**
- **Backend**: Python Flask with SQLite database for persistent alert storage
- **Frontend**: React.js with responsive Tailwind CSS styling
- **API**: RESTful endpoints for alert management and file processing
- **File Processing**: CSV upload functionality for network log analysis

##  Quick Start

### Prerequisites
- Python 3.7+ installed
- Node.js 14+ installed
- Git installed

### Installation

1. **Clone the repository**
`bash
git clone https://github.com/Qixpy/intrusion-detection-dashboard.git
cd intrusion-detection-dashboard
`

2. **Run the setup script**

**Windows:**
`powershell
.\scripts\setup.ps1
`

**Linux/Mac:**
`ash
./scripts/setup.sh
`

3. **Start the application**

**Backend (Terminal 1):**
`ash
cd backend
python app.py
`

**Frontend (Terminal 2):**
`ash
cd frontend
npm start
`

4. **Access the dashboard**
- Open your browser and navigate to: http://localhost:3000
- The backend API runs on: http://localhost:5000

##  Usage Guide

### 1. **Upload Network Logs**
- Click the "Upload CSV" button on the dashboard
- Select a network log file in CSV format
- Supported columns: timestamp, source_ip, dest_ip, source_port, dest_port, protocol, packet_size

### 2. **Monitor Alerts**
- View real-time alerts in the main dashboard table
- Alerts are color-coded by severity level
- Click on alerts for detailed information

### 3. **Analyze Trends**
- Use the interactive charts to identify patterns
- Filter alerts by time range and severity
- Export data for further analysis

##  API Documentation

### Core Endpoints

- GET /api/alerts - Retrieve all alerts
- POST /api/upload - Upload and analyze CSV files
- GET /api/health - Check system health
- DELETE /api/alerts/{id} - Delete specific alert

### Example Usage

`ash
# Get all alerts
curl http://localhost:5000/api/alerts

# Check system health
curl http://localhost:5000/api/health
`

##  Detection Rules

The system implements four main detection categories:

1. **Suspicious Ports**: Flags connections to non-standard ports
2. **High Frequency**: Detects > 10 connections per minute from single IP
3. **Protocol Anomalies**: Identifies unusual protocols
4. **Large Packets**: Flags packets > 1500 bytes (potential data exfiltration)

##  Architecture

`
        
   React.js             Flask API            SQLite DB     
   Frontend         Backend          Data Store    
   (Port 3000)          (Port 5000)          alerts.db     
        
`

##  Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

##  Future Improvements

### **Short-term Goals**
- [ ] **Real-time Monitoring**: Live network traffic integration
- [ ] **Email Alerts**: Notification system for critical threats
- [ ] **Advanced Visualizations**: Network topology maps and geographic IP plotting
- [ ] **Custom Rule Engine**: User-defined detection rules and thresholds

### **Long-term Vision**
- [ ] **Distributed Analysis**: Support for multiple log sources and collectors
- [ ] **SIEM Integration**: Connector for popular SIEM platforms
- [ ] **Threat Intelligence**: External threat feed integration
- [ ] **Mobile Application**: Native mobile app for on-the-go monitoring

##  License

This project is licensed under the MIT License with Attribution Requirement - see the [LICENSE](LICENSE) file for details.

**Attribution Required**: When using this software, you must credit the original author "Omer Surucu" and reference "shieldpy.com" in your documentation, credits, or about sections.

##  Author

**Omer Surucu**
-  Website: [shieldpy.com](https://shieldpy.com)
-  Specialization: Cybersecurity & Full-Stack Development
-  For more projects and cybersecurity tools, visit shieldpy.com

##  Acknowledgments

- **OWASP**: For cybersecurity best practices and guidelines
- **Chart.js Community**: For excellent data visualization tools
- **Tailwind CSS Team**: For the utility-first CSS framework
- **Flask Community**: For the lightweight and flexible web framework

##  Support

If you encounter any issues or have questions:

1. **Check the Issues**: Browse existing GitHub issues for solutions
2. **Create an Issue**: Report bugs or request features
3. **Documentation**: Review this README and inline code comments
4. **Visit shieldpy.com**: For more cybersecurity projects and resources

---

**Created by Omer Surucu | Visit [shieldpy.com](https://shieldpy.com) for more cybersecurity projects**

 Star this repository if you find it helpful!
