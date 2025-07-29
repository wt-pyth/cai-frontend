# capabara-platform



# Cloud Run Deployment Documentation

## Overview
This document provides comprehensive instructions for deploying the CAI Frontend application to Google Cloud Run using Cloud Build triggers for both staging and production environments.

## Architecture

```
GitHub Repository (cai-frontend)
    ↓
Cloud Build Trigger
    ↓
Cloud Build (cloudbuild.yaml)
    ↓
Artifact Registry (Docker Images)
    ↓
Cloud Run Service
```

## Prerequisites

### 1. Google Cloud Setup
- Google Cloud Project: `capabara-auth`
- Project Number: `xxxxxxxxxxxx`
- Enable required APIs:
  ```bash
  gcloud services enable cloudbuild.googleapis.com
  gcloud services enable run.googleapis.com
  gcloud services enable secretmanager.googleapis.com
  gcloud services enable artifactregistry.googleapis.com
  ```

### 2. Required Secrets in Secret Manager
- `FONT_AWESOME_TOKEN`: Font Awesome Pro authentication token
- `cai-frontend-env`: Environment variables file

### 3. Service Account Permissions
Cloud Build Service Account (`xxxxxxxxxxxx@cloudbuild.gserviceaccount.com`) needs:
- `secretmanager.secretAccessor` role for all secrets
- `run.admin` role for Cloud Run deployment
- `artifactregistry.writer` role for pushing images

## Environment Configuration

Please add these variables as a substitution in your Cloud Build triggers.

### Production Environment
- **Branch**: `production`
- **Service Name**: `cai-frontend-prod`
- **Image**: `gcr.io/capabara-auth/cai-frontend-prod`
- **Region**: `us-central1`

### Staging Environment
- **Branch**: `staging`
- **Service Name**: `cai-frontend-staging`
- **Image**: `gcr.io/capabara-auth/cai-frontend-staging`
- **Region**: `us-central1`

## Deployment Steps

### Step 1: Setup Cloud Build Triggers

#### Production Trigger
1. Go to Cloud Build > Triggers in Google Cloud Console
2. Click "Create Trigger"
3. Configure:
   - **Name**: `cai-frontend-staging-deploy`
   - **Event**: Push to a branch
   - **Repository**: `https://github.com/straitsit/capabara-platform`
   - **Branch**: `^production$` or `^develop$`
   - **Configuration**: Cloud Build configuration file (yaml or json)
   - **Location**: `cloudbuild.yaml`

4. **Substitution Variables**:
   ```
   _REGION: us-central1
   _SERVICE: cai-frontend-prod
   _IMAGE: gcr.io/capabara-auth/cai-frontend-prod
   ```

#### Staging Trigger
1. Create another trigger with:
   - **Name**: `cai-frontend-staging-deploy`
   - **Branch**: `^staging$`
   - **Substitution Variables**:
   ```
   _REGION: us-central1
   _SERVICE: cai-frontend-staging
   _IMAGE: gcr.io/capabara-auth/cai-frontend-staging
   ```

### Step 2: Manual Deployment Commands

If you need to deploy manually:

```bash
# Set environment variables
export PROJECT_ID="capabara-auth"
export REGION="us-central1"

# For Production
export SERVICE_NAME="cai-frontend-prod"
export IMAGE_NAME="gcr.io/capabara-auth/cai-frontend-prod"

# For Staging
export SERVICE_NAME="cai-frontend-staging"
export IMAGE_NAME="gcr.io/capabara-auth/cai-frontend-staging"

# Run the build
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions _REGION=$REGION,_SERVICE=$SERVICE_NAME,_IMAGE=$IMAGE_NAME
```

## Build Process Explanation

### Step-by-Step Build Process

1. **Environment Validation** (Step 1)
   - Checks if required variables are set
   - Validates `_IMAGE`, `_SERVICE`, `_REGION` parameters

2. **Secret Retrieval** (Step 2)
   - Downloads environment file from Secret Manager
   - Creates `.env.production` file

3. **Font Awesome Token Validation** (Step 3)
   - Verifies `FONT_AWESOME_TOKEN` is available
   - Exits if token is missing

4. **NPM Configuration** (Step 4)
   - Creates `.npmrc` file with Font Awesome registry
   - Configures authentication for private packages

5. **Docker Build** (Step 5)
   - Builds Docker image with Font Awesome token
   - Tags with commit SHA and 'latest'

