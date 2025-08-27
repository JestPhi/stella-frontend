import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/profiles - Create a new profile using firebaseId
 * This is separate from the [stellaId] route because stellaId doesn't exist yet
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseId, username } = body;

    if (!firebaseId || !username) {
      return NextResponse.json(
        { error: "firebaseId and username are required" },
        { status: 400 }
      );
    }

    // Extract Firebase token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Firebase token is required" },
        { status: 401 }
      );
    }

    const firebaseToken = authHeader.replace("Bearer ", "");

    // Forward request to external API for profile creation
    const externalApiUrl = process.env.STELLA_APP_HOST;
    if (!externalApiUrl) {
      console.error("STELLA_APP_HOST environment variable is not set");
      throw new Error("STELLA_APP_HOST environment variable is not set");
    }

    console.log(`Creating profile at: ${externalApiUrl}/profiles`);

    const response = await fetch(`${externalApiUrl}/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify({
        firebaseId,
        username,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `External API error: ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    // This should return the newly created profile with stellaId
    return NextResponse.json(data);
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
