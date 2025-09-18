import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  getApiUrl,
  handleApiError,
  validateRequiredParams,
} from "../../../../../../utils/apiHelpers";
import {
  createAuthHeaders,
  extractFirebaseToken,
} from "../../../../../../utils/authHelpers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ stellaId: string; storyId: string }> }
) {
  try {
    const { stellaId, storyId } = await params;

    // Validate required parameters
    const validationError = validateRequiredParams({ stellaId, storyId });
    if (validationError) {
      return validationError;
    }

    // Extract Firebase token
    const tokenResult = extractFirebaseToken(request);
    if (tokenResult instanceof NextResponse) {
      return tokenResult; // Return the error response
    }
    const token = tokenResult; // It's a string

    // Get the form data from the request
    const formData = await request.formData();

    // Forward the request to the external API with authentication
    const response = await axios.post(
      `${getApiUrl()}/profiles/${stellaId}/stories/${storyId}/images`,
      formData,
      {
        headers: {
          ...createAuthHeaders(token),
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds for file uploads
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    const { stellaId, storyId } = await params;
    return handleApiError(
      error,
      `uploading image for story ${storyId}`,
      `${stellaId}/${storyId}`
    );
  }
}
