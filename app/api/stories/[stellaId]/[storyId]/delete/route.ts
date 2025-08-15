import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

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

    // Forward the delete request to the external API
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/users/${stellaId}/stories/${storyId}`,
      {
        timeout: 10000,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(
      `Error deleting story ${params.storyId} for user ${params.stellaId}:`,
      error
    );

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Failed to delete story";

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
