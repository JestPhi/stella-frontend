import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { stellaId: string } }
) {
  try {
    const { stellaId } = params;

    if (!stellaId) {
      return NextResponse.json(
        { error: "stellaId is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Forward the request to the external API
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_NEXT_PUBLIC_STELLA_APP_HOST}/users/${stellaId}/stories`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error creating story for user ${params.stellaId}:`, error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Failed to create story";

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { stellaId: string } }
) {
  try {
    const { stellaId } = params;

    if (!stellaId) {
      return NextResponse.json(
        { error: "stellaId is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { storyId, ...updateData } = body;

    if (!storyId) {
      return NextResponse.json(
        { error: "storyId is required in request body" },
        { status: 400 }
      );
    }

    // Forward the request to the external API
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_NEXT_PUBLIC_STELLA_APP_HOST}/users/${stellaId}/stories/${storyId}`,
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error updating story for user ${params.stellaId}:`, error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Failed to update story";

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
