#!/bin/bash

# Deployment script for Google Cloud Run
# This script helps you deploy your Next.js app to Google Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v gcloud &> /dev/null; then
        print_error "Google Cloud SDK is not installed. Please install it first."
        echo "Visit: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install it first."
        echo "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    print_status "All dependencies are installed."
}

# Set project configuration
setup_project() {
    print_status "Setting up Google Cloud project..."
    
    # Get current project
    CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")
    
    if [ -z "$CURRENT_PROJECT" ]; then
        print_warning "No project is currently set."
        echo "Please run: gcloud auth login && gcloud config set project YOUR_PROJECT_ID"
        exit 1
    fi
    
    print_status "Using project: $CURRENT_PROJECT"
    
    # Enable required APIs
    print_status "Enabling required APIs..."
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable containerregistry.googleapis.com
}

# Build and test locally
local_build() {
    print_status "Building Docker image locally..."
    docker build -t cap-platform:local .
    
    print_status "Local build completed successfully!"
    print_warning "To test locally, run: docker run -p 3000:3000 cap-platform:local"
}

# Deploy to Cloud Run
deploy() {
    print_status "Deploying to Google Cloud Run..."
    
    # Submit build to Cloud Build
    gcloud builds submit --config cloudbuild.yaml .
    
    print_status "Deployment completed successfully!"
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe cap-platform --region=us-central1 --format="value(status.url)")
    print_status "Your app is available at: $SERVICE_URL"
}

# Main menu
case "${1:-help}" in
    "check")
        check_dependencies
        ;;
    "setup")
        check_dependencies
        setup_project
        ;;
    "build")
        check_dependencies
        local_build
        ;;
    "deploy")
        check_dependencies
        setup_project
        deploy
        ;;
    "help"|*)
        echo "Usage: $0 {check|setup|build|deploy|help}"
        echo ""
        echo "Commands:"
        echo "  check  - Check if all required dependencies are installed"
        echo "  setup  - Set up Google Cloud project and enable APIs"
        echo "  build  - Build Docker image locally for testing"
        echo "  deploy - Deploy to Google Cloud Run"
        echo "  help   - Show this help message"
        ;;
esac
