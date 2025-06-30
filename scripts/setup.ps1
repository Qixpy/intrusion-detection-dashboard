# Intrusion Detection Dashboard Setup Script for Windows
# PowerShell script to set up the development environment

Write-Host "🛡️  Intrusion Detection Dashboard Setup (Windows)" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Function to print colored output
function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

# Check for required tools
Write-Status "Checking system requirements..."

# Check for Python
if (Test-Command python) {
    $pythonVersion = python --version 2>&1
    if ($pythonVersion -match "Python 3") {
        Write-Success "Python 3 found: $pythonVersion"
        $pythonCmd = "python"
    } else {
        Write-Error "Python 3 is required. Found: $pythonVersion"
        exit 1
    }
} elseif (Test-Command python3) {
    $pythonVersion = python3 --version
    Write-Success "Python 3 found: $pythonVersion"
    $pythonCmd = "python3"
} else {
    Write-Error "Python 3 is not installed. Please install Python 3.7 or higher."
    Write-Host "Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

# Check for pip
if (Test-Command pip) {
    $pipCmd = "pip"
} elseif (Test-Command pip3) {
    $pipCmd = "pip3"
} else {
    Write-Error "pip is not installed. Please install pip."
    exit 1
}

# Check for Node.js
if (Test-Command node) {
    $nodeVersion = node --version
    Write-Success "Node.js found: $nodeVersion"
} else {
    Write-Error "Node.js is not installed. Please install Node.js 14 or higher."
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check for npm
if (Test-Command npm) {
    $npmVersion = npm --version
    Write-Success "npm found: v$npmVersion"
} else {
    Write-Error "npm is not installed. Please install npm."
    exit 1
}

Write-Host ""
Write-Status "Setting up Python backend..."

# Navigate to backend directory
if (Test-Path "backend") {
    Set-Location backend
} else {
    Write-Error "Backend directory not found!"
    exit 1
}

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Status "Creating Python virtual environment..."
    & $pythonCmd -m venv venv
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Virtual environment created successfully"
    } else {
        Write-Error "Failed to create virtual environment"
        exit 1
    }
} else {
    Write-Success "Virtual environment already exists"
}

# Activate virtual environment
Write-Status "Activating virtual environment..."
& "venv\Scripts\Activate.ps1"

# Install Python dependencies
Write-Status "Installing Python dependencies..."
& $pipCmd install -r requirements.txt
if ($LASTEXITCODE -eq 0) {
    Write-Success "Python dependencies installed successfully"
} else {
    Write-Error "Failed to install Python dependencies"
    exit 1
}

# Initialize database
Write-Status "Initializing SQLite database..."
$dbInitScript = @"
from database import DatabaseManager
db = DatabaseManager()
db.init_database()
print('Database initialized successfully!')
"@

$dbInitScript | & $pythonCmd
if ($LASTEXITCODE -eq 0) {
    Write-Success "Database initialized successfully"
} else {
    Write-Error "Failed to initialize database"
    exit 1
}

# Return to project root
Set-Location ..

Write-Host ""
Write-Status "Setting up React frontend..."

# Navigate to frontend directory
if (Test-Path "frontend") {
    Set-Location frontend
} else {
    Write-Error "Frontend directory not found!"
    exit 1
}

# Install Node.js dependencies
Write-Status "Installing Node.js dependencies..."
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Success "Node.js dependencies installed successfully"
} else {
    Write-Error "Failed to install Node.js dependencies"
    exit 1
}

# Build Tailwind CSS
Write-Status "Building Tailwind CSS..."
npx tailwindcss -i ./src/styles.css -o ./src/tailwind-output.css --watch=false
if ($LASTEXITCODE -eq 0) {
    Write-Success "Tailwind CSS built successfully"
} else {
    Write-Warning "Tailwind CSS build failed, but this won't prevent the app from running"
}

# Return to project root
Set-Location ..

Write-Host ""
Write-Success "✅ Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 To start the application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start the backend server:" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "   python app.py" -ForegroundColor White
Write-Host ""
Write-Host "2. In a new PowerShell window, start the frontend:" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "3. Open your browser and navigate to:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "📖 For more information, see the README.md file" -ForegroundColor Cyan
Write-Host ""
Write-Status "Happy threat hunting! 🔍"
