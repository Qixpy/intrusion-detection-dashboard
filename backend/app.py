"""
Flask backend application for the Intrusion Detection Dashboard.
Provides REST API endpoints for alert management and log analysis.
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import logging
from datetime import datetime
import tempfile
import pandas as pd

from database import DatabaseManager
from analyzer import NetworkAnalyzer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Configure CORS with security headers
CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000'])

# Add security headers
@app.after_request
def add_security_headers(response):
    # Content Security Policy
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data: https:; "
        "connect-src 'self' http://localhost:* ws://localhost:*; "
        "frame-src 'none'; "
        "object-src 'none';"
    )
    
    # Additional security headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    
    return response

# Initialize database and analyzer
db_manager = DatabaseManager()
network_analyzer = NetworkAnalyzer()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the API is running."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Intrusion Detection Dashboard API'
    })

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """
    GET endpoint to retrieve all alerts from the database.
    
    Query parameters:
    - recent: if true, returns only alerts from last 24 hours
    """
    try:
        recent_only = request.args.get('recent', 'false').lower() == 'true'
        
        if recent_only:
            alerts = db_manager.get_recent_alerts(24)
        else:
            alerts = db_manager.get_all_alerts()
        
        logger.info(f"Retrieved {len(alerts)} alerts (recent_only={recent_only})")
        
        return jsonify({
            'success': True,
            'alerts': alerts,
            'count': len(alerts),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error retrieving alerts: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/alerts/stats', methods=['GET'])
def get_alert_stats():
    """Get alert statistics for dashboard charts."""
    try:
        # Get hourly alert counts for the last 24 hours
        hourly_data = db_manager.get_alert_count_by_hour(24)
        
        # Get recent alerts for threat type breakdown
        recent_alerts = db_manager.get_recent_alerts(24)
        
        # Calculate threat type breakdown
        threat_breakdown = {}
        for alert in recent_alerts:
            threat_type = alert['threat_type']
            threat_breakdown[threat_type] = threat_breakdown.get(threat_type, 0) + 1
        
        stats = {
            'hourly_counts': hourly_data,
            'threat_breakdown': threat_breakdown,
            'total_recent_alerts': len(recent_alerts),
            'timestamp': datetime.now().isoformat()
        }
        
        logger.info(f"Generated alert statistics: {len(hourly_data)} hourly entries, {len(threat_breakdown)} threat types")
        
        return jsonify({
            'success': True,
            'stats': stats
        })
    
    except Exception as e:
        logger.error(f"Error generating alert statistics: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_logs():
    """
    POST endpoint to upload and analyze network log files.
    
    Expects a multipart/form-data request with a 'file' field containing the CSV log file.
    """
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file uploaded'
            }), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        if not file.filename.endswith('.csv'):
            return jsonify({
                'success': False,
                'error': 'File must be a CSV file'
            }), 400
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(mode='wb', suffix='.csv', delete=False) as temp_file:
            file.save(temp_file.name)
            temp_file_path = temp_file.name
        
        try:
            # Analyze the uploaded file
            logger.info(f"Starting analysis of uploaded file: {file.filename}")
            alerts = network_analyzer.analyze_logs(temp_file_path)
            
            # Store alerts in database
            stored_count = 0
            for alert in alerts:
                success = db_manager.insert_alert(
                    alert['timestamp'],
                    alert['source_ip'],
                    alert['port'],
                    alert['threat_type'],
                    alert['description']
                )
                if success:
                    stored_count += 1
            
            # Generate analysis summary
            summary = network_analyzer.get_analysis_summary(alerts)
            
            logger.info(f"Analysis complete: {len(alerts)} alerts generated, {stored_count} stored in database")
            
            return jsonify({
                'success': True,
                'alerts_generated': len(alerts),
                'alerts_stored': stored_count,
                'summary': summary,
                'timestamp': datetime.now().isoformat()
            })
        
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
    
    except Exception as e:
        logger.error(f"Error analyzing logs: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sample-log', methods=['GET'])
def download_sample_log():
    """Download the sample network log file."""
    try:
        return send_from_directory(
            os.path.dirname(os.path.abspath(__file__)),
            'network_logs.csv',
            as_attachment=True,
            download_name='sample_network_logs.csv'
        )
    except Exception as e:
        logger.error(f"Error serving sample log file: {e}")
        return jsonify({
            'success': False,
            'error': 'Sample log file not found'
        }), 404

@app.route('/api/alerts', methods=['DELETE'])
def clear_alerts():
    """DELETE endpoint to clear all alerts (for testing purposes)."""
    try:
        success = db_manager.clear_alerts()
        
        if success:
            logger.info("All alerts cleared from database")
            return jsonify({
                'success': True,
                'message': 'All alerts cleared successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to clear alerts'
            }), 500
    
    except Exception as e:
        logger.error(f"Error clearing alerts: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    logger.error(f"Internal server error: {error}")
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    logger.info("Starting Intrusion Detection Dashboard API...")
    logger.info("Initializing database...")
    
    # Initialize database
    db_manager.init_database()
    
    # Get port from environment variable or use default
    port = int(os.environ.get('FLASK_PORT', 5000))
    
    logger.info(f"API server starting on http://localhost:{port}")
    logger.info("Available endpoints:")
    logger.info("  GET  /api/health - Health check")
    logger.info("  GET  /api/alerts - Get all alerts")
    logger.info("  GET  /api/alerts/stats - Get alert statistics")
    logger.info("  POST /api/analyze - Upload and analyze log file")
    logger.info("  GET  /api/sample-log - Download sample log file")
    logger.info("  DELETE /api/alerts - Clear all alerts")
    
    # Run the Flask development server
    debug_mode = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
