import { App, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let adminApp: App | null = null;

/**
 * Initialize Firebase Admin SDK
 * For now, we'll use a simplified approach without service account credentials
 * In production, you should use proper service account credentials
 */
export function getFirebaseAdmin() {
  if (adminApp) {
    return adminApp;
  }

  // Check if already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  // Initialize with project ID only (limited functionality)
  // In production, you should use service account credentials
  adminApp = initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });

  return adminApp;
}

/**
 * Verify Firebase ID token and extract user information
 * @param idToken - The Firebase ID token to verify
 * @returns User information from the token
 */
export async function verifyFirebaseToken(idToken: string) {
  try {
    const app = getFirebaseAdmin();
    const auth = getAuth(app);

    // Verify the token
    const decodedToken = await auth.verifyIdToken(idToken);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture,
      firebaseUserId: decodedToken.uid, // This is the actual Firebase user ID we need
    };
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    throw new Error("Invalid or expired token");
  }
}

/**
 * Extract Firebase user ID from token without full verification
 * This is a fallback method that decodes the JWT without verification
 * Use this only for development or when Admin SDK credentials are not available
 */
export function extractFirebaseUserId(idToken: string): string | null {
  try {
    // Split the JWT token
    const parts = idToken.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));

    // Return the user ID (subject)
    return payload.sub || payload.user_id || null;
  } catch (error) {
    console.error("Error extracting user ID from token:", error);
    return null;
  }
}
