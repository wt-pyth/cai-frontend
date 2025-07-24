# PowerShell deployment script for Google Cloud Run
# This script helps you deploy your Next.js app to Google Cloud Run

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("check", "setup", "build", "deploy", "help")]
    [string]$Command = "help"
)

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if required tools are installed
function Test-Dependencies {
    Write-Status "Checking dependencies..."
    
    $gcloudExists = Get-Command gcloud -ErrorAction SilentlyContinue
    if (-not $gcloudExists) {
        Write-Error "Google Cloud SDK is not installed. Please install it first."
        Write-Host "Visit: https://cloud.google.com/sdk/docs/install"
        exit 1
    }
    
    $dockerExists = Get-Command docker -ErrorAction SilentlyContinue
    if (-not $dockerExists) {
        Write-Error "Docker is not installed. Please install it first."
        Write-Host "Visit: https://docs.docker.com/get-docker/"
        exit 1
    }
    
    Write-Status "All dependencies are installed."
}

# Set project configuration
function Initialize-Project {
    Write-Status "Setting up Google Cloud project..."
    
    # Get current project
    $currentProject = gcloud config get-value project 2>$null
    
    if (-not $currentProject) {
        Write-Warning "No project is currently set."
        Write-Host "Please run: gcloud auth login && gcloud config set project YOUR_PROJECT_ID"
        exit 1
    }
    
    Write-Status "Using project: $currentProject"
    
    # Enable required APIs
    Write-Status "Enabling required APIs..."
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable containerregistry.googleapis.com
}

# Build and test locally
function Build-Local {
    Write-Status "Building Docker image locally..."
    docker build -t cap-platform:local .
    
    Write-Status "Local build completed successfully!"
    Write-Warning "To test locally, run: docker run -p 3000:3000 cap-platform:local"
}

# Deploy to Cloud Run
function Deploy-App {
    Write-Status "Deploying to Google Cloud Run..."
    
    # Submit build to Cloud Build
    gcloud builds submit --config cloudbuild.yaml .
    
    Write-Status "Deployment completed successfully!"
    
    # Get service URL
    $serviceUrl = gcloud run services describe cap-platform --region=us-central1 --format="value(status.url)"
    Write-Status "Your app is available at: $serviceUrl"
}

# Main execution
switch ($Command) {
    "check" {
        Test-Dependencies
    }
    "setup" {
        Test-Dependencies
        Initialize-Project
    }
    "build" {
        Test-Dependencies
        Build-Local
    }
    "deploy" {
        Test-Dependencies
        Initialize-Project
        Deploy-App
    }
    "help" {
        Write-Host "Usage: .\deploy.ps1 -Command {check|setup|build|deploy|help}"
        Write-Host ""
        Write-Host "Commands:"
        Write-Host "  check  - Check if all required dependencies are installed"
        Write-Host "  setup  - Set up Google Cloud project and enable APIs"
        Write-Host "  build  - Build Docker image locally for testing"
        Write-Host "  deploy - Deploy to Google Cloud Run"
        Write-Host "  help   - Show this help message"
    }
}
