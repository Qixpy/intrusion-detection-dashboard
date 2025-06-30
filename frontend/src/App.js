import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlertTable from './components/AlertTable';
import AlertChart from './components/AlertChart';
import FileUpload from './components/FileUpload';

// Configure axios base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_BASE_URL;

function App() {
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [isOnline, setIsOnline] = useState(false);

  // Check API health and connectivity
  const checkApiHealth = async () => {
    try {
      const response = await axios.get('/api/health');
      setIsOnline(true);
      return response.data;
    } catch (err) {
      setIsOnline(false);
      console.error('API health check failed:', err);
      return null;
    }
  };

  // Fetch all alerts from the API
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/alerts');
      if (response.data.success) {
        setAlerts(response.data.alerts);
      } else {
        setError('Failed to fetch alerts');
      }
    } catch (err) {
      setError('Error connecting to server. Please ensure the backend is running.');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch alert statistics for charts
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/alerts/stats');
      if (response.data.success) {
        setStats(response.data.stats);
        setChartData(response.data.stats.hourly_counts || []);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Handle file upload and analysis
  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Refresh alerts and stats after successful analysis
        await fetchAlerts();
        await fetchStats();
        
        // Show success message
        setError(null);
        alert(`Analysis complete! Generated ${response.data.alerts_generated} alerts, stored ${response.data.alerts_stored} in database.`);
      } else {
        setError(response.data.error || 'Failed to analyze file');
      }
    } catch (err) {
      setError('Error uploading file: ' + (err.response?.data?.error || err.message));
      console.error('Error uploading file:', err);
    } finally {
      setLoading(false);
    }
  };

  // Download sample log file
  const downloadSampleLog = async () => {
    try {
      const response = await axios.get('/api/sample-log', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sample_network_logs.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error downloading sample file');
      console.error('Error downloading sample file:', err);
    }
  };

  // Clear all alerts
  const clearAllAlerts = async () => {
    if (window.confirm('Are you sure you want to clear all alerts? This action cannot be undone.')) {
      try {
        setLoading(true);
        const response = await axios.delete('/api/alerts');
        
        if (response.data.success) {
          setAlerts([]);
          setChartData([]);
          setStats({});
          alert('All alerts cleared successfully');
        } else {
          setError('Failed to clear alerts');
        }
      } catch (err) {
        setError('Error clearing alerts');
        console.error('Error clearing alerts:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Initial data fetch and periodic updates
  useEffect(() => {
    const initializeApp = async () => {
      await checkApiHealth();
      await fetchAlerts();
      await fetchStats();
    };

    initializeApp();

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAlerts();
      fetchStats();
      checkApiHealth();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-dark text-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyber-gray to-cyber-light shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="cyber-glow p-2 rounded-lg bg-gradient-to-br from-cyber-blue to-purple-600">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Intrusion Detection Dashboard</h1>
                <p className="text-gray-300 font-mono text-sm">Blue Team Security Operations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* API Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'status-online' : 'status-offline'}`}></div>
                <span className="text-sm font-mono">
                  API {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              {/* Stats Display */}
              <div className="hidden sm:flex items-center space-x-4 text-sm font-mono">
                <div className="text-center">
                  <div className="text-cyber-blue font-bold">{alerts.length}</div>
                  <div className="text-gray-400">Total Alerts</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-bold">{stats.total_recent_alerts || 0}</div>
                  <div className="text-gray-400">Last 24h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-300">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={downloadSampleLog}
            className="btn-cyber flex items-center space-x-2"
            disabled={loading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Sample Log</span>
          </button>
          
          <button
            onClick={() => { fetchAlerts(); fetchStats(); }}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2"
            disabled={loading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
          
          <button
            onClick={clearAllAlerts}
            className="bg-red-700 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2"
            disabled={loading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear All Alerts</span>
          </button>
        </div>

        {/* File Upload Component */}
        <div className="mb-8">
          <FileUpload onFileUpload={handleFileUpload} loading={loading} />
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="mb-6 flex items-center justify-center p-4 bg-cyber-gray rounded-lg">
            <div className="spinner mr-3"></div>
            <span>Processing...</span>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="xl:col-span-1">
            <div className="cyber-card rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Alert Trends (24h)
              </h2>
              <AlertChart data={chartData} />
            </div>
          </div>

          {/* Alerts Table Section */}
          <div className="xl:col-span-2">
            <div className="cyber-card rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Security Alerts
                <span className="ml-2 text-sm bg-red-600 text-white px-2 py-1 rounded-full">
                  {alerts.length}
                </span>
              </h2>
              <AlertTable alerts={alerts} loading={loading} />
            </div>
          </div>
        </div>

        {/* Threat Breakdown */}
        {stats.threat_breakdown && Object.keys(stats.threat_breakdown).length > 0 && (
          <div className="mt-8">
            <div className="cyber-card rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                Threat Type Breakdown (Last 24h)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(stats.threat_breakdown).map(([threatType, count]) => (
                  <div key={threatType} className="bg-cyber-gray p-4 rounded-lg border border-gray-600">
                    <div className="text-2xl font-bold text-cyber-blue">{count}</div>
                    <div className="text-sm text-gray-300">{threatType}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
