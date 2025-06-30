"""
Network traffic log analyzer for the Intrusion Detection Dashboard.
Implements rule-based threat detection on CSV log files.
"""

import pandas as pd
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
from collections import defaultdict
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NetworkAnalyzer:
    """Analyzes network traffic logs and detects potential threats."""
    
    def __init__(self):
        """Initialize the network analyzer with detection rules."""
        self.allowed_ports = {22, 80, 443}  # SSH, HTTP, HTTPS
        self.connection_threshold = 10  # Max connections per minute
        self.time_window = 60  # Time window in seconds
        
    def parse_csv_logs(self, csv_path: str) -> pd.DataFrame:
        """Parse CSV log file and return a pandas DataFrame."""
        try:
            # Read CSV file
            df = pd.read_csv(csv_path)
            
            # Validate required columns
            required_columns = ['timestamp', 'source_ip', 'destination_ip', 'port', 'protocol', 'packet_size']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                raise ValueError(f"Missing required columns: {missing_columns}")
            
            # Convert timestamp to datetime
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            
            logger.info(f"Successfully parsed {len(df)} log entries from {csv_path}")
            return df
        
        except Exception as e:
            logger.error(f"Error parsing CSV file {csv_path}: {e}")
            raise
    
    def detect_suspicious_ports(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Detect connections to non-standard ports."""
        alerts = []
        
        # Filter for connections to non-allowed ports
        suspicious_ports = df[~df['port'].isin(self.allowed_ports)]
        
        for _, row in suspicious_ports.iterrows():
            alert = {
                'timestamp': row['timestamp'].strftime("%Y-%m-%d %H:%M:%S"),
                'source_ip': row['source_ip'],
                'port': int(row['port']),
                'threat_type': 'Suspicious Port',
                'description': f"Connection to non-standard port {row['port']} detected from {row['source_ip']}"
            }
            alerts.append(alert)
        
        logger.info(f"Detected {len(alerts)} suspicious port connections")
        return alerts
    
    def detect_high_frequency_connections(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Detect IPs with high frequency connections (>10 per minute)."""
        alerts = []
        
        # Group by source IP and time windows
        df_sorted = df.sort_values('timestamp')
        
        # Create time windows of 1 minute
        for source_ip in df['source_ip'].unique():
            ip_data = df_sorted[df_sorted['source_ip'] == source_ip].copy()
            
            if len(ip_data) < self.connection_threshold:
                continue
            
            # Check for high frequency in any 1-minute window
            for i in range(len(ip_data)):
                start_time = ip_data.iloc[i]['timestamp']
                end_time = start_time + timedelta(seconds=self.time_window)
                
                # Count connections in this time window
                window_connections = ip_data[
                    (ip_data['timestamp'] >= start_time) & 
                    (ip_data['timestamp'] <= end_time)
                ]
                
                if len(window_connections) > self.connection_threshold:
                    alert = {
                        'timestamp': start_time.strftime("%Y-%m-%d %H:%M:%S"),
                        'source_ip': source_ip,
                        'port': int(window_connections.iloc[0]['port']),
                        'threat_type': 'High Frequency Connection',
                        'description': f"IP {source_ip} made {len(window_connections)} connections in 1 minute (threshold: {self.connection_threshold})"
                    }
                    alerts.append(alert)
                    break  # Only report once per IP to avoid spam
        
        logger.info(f"Detected {len(alerts)} high frequency connection patterns")
        return alerts
    
    def detect_unusual_protocols(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Detect unusual or potentially malicious protocols."""
        alerts = []
        common_protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS']
        
        # Find entries with unusual protocols
        unusual_protocols = df[~df['protocol'].str.upper().isin(common_protocols)]
        
        for _, row in unusual_protocols.iterrows():
            alert = {
                'timestamp': row['timestamp'].strftime("%Y-%m-%d %H:%M:%S"),
                'source_ip': row['source_ip'],
                'port': int(row['port']),
                'threat_type': 'Unusual Protocol',
                'description': f"Unusual protocol '{row['protocol']}' detected from {row['source_ip']}"
            }
            alerts.append(alert)
        
        logger.info(f"Detected {len(alerts)} unusual protocol connections")
        return alerts
    
    def detect_large_packets(self, df: pd.DataFrame, size_threshold: int = 65536) -> List[Dict[str, Any]]:
        """Detect unusually large packets that might indicate data exfiltration."""
        alerts = []
        
        # Filter for large packets
        large_packets = df[df['packet_size'] > size_threshold]
        
        for _, row in large_packets.iterrows():
            alert = {
                'timestamp': row['timestamp'].strftime("%Y-%m-%d %H:%M:%S"),
                'source_ip': row['source_ip'],
                'port': int(row['port']),
                'threat_type': 'Large Packet',
                'description': f"Large packet ({row['packet_size']} bytes) detected from {row['source_ip']} (threshold: {size_threshold})"
            }
            alerts.append(alert)
        
        logger.info(f"Detected {len(alerts)} large packet transmissions")
        return alerts
    
    def analyze_logs(self, csv_path: str) -> List[Dict[str, Any]]:
        """Perform comprehensive analysis on network logs and return all detected threats."""
        try:
            # Parse the CSV file
            df = self.parse_csv_logs(csv_path)
            
            all_alerts = []
            
            # Run all detection rules
            logger.info("Running threat detection analysis...")
            
            # Detect suspicious ports
            port_alerts = self.detect_suspicious_ports(df)
            all_alerts.extend(port_alerts)
            
            # Detect high frequency connections
            freq_alerts = self.detect_high_frequency_connections(df)
            all_alerts.extend(freq_alerts)
            
            # Detect unusual protocols
            protocol_alerts = self.detect_unusual_protocols(df)
            all_alerts.extend(protocol_alerts)
            
            # Detect large packets
            packet_alerts = self.detect_large_packets(df)
            all_alerts.extend(packet_alerts)
            
            logger.info(f"Analysis complete. Total alerts generated: {len(all_alerts)}")
            return all_alerts
        
        except Exception as e:
            logger.error(f"Error during log analysis: {e}")
            raise
    
    def get_analysis_summary(self, alerts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate a summary of the analysis results."""
        threat_counts = defaultdict(int)
        source_ips = set()
        
        for alert in alerts:
            threat_counts[alert['threat_type']] += 1
            source_ips.add(alert['source_ip'])
        
        summary = {
            'total_alerts': len(alerts),
            'unique_source_ips': len(source_ips),
            'threat_breakdown': dict(threat_counts),
            'analysis_timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        return summary

if __name__ == "__main__":
    # Test the analyzer
    analyzer = NetworkAnalyzer()
    
    # This would be used with actual CSV file
    print("Network Analyzer initialized successfully")
    print("Ready to analyze network traffic logs")
