import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  getApiUrl,
  handleApiError,
  validateRequiredParams,
} from "../../../../utils/apiHelpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stellaId: string }> }
) {
  try {
    const { stellaId } = await params;

    // Validate required parameters
    const validationError = validateRequiredParams({ stellaId });
    if (validationError) {
      return validationError;
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    // Fetch user's stories from external API
    const response = await axios.get(
      `${getApiUrl()}/profiles/${stellaId}/stories`,
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
    const { stellaId } = await params;
    return handleApiError(
      error,
      `fetching stories for user ${stellaId}`,
      stellaId
    );
  }
}
