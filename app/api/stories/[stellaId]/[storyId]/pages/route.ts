import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { stellaId: string; storyId: string } }
) {
  try {
    const { stellaId, storyId } = params;

    if (!stellaId || !storyId) {
      return NextResponse.json(
        { error: "stellaId and storyId are required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Forward the request to the external API
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_NEXT_PUBLIC_STELLA_APP_HOST}/users/${stellaId}/stories/${storyId}/pages`,
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
    console.error(`Error creating page for story ${params.storyId}:`, error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Failed to create page";

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
  { params }: { params: { stellaId: string; storyId: string } }
) {
  try {
    const { stellaId, storyId } = params;

    if (!stellaId || !storyId) {
      return NextResponse.json(
        { error: "stellaId and storyId are required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { pageId, ...updateData } = body;

    if (!pageId) {
      return NextResponse.json(
        { error: "pageId is required in request body" },
        { status: 400 }
      );
    }

    // Forward the request to the external API
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_NEXT_PUBLIC_STELLA_APP_HOST}/users/${stellaId}/stories/${storyId}/pages/${pageId}`,
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
    console.error(`Error updating page for story ${params.storyId}:`, error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Failed to update page";

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { stellaId: string; storyId: string } }
) {
  try {
    const { stellaId, storyId } = params;

    if (!stellaId || !storyId) {
      return NextResponse.json(
        { error: "stellaId and storyId are required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId");

    if (!pageId) {
      return NextResponse.json(
        { error: "pageId is required as query parameter" },
        { status: 400 }
      );
    }

    // Forward the request to the external API
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_NEXT_PUBLIC_STELLA_APP_HOST}/users/${stellaId}/stories/${storyId}/pages/${pageId}`,
      {
        timeout: 10000,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error deleting page for story ${params.storyId}:`, error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Failed to delete page";

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
