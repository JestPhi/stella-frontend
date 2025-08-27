import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stellaId: string; storyId: string }> }
) {
  const { stellaId, storyId } = await params;

  try {
    if (!stellaId || !storyId) {
      return NextResponse.json(
        { error: "stellaId and storyId are required" },
        { status: 400 }
      );
    }

    // Fetch story data from external API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_NEXT_PUBLIC_STELLA_APP_HOST}/profiles/${stellaId}/stories/${storyId}`,
      {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    // Cache response for 2 minutes (stories are more dynamic)
    const headers = new Headers({
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60",
      "Content-Type": "application/json",
    });

    // Return the story data
    return new NextResponse(
      JSON.stringify({
        story: response.data.story || null,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error(
      `Error fetching story ${storyId} for user ${stellaId}:`,
      error
    );

    // Handle specific error types
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Failed to fetch story";

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
