#!/usr/bin/env python3
"""
Project validation script for the Intrusion Detection Dashboard.
This script validates the project structure and configuration files.
"""

import os
import sys
import json
import csv
from pathlib import Path

def print_status(message, status="INFO"):
    colors = {
        "INFO": "\033[1;34m",
        "SUCCESS": "\033[1;32m", 
        "ERROR": "\033[1;31m",
        "WARNING": "\033[1;33m"
    }
    reset = "\033[0m"
    print(f"{colors.get(status, '')}[{status}]{reset} {message}")

def validate_file_structure():
    """Validate that all required files and directories exist."""
    print_status("Validating project structure...")
    
    required_structure = {
        "backend/": [
            "app.py",
            "analyzer.py", 
            "database.py",
            "requirements.txt",
            "network_logs.csv"
        ],
        "frontend/": [
            "package.json",
            "tailwind.config.js",
            "src/App.js",
            "src/index.js",
            "src/styles.css",
            "src/components/AlertTable.js",
            "src/components/AlertChart.js",
            "src/components/FileUpload.js",
            "public/index.html"
        ],
        "scripts/": [
            "setup.sh",
            "setup.ps1"
        ],
        "./": [
            "README.md",
            ".gitignore",
            "LICENSE"
        ]
    }
    
    missing_files = []
    project_root = Path(".")
    
    for directory, files in required_structure.items():
        dir_path = project_root / directory
        
        if not dir_path.exists():
            missing_files.append(directory)
            continue
            
        for file in files:
            file_path = project_root / directory / file
            if not file_path.exists():
                missing_files.append(f"{directory}{file}")
    
    if missing_files:
        print_status(f"Missing files/directories: {', '.join(missing_files)}", "ERROR")
        return False
    else:
        print_status("All required files and directories exist", "SUCCESS")
        return True

def validate_backend_dependencies():
    """Validate backend requirements.txt contains necessary packages."""
    print_status("Validating backend dependencies...")
    
    try:
        with open("backend/requirements.txt", "r") as f:
            requirements = f.read().lower()
        
        required_packages = ["flask", "pandas", "flask-cors"]
        missing_packages = []
        
        for package in required_packages:
            if package not in requirements:
                missing_packages.append(package)
        
        if missing_packages:
            print_status(f"Missing required packages: {', '.join(missing_packages)}", "ERROR")
            return False
        else:
            print_status("All required backend dependencies found", "SUCCESS")
            return True
            
    except FileNotFoundError:
        print_status("requirements.txt not found", "ERROR")
        return False

def validate_frontend_dependencies():
    """Validate frontend package.json contains necessary packages."""
    print_status("Validating frontend dependencies...")
    
    try:
        with open("frontend/package.json", "r") as f:
            package_data = json.load(f)
        
        dependencies = package_data.get("dependencies", {})
        required_packages = ["react", "axios", "chart.js", "react-chartjs-2"]
        missing_packages = []
        
        for package in required_packages:
            if package not in dependencies:
                missing_packages.append(package)
        
        if missing_packages:
            print_status(f"Missing required packages: {', '.join(missing_packages)}", "ERROR")
            return False
        else:
            print_status("All required frontend dependencies found", "SUCCESS")
            return True
            
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print_status(f"Error reading package.json: {e}", "ERROR")
        return False

def validate_sample_csv():
    """Validate the sample CSV file has the correct format."""
    print_status("Validating sample CSV file...")
    
    try:
        with open("backend/network_logs.csv", "r") as f:
            reader = csv.DictReader(f)
            required_columns = ["timestamp", "source_ip", "destination_ip", "port", "protocol", "packet_size"]
            
            # Check if all required columns are present
            missing_columns = [col for col in required_columns if col not in reader.fieldnames]
            
            if missing_columns:
                print_status(f"Missing CSV columns: {', '.join(missing_columns)}", "ERROR")
                return False
            
            # Check if there are data rows
            rows = list(reader)
            if len(rows) < 10:
                print_status("CSV file should have at least 10 data rows", "WARNING")
            
            print_status(f"Sample CSV validated successfully ({len(rows)} rows)", "SUCCESS")
            return True
            
    except FileNotFoundError:
        print_status("Sample CSV file not found", "ERROR")
        return False
    except Exception as e:
        print_status(f"Error reading CSV file: {e}", "ERROR")
        return False

def validate_configuration_files():
    """Validate configuration files are properly formatted."""
    print_status("Validating configuration files...")
    
    config_files = [
        ("frontend/tailwind.config.js", "Tailwind configuration"),
        ("frontend/package.json", "Frontend package configuration")
    ]
    
    all_valid = True
    
    for file_path, description in config_files:
        if not Path(file_path).exists():
            print_status(f"{description} file missing: {file_path}", "ERROR")
            all_valid = False
        else:
            print_status(f"{description} found", "SUCCESS")
    
    return all_valid

def main():
    """Main validation function."""
    print_status("🛡️  Intrusion Detection Dashboard - Project Validation")
    print("=" * 60)
    
    # Change to project directory if not already there
    if not Path("README.md").exists():
        print_status("Please run this script from the project root directory", "ERROR")
        sys.exit(1)
    
    validation_results = [
        validate_file_structure(),
        validate_backend_dependencies(),
        validate_frontend_dependencies(),
        validate_sample_csv(),
        validate_configuration_files()
    ]
    
    print("\n" + "=" * 60)
    
    if all(validation_results):
        print_status("✅ All validations passed! Project is ready for setup.", "SUCCESS")
        print_status("Next steps:", "INFO")
        print("1. Run the setup script: ./scripts/setup.sh (Linux/Mac) or .\\scripts\\setup.ps1 (Windows)")
        print("2. Follow the README.md instructions to start the application")
        return 0
    else:
        print_status("❌ Some validations failed. Please check the errors above.", "ERROR")
        return 1

if __name__ == "__main__":
    sys.exit(main())
