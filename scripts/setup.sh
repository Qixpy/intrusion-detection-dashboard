#!/bin/bash

# Intrusion Detection Dashboard Setup Script
# This script sets up the development environment for the cybersecurity dashboard

echo "🛡️  Intrusion Detection Dashboard Setup"
echo "========================================"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print colored output
print_status() {
    echo -e "\033[1;34m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[1;32m[SUCCESS]\033[0m $1"
}

print_error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
}

print_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

# Check for required tools
print_status "Checking system requirements..."

# Check for Python
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_success "Python 3 found: $PYTHON_VERSION"
    PYTHON_CMD="python3"
elif command_exists python; then
    PYTHON_VERSION=$(python --version 2>&1 | cut -d' ' -f2)
    if [[ $PYTHON_VERSION == 3* ]]; then
        print_success "Python 3 found: $PYTHON_VERSION"
        PYTHON_CMD="python"
    else
        print_error "Python 3 is required. Found Python $PYTHON_VERSION"
        exit 1
    fi
else
    print_error "Python 3 is not installed. Please install Python 3.7 or higher."
    exit 1
fi

# Check for pip
if command_exists pip3; then
    PIP_CMD="pip3"
elif command_exists pip; then
    PIP_CMD="pip"
else
    print_error "pip is not installed. Please install pip."
    exit 1
fi

# Check for Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

# Check for npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
else
    print_error "npm is not installed. Please install npm."
    exit 1
fi

echo ""
print_status "Setting up Python backend..."

# Navigate to backend directory
cd backend || {
    print_error "Backend directory not found!"
    exit 1
}

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    $PYTHON_CMD -m venv venv
    if [ $? -eq 0 ]; then
        print_success "Virtual environment created successfully"
    else
        print_error "Failed to create virtual environment"
        exit 1
    fi
else
    print_success "Virtual environment already exists"
fi

# Activate virtual environment
print_status "Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # Unix/Linux/macOS
    source venv/bin/activate
fi

# Install Python dependencies
print_status "Installing Python dependencies..."
$PIP_CMD install -r requirements.txt
if [ $? -eq 0 ]; then
    print_success "Python dependencies installed successfully"
else
    print_error "Failed to install Python dependencies"
    exit 1
fi

# Initialize database
print_status "Initializing SQLite database..."
$PYTHON_CMD -c "
from database import DatabaseManager
db = DatabaseManager()
db.init_database()
print('Database initialized successfully!')
"

if [ $? -eq 0 ]; then
    print_success "Database initialized successfully"
else
    print_error "Failed to initialize database"
    exit 1
fi

# Return to project root
cd ..

echo ""
print_status "Setting up React frontend..."

# Navigate to frontend directory
cd frontend || {
    print_error "Frontend directory not found!"
    exit 1
}

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Node.js dependencies installed successfully"
else
    print_error "Failed to install Node.js dependencies"
    exit 1
fi

# Build Tailwind CSS
print_status "Building Tailwind CSS..."
npx tailwindcss -i ./src/styles.css -o ./src/tailwind-output.css --watch=false
if [ $? -eq 0 ]; then
    print_success "Tailwind CSS built successfully"
else
    print_warning "Tailwind CSS build failed, but this won't prevent the app from running"
fi

# Return to project root
cd ..

echo ""
print_success "✅ Setup completed successfully!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "1. Start the backend server:"
echo "   cd backend"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "   venv\\Scripts\\activate"
else
    echo "   source venv/bin/activate"
fi
echo "   python app.py"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Open your browser and navigate to:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
echo "📖 For more information, see the README.md file"
echo ""
print_status "Happy threat hunting! 🔍"
