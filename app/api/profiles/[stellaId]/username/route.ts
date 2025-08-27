import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  createSuccessResponse,
  getApiUrl,
  handleApiError,
  validateRequiredParams,
} from "../../../../utils/apiHelpers";
import {
  createAuthHeaders,
  extractFirebaseToken,
} from "../../../../utils/authHelpers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ stellaId: string }> }
) {
  const { stellaId } = await params;

  try {
    // Validate required parameters
    const validationError = validateRequiredParams({ stellaId });
    if (validationError) return validationError;

    const body = await request.json();

    // Extract and validate Firebase token
    const tokenResult = extractFirebaseToken(request);
    if (tokenResult instanceof NextResponse) {
      return tokenResult; // Return error response if token is invalid
    }
    const firebaseToken = tokenResult;

    // Get API URL using helper
    const apiUrl = getApiUrl();

    const response = await axios.patch(
      `${apiUrl}/profiles/${stellaId}/username`,
      body,
      {
        headers: createAuthHeaders(firebaseToken),
        timeout: 10000,
      }
    );

    return createSuccessResponse(response.data);
  } catch (error) {
    return handleApiError(
      error,
      "updating username",
      `user ${stellaId}`,
      "Failed to update username"
    );
  }
}
