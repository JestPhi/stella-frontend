import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stellaId: string }> }
) {
  const { stellaId } = await params;

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    if (!stellaId) {
      return NextResponse.json(
        { error: "stellaId is required" },
        { status: 400 }
      );
    }

    // Fetch user's stories from external API
    const response = await axios.get(
      `${process.env.STELLA_APP_HOST}/profiles/${stellaId}/stories`,
      {
        params: { page, limit },
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    // Cache response for 5 minutes
    const headers = new Headers({
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      "Content-Type": "application/json",
    });

    // Return the stories data
    return new NextResponse(
      JSON.stringify({
        stories: response.data.stories || [],
        pagination: response.data.pagination || null,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error(`Error fetching stories for user ${stellaId}:`, error);

    // Handle specific error types
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || "Failed to fetch user stories";

      return NextResponse.json(
        {
          error: message,
          stories: [],
        },
        { status }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        stories: [],
      },
      { status: 500 }
    );
  }
}
