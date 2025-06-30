import React from 'react';

const AlertTable = ({ alerts, loading }) => {
  // Function to get threat type badge styling
  const getThreatBadgeClass = (threatType) => {
    const baseClass = 'px-2 py-1 text-xs font-medium rounded-full ';
    
    switch (threatType) {
      case 'Suspicious Port':
        return baseClass + 'bg-yellow-900 text-yellow-300 border border-yellow-700';
      case 'High Frequency Connection':
        return baseClass + 'bg-red-900 text-red-300 border border-red-700';
      case 'Unusual Protocol':
        return baseClass + 'bg-purple-900 text-purple-300 border border-purple-700';
      case 'Large Packet':
        return baseClass + 'bg-orange-900 text-orange-300 border border-orange-700';
      default:
        return baseClass + 'bg-gray-700 text-gray-300 border border-gray-600';
    }
  };

  // Function to get severity level based on threat type
  const getSeverityClass = (threatType) => {
    switch (threatType) {
      case 'High Frequency Connection':
        return 'severity-critical pulse-red';
      case 'Suspicious Port':
        return 'severity-high';
      case 'Large Packet':
        return 'severity-medium';
      case 'Unusual Protocol':
        return 'severity-low';
      default:
        return 'severity-medium';
    }
  };

  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Function to format IP address with highlighting
  const formatIP = (ip) => {
    // Highlight private IPs vs public IPs
    const isPrivate = ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.');
    return (
      <span className={`font-mono ${isPrivate ? 'text-green-400' : 'text-red-400'}`}>
        {ip}
      </span>
    );
  };

  // Function to format port with highlighting for common ports
  const formatPort = (port) => {
    const commonPorts = [22, 80, 443];
    const isCommon = commonPorts.includes(port);
    return (
      <span className={`font-mono ${isCommon ? 'text-green-400' : 'text-red-400'}`}>
        {port}
      </span>
    );
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner mr-3"></div>
        <span>Loading alerts...</span>
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="text-center p-8">
        <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-400 text-lg">No security alerts found</p>
        <p className="text-gray-500 text-sm mt-2">Upload a log file to start detecting threats</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="cyber-table w-full text-sm text-left">
        <thead>
          <tr>
            <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
              Source IP
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
              Port
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
              Threat Type
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {alerts.map((alert) => (
            <tr
              key={alert.id}
              className={`hover:bg-opacity-50 transition-colors duration-200 ${getSeverityClass(alert.threat_type)}`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-mono text-gray-300">
                  {formatTimestamp(alert.timestamp)}
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">
                  {formatIP(alert.source_ip)}
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">
                  {formatPort(alert.port)}
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={getThreatBadgeClass(alert.threat_type)}>
                  {alert.threat_type}
                </span>
              </td>
              
              <td className="px-6 py-4">
                <div className="text-sm text-gray-300 max-w-md">
                  {alert.description}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Table Footer with Summary */}
      <div className="mt-4 p-4 bg-cyber-gray rounded-lg border border-gray-600">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>
            Showing {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
          </span>
          <div className="flex space-x-4">
            <span>
              Critical: {alerts.filter(a => a.threat_type === 'High Frequency Connection').length}
            </span>
            <span>
              High: {alerts.filter(a => a.threat_type === 'Suspicious Port').length}
            </span>
            <span>
              Medium: {alerts.filter(a => a.threat_type === 'Large Packet').length}
            </span>
            <span>
              Low: {alerts.filter(a => a.threat_type === 'Unusual Protocol').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertTable;
