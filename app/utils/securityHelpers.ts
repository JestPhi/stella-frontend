import { NextRequest, NextResponse } from "next/server";
import { extractFirebaseToken } from "./authHelpers";

/**
 * Middleware to validate Firebase token and user authorization
 */
export async function validateAuth(
  request: NextRequest,
  stellaId?: string
): Promise<
  | { success: true; token: string; userId: string }
  | { success: false; response: NextResponse }
> {
  try {
    // Extract Firebase token
    const tokenResult = extractFirebaseToken(request);
    if (tokenResult instanceof NextResponse) {
      return { success: false, response: tokenResult };
    }
    const token = tokenResult;

    // TODO: Validate token with Firebase Admin SDK
    // For now, we'll extract user ID from token payload (implement proper validation)
    const userId = await validateFirebaseToken(token);

    if (!userId) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        ),
      };
    }

    // Check if user is authorized to access this resource
    if (stellaId && userId !== stellaId) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Unauthorized: You can only access your own data" },
          { status: 403 }
        ),
      };
    }

    return { success: true, token, userId };
  } catch (error) {
    console.error("Auth validation error:", error);
    return {
      success: false,
      response: NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      ),
    };
  }
}

/**
 * Validate Firebase token (implement with Firebase Admin SDK)
 */
async function validateFirebaseToken(token: string): Promise<string | null> {
  try {
    // TODO: Implement Firebase Admin SDK token validation
    // const admin = require('firebase-admin');
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // return decodedToken.uid;

    // Temporary: decode JWT payload (NOT SECURE - implement proper validation)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id || payload.sub || null;
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}

/**
 * Validate that the authenticated user owns the resource
 * This requires mapping Firebase UID to stellaId
 */
async function validateResourceOwnership(
  firebaseUserId: string,
  stellaId: string
): Promise<boolean> {
  try {
    // TODO: Implement proper user lookup
    // This would typically involve:
    // 1. Query your user database to find user by Firebase UID
    // 2. Check if that user's stellaId matches the requested stellaId
    
    // For now, we'll assume Firebase UID === stellaId (temporary)
    // In production, replace this with actual database lookup
    return firebaseUserId === stellaId;
    
    /* Production implementation would look like:
    const user = await getUserByFirebaseId(firebaseUserId);
    return user && user.stellaId === stellaId;
    */
  } catch (error) {
    console.error("Resource ownership validation error:", error);
    return false;
  }
}

/**
 * Rate limiting middleware
 */
export function createRateLimiter() {
  const requestCounts = new Map<string, { count: number; resetTime: number }>();

  return (request: NextRequest, maxRequests = 100, windowMs = 60000) => {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const now = Date.now();

    const userRequests = requestCounts.get(ip);

    if (!userRequests || now > userRequests.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return null; // Allow request
    }

    if (userRequests.count >= maxRequests) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    userRequests.count++;
    return null; // Allow request
  };
}

/**
 * Input sanitization middleware
 */
export function sanitizeInput(data: any): any {
  if (typeof data === "string") {
    return data.trim().slice(0, 10000); // Limit string length
  }

  if (Array.isArray(data)) {
    return data.slice(0, 100).map(sanitizeInput); // Limit array size
  }

  if (data && typeof data === "object") {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (key.length > 100) continue; // Skip long keys
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  return data;
}
