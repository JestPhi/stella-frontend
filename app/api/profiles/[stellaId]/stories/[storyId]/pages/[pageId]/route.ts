import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  getApiUrl,
  handleApiError,
  validateRequiredParams,
} from "../../../../../../../utils/apiHelpers";
import {
  createAuthHeaders,
  extractFirebaseToken,
} from "../../../../../../../utils/authHelpers";

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
      return tokenResult;
    }
    const token = tokenResult;

    const body = await request.json();

    // Forward the request to the external API with authentication
    const response = await axios.post(
      `${getApiUrl()}/profiles/${stellaId}/stories/${storyId}/pages`,
      body,
      {
        headers: createAuthHeaders(token),
        timeout: 15000,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    const { stellaId, storyId } = await params;
    return handleApiError(
      error,
      `creating page for story ${storyId}`,
      `${stellaId}/${storyId}`
    );
  }
}

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ stellaId: string; storyId: string; pageId: string }> }
) {
  try {
    const { stellaId, storyId, pageId } = await params;

    // Validate required parameters
    const validationError = validateRequiredParams({
      stellaId,
      storyId,
      pageId,
    });
    if (validationError) {
      return validationError;
    }

    // Extract Firebase token
    const tokenResult = extractFirebaseToken(request);
    if (tokenResult instanceof NextResponse) {
      return tokenResult;
    }
    const token = tokenResult;

    const updateData = await request.json();

    // Forward the request to the external API with authentication
    const response = await axios.patch(
      `${getApiUrl()}/profiles/${stellaId}/stories/${storyId}/pages/${pageId}`,
      updateData,
      {
        headers: createAuthHeaders(token),
        timeout: 15000,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    const { stellaId, storyId, pageId } = await params;
    return handleApiError(
      error,
      `updating page ${pageId} for story ${storyId}`,
      `${stellaId}/${storyId}/${pageId}`
    );
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ stellaId: string; storyId: string; pageId: string }> }
) {
  try {
    const { stellaId, storyId, pageId } = await params;

    // Validate required parameters
    const validationError = validateRequiredParams({
      stellaId,
      storyId,
      pageId,
    });
    if (validationError) {
      return validationError;
    }

    // Extract Firebase token
    const tokenResult = extractFirebaseToken(request);
    if (tokenResult instanceof NextResponse) {
      return tokenResult;
    }
    const token = tokenResult;

    // Forward the request to the external API with authentication
    const response = await axios.delete(
      `${getApiUrl()}/profiles/${stellaId}/stories/${storyId}/pages/${pageId}`,
      {
        headers: createAuthHeaders(token),
        timeout: 10000,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    const { stellaId, storyId, pageId } = await params;
    return handleApiError(
      error,
      `deleting page ${pageId} for story ${storyId}`,
      `${stellaId}/${storyId}/${pageId}`
    );
  }
}
