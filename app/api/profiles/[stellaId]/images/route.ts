import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  getApiUrl,
  handleApiError,
  validateRequiredParams,
} from "../../../../utils/apiHelpers";
import { extractFirebaseToken } from "../../../../utils/authHelpers";

// Common validation and setup for both endpoints
async function validateAndSetup(request: NextRequest, stellaId: string) {
  const validationError = validateRequiredParams({ stellaId });
  if (validationError) return validationError;

  const tokenResult = extractFirebaseToken(request);
  if (tokenResult instanceof NextResponse) {
    return tokenResult;
  }

  const apiUrl = getApiUrl();

  return { token: tokenResult, apiUrl };
}

// Common error handler
function handleError(error: any, operation: string, stellaId: string) {
  return handleApiError(error, operation, `user ${stellaId}`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { stellaId: string } }
) {
  try {
    const { stellaId } = params;
    const setup = await validateAndSetup(request, stellaId);

    if (setup instanceof NextResponse) return setup;

    const { token, apiUrl } = setup;
    const formData = await request.formData();

    const response = await axios.post(
      `${apiUrl}/profiles/${stellaId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return handleError(error, "uploading", params.stellaId);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { stellaId: string } }
) {
  try {
    const { stellaId } = params;
    const setup = await validateAndSetup(request, stellaId);

    if (setup instanceof NextResponse) return setup;

    const { token, apiUrl } = setup;

    const response = await axios.delete(
      `${apiUrl}/profiles/${stellaId}/images`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return handleError(error, "deleting", params.stellaId);
  }
}
