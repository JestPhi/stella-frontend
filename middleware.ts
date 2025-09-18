import { NextRequest, NextResponse } from "next/server";

/**
 * Global middleware that runs before all API routes
 * Handles cross-cutting concerns like CORS, security headers, and basic logging
 */
export function middleware(request: NextRequest) {
  console.log(`${request.method} ${request.url} - ${new Date().toISOString()}`);

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Create response and add security headers
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // CORS headers for API responses
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export const config = {
  matcher: [
    // Match all API routes
    "/api/:path*",
    // Optionally match all routes for security headers
    // '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
