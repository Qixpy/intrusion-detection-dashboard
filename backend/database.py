"""
SQLite database setup and operations for the Intrusion Detection Dashboard.
Handles alert storage and retrieval operations.
"""

import sqlite3
import logging
from datetime import datetime
from typing import List, Dict, Any
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseManager:
    """Manages SQLite database operations for alerts."""
    
    def __init__(self, db_path: str = "alerts.db"):
        """Initialize database manager with specified database path."""
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the SQLite database and create alerts table if it doesn't exist."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS alerts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        timestamp TEXT NOT NULL,
                        source_ip TEXT NOT NULL,
                        port INTEGER NOT NULL,
                        threat_type TEXT NOT NULL,
                        description TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                conn.commit()
                logger.info("Database initialized successfully")
        except sqlite3.Error as e:
            logger.error(f"Database initialization error: {e}")
            raise
    
    def insert_alert(self, timestamp: str, source_ip: str, port: int, 
                    threat_type: str, description: str) -> bool:
        """Insert a new alert into the database."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO alerts (timestamp, source_ip, port, threat_type, description)
                    VALUES (?, ?, ?, ?, ?)
                ''', (timestamp, source_ip, port, threat_type, description))
                conn.commit()
                logger.info(f"Alert inserted: {threat_type} from {source_ip}:{port}")
                return True
        except sqlite3.Error as e:
            logger.error(f"Error inserting alert: {e}")
            return False
    
    def get_all_alerts(self) -> List[Dict[str, Any]]:
        """Retrieve all alerts from the database."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT id, timestamp, source_ip, port, threat_type, description, created_at
                    FROM alerts 
                    ORDER BY created_at DESC
                ''')
                
                columns = [description[0] for description in cursor.description]
                alerts = [dict(zip(columns, row)) for row in cursor.fetchall()]
                
                logger.info(f"Retrieved {len(alerts)} alerts from database")
                return alerts
        except sqlite3.Error as e:
            logger.error(f"Error retrieving alerts: {e}")
            return []
    
    def get_recent_alerts(self, hours: int = 24) -> List[Dict[str, Any]]:
        """Retrieve alerts from the last specified hours."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT id, timestamp, source_ip, port, threat_type, description, created_at
                    FROM alerts 
                    WHERE datetime(created_at) >= datetime('now', '-{} hours')
                    ORDER BY created_at DESC
                '''.format(hours))
                
                columns = [description[0] for description in cursor.description]
                alerts = [dict(zip(columns, row)) for row in cursor.fetchall()]
                
                logger.info(f"Retrieved {len(alerts)} recent alerts from database")
                return alerts
        except sqlite3.Error as e:
            logger.error(f"Error retrieving recent alerts: {e}")
            return []
    
    def clear_alerts(self) -> bool:
        """Clear all alerts from the database (for testing purposes)."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('DELETE FROM alerts')
                conn.commit()
                logger.info("All alerts cleared from database")
                return True
        except sqlite3.Error as e:
            logger.error(f"Error clearing alerts: {e}")
            return False
    
    def get_alert_count_by_hour(self, hours: int = 24) -> List[Dict[str, Any]]:
        """Get alert counts grouped by hour for the last specified hours."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT 
                        strftime('%Y-%m-%d %H:00:00', created_at) as hour,
                        COUNT(*) as count
                    FROM alerts 
                    WHERE datetime(created_at) >= datetime('now', '-{} hours')
                    GROUP BY strftime('%Y-%m-%d %H:00:00', created_at)
                    ORDER BY hour
                '''.format(hours))
                
                columns = [description[0] for description in cursor.description]
                data = [dict(zip(columns, row)) for row in cursor.fetchall()]
                
                logger.info(f"Retrieved alert count data for {len(data)} hours")
                return data
        except sqlite3.Error as e:
            logger.error(f"Error retrieving alert count data: {e}")
            return []

if __name__ == "__main__":
    # Test the database functionality
    db = DatabaseManager()
    
    # Insert a test alert
    test_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db.insert_alert(test_timestamp, "192.168.1.100", 4444, "Suspicious Port", "Connection to non-standard port detected")
    
    # Retrieve and print alerts
    alerts = db.get_all_alerts()
    print(f"Total alerts: {len(alerts)}")
    for alert in alerts:
        print(f"Alert: {alert}")
