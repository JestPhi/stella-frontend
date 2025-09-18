# Cloud Build Trigger Configuration

# Use this as a reference when setting up your Cloud Build trigger in the GCP Console

# Trigger Configuration:

name: "stella-web-production-trigger"
description: "Automated build and deploy for stella-web on main branch"

# Source Configuration:

github:
owner: "JestPhi" # Replace with your GitHub username/organization
name: "stella-web" # Replace with your repository name
push:
branch: "^main$" # Trigger on pushes to main branch

# Build Configuration:

filename: "cloudbuild.yaml"

# Substitution Variables (set these in the GCP Console):

# These override the default values in cloudbuild.yaml

substitutions:

# 🔒 Server-side only variables (set these in Secret Manager instead)

\_STELLA_APP_HOST: "https://your-actual-backend-api.com"

# 🌐 Client-side safe variables (these get built into the app)

\_STORJ_PUBLIC_URL: "https://link.storjshare.io/your-actual-bucket"
\_FIREBASE_API_KEY: "your-actual-firebase-api-key"
\_FIREBASE_AUTH_DOMAIN: "your-actual-project.firebaseapp.com"
\_FIREBASE_PROJECT_ID_PUBLIC: "your-actual-firebase-project-id"
\_REACT_NATIVE_HOST: "https://your-actual-app-domain.com"

# Required IAM permissions for Cloud Build service account:

# - Cloud Run Admin

# - Service Account User

# - Storage Admin (for Artifact Registry)

# - Secret Manager Secret Accessor (if using secrets)

# Required APIs to enable:

# - Cloud Build API

# - Cloud Run API

# - Artifact Registry API (or Container Registry API)

# - Secret Manager API (if using secrets)

# Setup Steps:

# 1. Enable required APIs in your GCP project

# 2. Create secrets in Secret Manager for sensitive data:

# - stella-firebase-project-id

# - stella-firebase-client-email

# - stella-firebase-private-key

# 3. Grant Cloud Build service account necessary permissions

# 4. Create this trigger in Cloud Build console

# 5. Update substitution variables with your actual values

# 6. Test the trigger by pushing to main branch
