import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

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

    // Forward the request to the external API
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profiles/${stellaId}/username`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(
      `Error updating username for user ${params.stellaId}:`,
      error
    );

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || "Failed to update username";

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
