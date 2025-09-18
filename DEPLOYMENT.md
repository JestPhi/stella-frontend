# Docker & Google Cloud Deployment Guide

## Local Development with Docker

### Prerequisites

- Docker and Docker Compose installed
- Environment variables configured

### Build and Run Locally

```bash
# Build the Docker image
docker build -t stella-web .

# Run with Docker Compose
docker-compose up

# Or run directly
docker run -p 3000:3000 --env-file .env stella-web
```

### Environment Variables

Create a `.env` file with:

```
NEXT_PUBLIC_STELLA_APP_HOST=http://localhost:3000
NEXT_PUBLIC_STORJ_PUBLIC_URL=your-storj-url
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
```

## Google Cloud Deployment

### Prerequisites

1. Google Cloud SDK installed
2. Project created on Google Cloud Console
3. Cloud Build and Cloud Run APIs enabled
4. Container Registry API enabled

### Setup Commands

```bash
# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Configure Docker for Google Cloud
gcloud auth configure-docker
```

### Manual Deployment

```bash
# Build and push to Container Registry
docker build -t gcr.io/YOUR_PROJECT_ID/stella-web .
docker push gcr.io/YOUR_PROJECT_ID/stella-web

# Deploy to Cloud Run
gcloud run deploy stella-web \
  --image gcr.io/YOUR_PROJECT_ID/stella-web \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production
```

### Automated Deployment with Cloud Build

1. Update the `cloudbuild.yaml` substitutions with your actual values
2. Connect your repository to Cloud Build
3. Set up build triggers for automatic deployment

### Environment Variables on Cloud Run

Set these in Cloud Run environment variables:

- `NODE_ENV=production`
- `NEXT_PUBLIC_STELLA_APP_HOST=https://your-app-url.run.app`
- `NEXT_PUBLIC_STORJ_PUBLIC_URL=your-storj-url`
- `NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id`

### Monitoring

- Health check endpoint: `/api/health`
- Logs available in Cloud Logging
- Metrics available in Cloud Monitoring

### Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service stella-web \
  --domain your-domain.com \
  --region us-central1
```

## Docker Image Optimization

The Dockerfile uses:

- Multi-stage builds for smaller image size
- Next.js standalone output for optimal performance
- Non-root user for security
- Health checks for container orchestration

## Troubleshooting

- Check container logs: `docker logs <container-id>`
- Cloud Run logs: `gcloud logging read "resource.type=cloud_run_revision"`
- Build logs: `gcloud builds log <build-id>`
