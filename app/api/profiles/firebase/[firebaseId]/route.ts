import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/profiles/firebase/[firebaseId] - Get profile by Firebase ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ firebaseId: string }> }
) {
  try {
    const { firebaseId } = await params;

    if (!firebaseId) {
      return NextResponse.json(
        { error: "Firebase ID is required" },
        { status: 400 }
      );
    }

    // Forward request to external API
    const externalApiUrl = process.env.STELLA_APP_HOST;
    if (!externalApiUrl) {
      console.error("STELLA_APP_HOST environment variable is not set");
      throw new Error("STELLA_APP_HOST environment variable is not set");
    }

    console.log(
      `Fetching profile by Firebase ID: ${externalApiUrl}/profiles/firebase/${firebaseId}`
    );

    const response = await fetch(
      `${externalApiUrl}/profiles/firebase/${firebaseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ profile: null }, { status: 200 });
      }

      const errorData = await response.text();
      return NextResponse.json(
        { error: `External API error: ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
