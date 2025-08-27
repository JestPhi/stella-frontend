import axios from "axios";
import { NextRequest } from "next/server";
import {
  createSuccessResponse,
  getApiUrl,
  handleApiError,
  validateRequiredParams,
} from "../../../utils/apiHelpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stellaId: string }> }
) {
  const { stellaId } = await params;

  try {
    // Validate required parameters
    const validationError = validateRequiredParams({ stellaId });
    if (validationError) return validationError;

    const apiUrl = getApiUrl();
    const response = await axios.get(`${apiUrl}/profiles/${stellaId}`, {
      timeout: 10000,
    });

    return createSuccessResponse(
      { profile: response.data || null },
      600 // Cache for 10 minutes
    );
  } catch (error) {
    return handleApiError(
      error,
      "fetching profile",
      `user ${stellaId}`,
      "Failed to fetch profile"
    );
  }
}
