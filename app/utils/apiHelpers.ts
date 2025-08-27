import axios from "axios";
import { NextResponse } from "next/server";

/**
 * Get the external API URL from environment variables
 * @returns The API URL
 * @throws Error if environment variable is not set
 */
export function getApiUrl(): string {
  const apiUrl = process.env.STELLA_APP_HOST;
  if (!apiUrl) {
    throw new Error("STELLA_APP_HOST environment variable is not set");
  }
  return apiUrl;
}

/**
 * Handle API errors consistently across endpoints
 * @param error - The error object
 * @param operation - Description of the operation (e.g., "fetching profile", "updating bio")
 * @param resourceId - ID of the resource being operated on (optional)
 * @param defaultErrorMessage - Custom default error message
 * @returns NextResponse with error details
 */
export function handleApiError(
  error: any,
  operation: string,
  resourceId?: string,
  defaultErrorMessage?: string
) {
  const logMessage = resourceId
    ? `Error ${operation} for ${resourceId}:`
    : `Error ${operation}:`;

  console.error(logMessage, error);

  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      defaultErrorMessage ||
      `Failed to ${operation}`;
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

/**
 * Validate required parameters and return error response if missing
 * @param params - Object with parameter names and values
 * @returns NextResponse with error if validation fails, null if valid
 */
export function validateRequiredParams(
  params: Record<string, any>
): NextResponse | null {
  for (const [name, value] of Object.entries(params)) {
    if (!value) {
      return NextResponse.json(
        { error: `${name} is required` },
        { status: 400 }
      );
    }
  }
  return null;
}

/**
 * Create a standardized success response with optional caching
 * @param data - The response data
 * @param cacheMaxAge - Cache max age in seconds (optional)
 * @returns NextResponse with data and headers
 */
export function createSuccessResponse(data: any, cacheMaxAge?: number) {
  const headers: Record<string, string> = {};

  if (cacheMaxAge) {
    headers[
      "Cache-Control"
    ] = `public, s-maxage=${cacheMaxAge}, stale-while-revalidate=${Math.floor(
      cacheMaxAge / 5
    )}`;
  }

  return NextResponse.json(data, { status: 200, headers });
}
