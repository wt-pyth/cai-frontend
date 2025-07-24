# Google Cloud Run Deployment Guide

This guide will help you deploy your Next.js application to Google Cloud Run with automatic deployment on commits to the production branch.

## 📁 Files Created

The following files have been created for your deployment setup:

- `Dockerfile` - Multi-stage Docker build for production-ready Next.js app
- `cloudbuild.yaml` - Google Cloud Build configuration for CI/CD
- `docker-compose.yml` - Local development with Docker
- `.dockerignore` - Optimizes Docker build by excluding unnecessary files
- `deploy.sh` / `deploy.ps1` - Deployment helper scripts
- `DEPLOYMENT.md` - This guide

## 🔧 Prerequisites

Before you begin, ensure you have:

1. **Google Cloud Account** with billing enabled
2. **Google Cloud Project** created
3. **Google Cloud SDK** installed
4. **Docker** installed
5. **Git repository** (for auto-deployment)

## 📋 Step-by-Step Setup

### Step 1: Install Google Cloud SDK

1. Download and install the Google Cloud SDK:
   - Windows: https://cloud.google.com/sdk/docs/install-sdk#windows
   - macOS: `brew install google-cloud-sdk`
   - Linux: Follow the official guide

2. Authenticate and set up your project:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

### Step 2: Enable Required APIs

Run the setup script to enable necessary APIs:

**Windows (PowerShell):**
```powershell
.\deploy.ps1 -Command setup
```

**Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh setup
```

Or manually enable APIs:
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 3: Test Local Build

Build and test your Docker image locally:

**Windows:**
```powershell
.\deploy.ps1 -Command build
```

**Linux/macOS:**
```bash
./deploy.sh build
```

Test the local image:
```bash
docker run -p 3000:3000 cap-platform:local
```

Visit http://localhost:3000 to verify your app works.

### Step 4: Manual Deployment

Deploy manually to test the setup:

**Windows:**
```powershell
.\deploy.ps1 -Command deploy
```

**Linux/macOS:**
```bash
./deploy.sh deploy
```

### Step 5: Set Up Auto-Deployment

1. **Connect your repository to Cloud Build:**
   ```bash
   gcloud builds triggers create github \
     --repo-name=YOUR_REPO_NAME \
     --repo-owner=YOUR_GITHUB_USERNAME \
     --branch-pattern="^production$" \
     --build-config=cloudbuild.yaml
   ```

2. **Grant Cloud Build permissions:**
   ```bash
   # Get your project number
   PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)")
   
   # Grant Cloud Run Developer role to Cloud Build
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
     --role="roles/run.developer"
   
   # Grant IAM Service Account User role
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"
   ```

### Step 6: Configure Environment Variables (Optional)

If your app needs environment variables, update the Cloud Build configuration:

1. Edit `cloudbuild.yaml`
2. Add environment variables to the Cloud Run deploy step:
   ```yaml
   --set-env-vars NODE_ENV=production,API_URL=https://your-api.com
   ```

Or use Google Secret Manager for sensitive data:
```bash
# Create a secret
echo "your-secret-value" | gcloud secrets create your-secret-name --data-file=-

# Update cloudbuild.yaml to use secrets
--set-secrets /app/.env=your-secret-name:latest
```

## 🚀 How Auto-Deployment Works

1. **Trigger**: Push commits to the `production` branch
2. **Build**: Cloud Build automatically starts
3. **Steps**:
   - Builds Docker image from your Dockerfile
   - Pushes image to Google Container Registry
   - Deploys to Cloud Run
4. **Result**: Your app is automatically updated

## 🐳 Docker Configuration Explained

### Dockerfile Stages

1. **Base**: Node.js 18 Alpine Linux (lightweight)
2. **Dependencies**: Installs only production dependencies
3. **Builder**: Builds the Next.js application
4. **Runner**: Minimal production image with built app

### Key Features

- **Multi-stage build**: Reduces final image size
- **Non-root user**: Enhanced security
- **Standalone output**: Optimized for containerization
- **Health checks**: Built-in application monitoring

## 🔧 Local Development with Docker

Use Docker Compose for local development:

```bash
# Start development environment
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📊 Monitoring and Troubleshooting

### View Cloud Build Logs
```bash
gcloud builds list
gcloud builds log BUILD_ID
```

### View Cloud Run Logs
```bash
gcloud run services logs read cap-platform --region=us-central1
```

### Common Issues

1. **Build Timeout**: Increase timeout in `cloudbuild.yaml`
2. **Memory Issues**: Increase memory allocation in Cloud Run
3. **Environment Variables**: Ensure all required env vars are set
4. **Port Issues**: Verify your app listens on PORT environment variable

### Cloud Run Configuration

Current configuration in `cloudbuild.yaml`:
- **Memory**: 2Gi
- **CPU**: 1 vCPU
- **Region**: us-central1
- **Port**: 3000
- **Min Instances**: 0 (scales to zero)
- **Max Instances**: 10

## 💰 Cost Optimization

- **Scaling to Zero**: No charges when not serving requests
- **Request-based Billing**: Pay only for actual usage
- **Efficient Docker Image**: Multi-stage build reduces size and costs

## 🔒 Security Best Practices

1. **Non-root Container**: App runs as non-privileged user
2. **Minimal Image**: Alpine Linux base reduces attack surface
3. **Environment Variables**: Use Secret Manager for sensitive data
4. **IAM Permissions**: Least-privilege access for Cloud Build

## 📝 Customization

### Modify Build Configuration

Edit `cloudbuild.yaml` to:
- Change region: Update `--region` parameter
- Add environment variables: Update `--set-env-vars`
- Modify resources: Update `--memory` and `--cpu`
- Add build steps: Add additional `steps`

### Update Docker Configuration

Edit `Dockerfile` to:
- Change Node.js version: Update base image
- Add system dependencies: Add `RUN apk add` commands
- Modify build process: Update build stages

## 🎯 Next Steps

1. ✅ Test local Docker build
2. ✅ Deploy manually once
3. ✅ Set up GitHub/GitLab connection
4. ✅ Configure auto-deployment trigger
5. ✅ Set up monitoring and alerts
6. ✅ Configure custom domain (optional)
7. ✅ Set up staging environment (optional)

## 📞 Support

For issues with:
- **Docker**: Check Docker logs and build output
- **Cloud Build**: Review build logs in Google Cloud Console
- **Cloud Run**: Check service logs and metrics
- **This Setup**: Review this guide and deployment scripts

Your Next.js app is now ready for production deployment on Google Cloud Run! 🚀
