import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stellaId: string }> }
) {
  const { stellaId } = await params;

  try {
    if (!stellaId) {
      return NextResponse.json(
        { error: "stellaId is required" },
        { status: 400 }
      );
    }

    // Fetch profile data from external API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profiles/${stellaId}`,
      {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    // Cache response for 10 minutes (profiles change less frequently than stories)
    const headers = new Headers({
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
      "Content-Type": "application/json",
    });

    // Return the profile data
    return new NextResponse(
      JSON.stringify({
        profile: response.data.profile || null,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error(`Error fetching profile for user ${stellaId}:`, error);

    // Handle specific error types
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || "Failed to fetch profile";

      return NextResponse.json(
        {
          error: message,
          profile: null,
        },
        { status }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        profile: null,
      },
      { status: 500 }
    );
  }
}
