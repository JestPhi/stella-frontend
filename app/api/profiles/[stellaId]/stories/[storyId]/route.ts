import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  getApiUrl,
  handleApiError,
  validateRequiredParams,
} from "../../../../../utils/apiHelpers";
import {
  createAuthHeaders,
  extractFirebaseToken,
} from "../../../../../utils/authHelpers";

export async function GET(
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

    // Fetch story data from external API
    const response = await axios.get(
      `${getApiUrl()}/profiles/${stellaId}/stories/${storyId}`,
      {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    // Cache response for 2 minutes (stories are more dynamic)
    const headers = new Headers({
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60",
      "Content-Type": "application/json",
    });

    // Return the story data
    return new NextResponse(
      JSON.stringify({
        story: response.data.story || null,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    const { stellaId, storyId } = await params;
    return handleApiError(
      error,
      `fetching story ${storyId} for user ${stellaId}`,
      `${stellaId}/${storyId}`
    );
  }
}

export async function PATCH(
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
    const response = await axios.patch(
      `${getApiUrl()}/profiles/${stellaId}/stories/${storyId}`,
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
      `updating story ${storyId} for user ${stellaId}`,
      `${stellaId}/${storyId}`
    );
  }
}

export async function DELETE(
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

    // Forward the delete request to the external API with authentication
    const response = await axios.delete(
      `${getApiUrl()}/profiles/${stellaId}/stories/${storyId}`,
      {
        headers: createAuthHeaders(token),
        timeout: 10000,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    const { stellaId, storyId } = await params;
    return handleApiError(
      error,
      `deleting story ${storyId} for user ${stellaId}`,
      `${stellaId}/${storyId}`
    );
  }
}

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
      `${getApiUrl()}/profiles/${stellaId}/stories/${storyId}`,
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
      `creating story ${storyId} for user ${stellaId}`,
      `${stellaId}/${storyId}`
    );
  }
}