6. **Image Push** (Step 6)
   - Pushes both tagged images to Artifact Registry

7. **Cloud Run Deployment** (Step 7)
   - Deploys to Cloud Run with specified configuration
   - Sets up public access permissions

## Configuration Details

### Cloud Run Service Configuration
```yaml
Port: 3000
Memory: 512Mi
CPU: 1
Max Instances: 10
Concurrency: 80
Platform: managed
Authentication: allow-unauthenticated
```

### Docker Build Arguments
- `FONT_AWESOME_TOKEN`: Passed securely from Secret Manager

### Environment Files
- `.env.production`: Retrieved from `cai-frontend-env` secret

## Troubleshooting

### Common Issues

#### 1. Font Awesome Authentication Error
```
npm error Incorrect or missing password
```
**Solution**: Verify `FONT_AWESOME_TOKEN` secret exists and has correct value

#### 2. Image Name Parsing Error
```
invalid image name "$$IMAGE:commit-sha"
```
**Solution**: Ensure substitution variables are set in trigger configuration

#### 3. Permission Denied
```
Permission denied to access secret
```
**Solution**: Grant Cloud Build service account access to secrets:
```bash
gcloud secrets add-iam-policy-binding FONT_AWESOME_TOKEN \
  --member="serviceAccount:xxxxxxxxxxxx@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

#### 4. Build Timeout
**Solution**: Increase timeout in `cloudbuild.yaml` or optimize build process

### Debug Commands

```bash
# Check build logs
gcloud builds log [BUILD_ID]

# Check Cloud Run service status
gcloud run services describe $SERVICE_NAME --region=$REGION

# Check secrets
gcloud secrets list
gcloud secrets versions access latest --secret="FONT_AWESOME_TOKEN"

# Check service account permissions
gcloud projects get-iam-policy capabara-auth
```

## Monitoring and Logs

### Cloud Run Logs
```bash
# View service logs
gcloud run services logs read $SERVICE_NAME --region=$REGION

# Follow logs in real-time
gcloud run services logs tail $SERVICE_NAME --region=$REGION
```

### Build Logs
- Available in Cloud Build console
- Can be viewed via `gcloud builds log [BUILD_ID]`

## Security Best Practices

1. **Secrets Management**
   - All sensitive data stored in Secret Manager
   - Secrets accessed only during build steps
   - No secrets in code or configuration files

2. **Access Control**
   - Cloud Build service account has minimal required permissions
   - Secrets have specific IAM bindings

3. **Image Security**
   - Images built from official Node.js Alpine base
   - No unnecessary packages installed
   - Regular security updates

## Rollback Procedures

### Quick Rollback
```bash
# List previous revisions
gcloud run revisions list --service=$SERVICE_NAME --region=$REGION

# Rollback to previous revision
gcloud run services update-traffic $SERVICE_NAME \
  --to-revisions=[REVISION_NAME]=100 \
  --region=$REGION
```

### Full Rollback with Previous Image
```bash
# Deploy previous image
gcloud run deploy $SERVICE_NAME \
  --image=$IMAGE_NAME:[PREVIOUS_COMMIT_SHA] \
  --region=$REGION
```

## Environment Variables Reference

### Required Substitutions
- `_REGION`: GCP region for deployment
- `_SERVICE`: Cloud Run service name
- `_IMAGE`: Container image path

### Available Secrets
- `FONT_AWESOME_TOKEN`: Font Awesome Pro token
- `cai-frontend-env`: Application environment variables

## Support and Maintenance

### Regular Tasks
1. **Monthly**: Review and rotate secrets
2. **Weekly**: Check build performance and optimize
3. **Daily**: Monitor service health and logs

### Emergency Contacts
- DevOps Team: [Contact Information]
- Cloud Platform Team: [Contact Information]

### Useful Links
- [Google Cloud Console](https://console.cloud.google.com/home/dashboard?project=capabara-auth)
- [Cloud Build History](https://console.cloud.google.com/cloud-build/builds?project=capabara-auth)
- [Cloud Run Services](https://console.cloud.google.com/run?project=capabara-auth)
- [Secret Manager](https://console.cloud.google.com/security/secret-manager?project=capabara-auth)

---

**Last Updated**: July 28, 2025
**Version**: 1.0
**Maintainer**: Backend Team
