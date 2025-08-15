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

    // Get the form data from the request
    const formData = await request.formData();

    // Forward the request to the external API
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/users/${stellaId}/stories/${storyId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds for file uploads
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error uploading image for story ${params.storyId}:`, error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || "Failed to upload story image";

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
