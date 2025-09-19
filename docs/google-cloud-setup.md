# Google Cloud Deployment Setup Guide

This guide helps you set up automated deployments for your Next.js application using Google Cloud Build and Cloud Run.

## Prerequisites

1. **Google Cloud Project** with billing enabled
2. **GitHub repository** connected to Google Cloud Build
3. **Docker** installed locally (for testing)
4. **gcloud CLI** installed and authenticated

## Step 1: Enable Required APIs

```bash
# Enable required Google Cloud APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

## Step 2: Set Up Secret Manager

Store sensitive environment variables in Google Cloud Secret Manager:

```bash
# Create secrets for Firebase credentials
echo -n "your-firebase-project-id" | gcloud secrets create stella-firebase-project-id --data-file=-
echo -n "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com" | gcloud secrets create stella-firebase-client-email --data-file=-
echo -n "-----BEGIN PRIVATE KEY-----\nYour actual private key here\n-----END PRIVATE KEY-----" | gcloud secrets create stella-firebase-private-key --data-file=-
```

## Step 3: Grant Cloud Build Permissions

```bash
# Get your project number
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)")

# Grant Cloud Build service account necessary permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

## Step 4: Create Cloud Build Trigger

### Option A: Using gcloud CLI

```bash
gcloud builds triggers create github \
    --repo-name=stella-web \
    --repo-owner=JestPhi \
    --branch-pattern="^main$" \
    --build-config=cloudbuild.yaml \
    --substitutions=_STELLA_APP_HOST="https://your-backend-api.com",_FIREBASE_API_KEY="your-api-key",_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com",_FIREBASE_PROJECT_ID_PUBLIC="your-project-id",_STORJ_PUBLIC_URL="https://your-storj-url.com",_REACT_NATIVE_HOST="https://your-app-domain.com"
```

### Option B: Using Google Cloud Console

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Click "Create Trigger"
3. Configure:
   - **Name**: `stella-web-production`
   - **Event**: Push to a branch
   - **Source**: Connect your GitHub repository
   - **Branch**: `^main$`
   - **Configuration**: Cloud Build configuration file
   - **Location**: `cloudbuild.yaml`
4. Add substitution variables (see below)

## Step 5: Configure Substitution Variables

In your Cloud Build trigger, set these substitution variables:

### Required Variables:

```
_STELLA_APP_HOST = https://your-backend-api.com
_FIREBASE_API_KEY = AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
_FIREBASE_PROJECT_ID_PUBLIC = your-firebase-project-id
_STORJ_PUBLIC_URL = https://link.storjshare.io/your-bucket
_REACT_NATIVE_HOST = https://your-app-domain.com
```

## Step 6: Test Local Build

Before pushing to production, test your Docker build locally:

```bash
# Build the Docker image
docker build -t stella-web:test .

# Run the container
docker run -p 3000:3000 -e NODE_ENV=production stella-web:test

# Test the application at http://localhost:3000
```

## Step 7: Deploy

Push your code to the main branch to trigger the automated build and deployment:

```bash
git add .
git commit -m "Add Cloud Build configuration"
git push origin main
```

## Monitoring and Logs

### View Build Logs:

- Go to [Cloud Build History](https://console.cloud.google.com/cloud-build/builds)
- Click on your build to see detailed logs

### View Application Logs:

```bash
# View Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=stella-web" --limit=50

# Follow logs in real-time
gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=stella-web"
```

### Monitor Performance:

- Go to [Cloud Run Services](https://console.cloud.google.com/run)
- Click on your service to see metrics and performance data

## Environment Variables Reference

### Build-time Variables (NEXT*PUBLIC*\*)

These are baked into the client-side bundle and are publicly visible:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_STORJ_PUBLIC_URL`
- `NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST`

### Runtime Variables (Server-side only)

These are only available on the server and should be kept secret:

- `STELLA_APP_HOST` - Your backend API URL
- `FIREBASE_PROJECT_ID` - Firebase project ID for admin SDK
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key

## Troubleshooting

### Common Issues:

1. **Build fails with "permission denied"**

   - Check Cloud Build service account permissions
   - Ensure it has Cloud Run Admin and Service Account User roles

2. **Secrets not found**

   - Verify secrets exist in Secret Manager
   - Check secret names match exactly in cloudbuild.yaml
   - Grant Cloud Build service account Secret Manager access

3. **Next.js build fails**

   - Check that all NEXT*PUBLIC* environment variables are set correctly
   - Verify TypeScript and lint checks pass locally

4. **Cloud Run deployment fails**
   - Check that the Docker image builds successfully
   - Verify the image exists in Container Registry/Artifact Registry
   - Check Cloud Run service configuration

### Useful Commands:

```bash
# Check build status
gcloud builds list --limit=10

# View specific build
gcloud builds describe BUILD_ID

# Check Cloud Run services
gcloud run services list

# View service details
gcloud run services describe stella-web --region=us-central1

# Update environment variables without rebuilding
gcloud run services update stella-web \
    --region=us-central1 \
    --set-env-vars="NEW_VAR=value"
```

## Security Best Practices

1. **Never commit secrets** to your repository
2. **Use Secret Manager** for sensitive data
3. **Set minimal IAM permissions** for service accounts
4. **Enable VPC connector** for internal network access if needed
5. **Use HTTPS** for all external API calls
6. **Validate all environment variables** in your application startup

## Cost Optimization

1. **Set appropriate resource limits** (CPU, memory)
2. **Configure auto-scaling** (min/max instances)
3. **Use concurrency settings** to optimize resource usage
4. **Monitor billing** and set up budget alerts
5. **Consider using Cloud Run jobs** for batch processing

## Next Steps

After successful deployment:

1. Set up monitoring and alerting
2. Configure custom domain and SSL certificate
3. Set up staging environment with separate trigger
4. Implement database migrations if needed
5. Set up backup and disaster recovery procedures
