import { NextRequest, NextResponse } from "next/server";

/**
 * Helper function to extract and validate Firebase token from request headers
 */
export function extractFirebaseToken(
  request: NextRequest
): string | NextResponse {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Firebase token is required" },
      { status: 401 }
    );
  }

  return authHeader.replace("Bearer ", "");
}

/**
 * Helper function to create axios headers with Firebase token
 */
export function createAuthHeaders(firebaseToken: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${firebaseToken}`,
  };
}
