import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  createSuccessResponse,
  getApiUrl,
  handleApiError,
} from "../../utils/apiHelpers";

/**
 * GET /api/stories
 * Fetch all stories from all users with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    // Validate pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      return NextResponse.json(
        { error: "Invalid page parameter" },
        { status: 400 }
      );
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return NextResponse.json(
        { error: "Invalid limit parameter (must be 1-100)" },
        { status: 400 }
      );
    }

    // Fetch all stories from external API
    const response = await axios.get(`${getApiUrl()}/stories`, {
      params: { page: pageNum, limit: limitNum },
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // Return the stories data with caching
    return createSuccessResponse(
      {
        stories: response.data.stories || [],
        pagination: response.data.pagination || null,
      },
      300 // 5 minutes cache
    );
  } catch (error) {
    return handleApiError(error, "fetching all stories");
  }
}
