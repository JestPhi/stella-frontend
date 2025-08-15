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

    // Get the form data from the request
    const formData = await request.formData();

    // Forward the request to the external API
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profiles/${stellaId}/images`,
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
    console.error(
      `Error uploading profile image for user ${params.stellaId}:`,
      error
    );

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || "Failed to upload profile image";

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

    // Forward the delete request to the external API
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profiles/${stellaId}/images`,
      {
        timeout: 10000,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(
      `Error deleting profile image for user ${params.stellaId}:`,
      error
    );

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || "Failed to delete profile image";

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
