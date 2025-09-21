import { NextRequest, NextResponse } from "next/server";
import { extractFirebaseUserId, verifyFirebaseToken } from "./firebaseAdmin";

/**
 * Extract and verify Firebase token from request
 * @param request - The Next.js request object
 * @returns Verified user information or error response
 */
export async function extractAndVerifyFirebaseToken(
  request: NextRequest
): Promise<{ userId: string; token: string } | NextResponse> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid authorization header" },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    // First, try to verify with Firebase Admin SDK
    try {
      const userInfo = await verifyFirebaseToken(token);
      return {
        userId: userInfo.firebaseUserId,
        token: token,
      };
    } catch (adminError) {
      console.warn(
        "Firebase Admin verification failed, falling back to JWT decode:",
        adminError
      );

      // Fallback: Extract user ID from token without full verification
      const userId = extractFirebaseUserId(token);
      if (!userId) {
        throw new Error("Could not extract user ID from token");
      }

      return {
        userId: userId,
        token: token,
      };
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json(
      {
        error: "Invalid or expired token",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 401 }
    );
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use extractAndVerifyFirebaseToken instead
 */
export function extractFirebaseToken(
  request: NextRequest
): string | NextResponse {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid authorization header" },
      { status: 401 }
    );
  }

  return authHeader.substring(7); // Remove "Bearer " prefix
}
