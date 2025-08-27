import axios from "axios";
import { NextRequest } from "next/server";
import {
  createSuccessResponse,
  getApiUrl,
  handleApiError,
} from "../../utils/apiHelpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const apiUrl = getApiUrl();
    const response = await axios.get(`${apiUrl}/stories`, {
      params: { page, limit },
      timeout: 10000,
    });

    return createSuccessResponse(
      {
        stories: response.data.stories || [],
        pagination: response.data.pagination || null,
      },
      300 // Cache for 5 minutes
    );
  } catch (error) {
    return handleApiError(
      error,
      "fetching stories",
      undefined,
      "Failed to fetch stories"
    );
  }
}
