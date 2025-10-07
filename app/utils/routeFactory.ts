import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { extractAndVerifyFirebaseToken } from "./tokenVerification";

/**
 * Get the external API URL from environment variables
 */
function getApiUrl(): string {
  const apiUrl = process.env.STELLA_BACKEND_HOST;
  if (!apiUrl) {
    throw new Error("STELLA_BACKEND_HOST environment variable is not set");
  }
  return apiUrl;
}

/**
 * Handle API errors consistently across endpoints
 */
function handleApiError(
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
 */
function validateRequiredParams(
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
 * Create a standardized success response with optional caching and ETags
 */
function createSuccessResponse(data: any, cacheMaxAge?: number) {
  const headers: Record<string, string> = {};

  // Generate ETag from content hash
  const dataString = JSON.stringify(data);
  const etag = `"${simpleHash(dataString)}"`;
  headers["ETag"] = etag;

  if (cacheMaxAge) {
    headers[
      "Cache-Control"
    ] = `public, s-maxage=${cacheMaxAge}, stale-while-revalidate=${Math.floor(
      cacheMaxAge / 5
    )}`;
  }

  return NextResponse.json(data, { status: 200, headers });
}

/**
 * Simple hash function for ETag generation
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Helper function to extract and validate Firebase token from request headers
 */
function extractFirebaseToken(request: NextRequest): string | NextResponse {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Firebase token is required" },
      { status: 401 }
    );
  }

  return authHeader.replace("Bearer ", "");
}

/**
 * Helper function to create axios headers with Firebase token
 */
function createAuthHeaders(firebaseToken: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${firebaseToken}`,
  };
}

/**
 * Rate limiting configurations for different route types
 */
const RATE_LIMITS = {
  // Public read-only routes (higher limits)
  PUBLIC_READ: { maxRequests: 6000, windowMs: 60000 }, // 6000/min (increased from 2000)

  // Health check (very high limits)
  HEALTH: { maxRequests: 10000, windowMs: 60000 }, // 10000/min (increased from 1000)

  // Authentication routes (moderate limits)
  AUTH: { maxRequests: 1000, windowMs: 60000 }, // 1000/min (increased from 300)

  // Profile creation (relaxed limits)
  PROFILE_CREATE: { maxRequests: 500, windowMs: 60000 }, // 500/min (increased from 50)

  // Content modification (higher limits)
  CONTENT_MODIFY: { maxRequests: 2000, windowMs: 60000 }, // 2000/min (increased from 600)

  // Image uploads (relaxed limits)
  IMAGE_UPLOAD: { maxRequests: 1000, windowMs: 60000 }, // 1000/min (increased from 200)

  // General API (default)
  DEFAULT: { maxRequests: 1000, windowMs: 60000 }, // 1000/min (increased from 100)
} as const;

/**
 * Rate limiting middleware (in-memory)
 */
function createRateLimiter() {
  const requestCounts = new Map<string, { count: number; resetTime: number }>();

  // Cleanup expired entries every minute
  setInterval(() => {
    const now = Date.now();
    requestCounts.forEach((value, key) => {
      if (now > value.resetTime) {
        requestCounts.delete(key);
      }
    });
  }, 60000);

  return (
    request: NextRequest,
    maxRequests = 100,
    windowMs = 60000
  ): NextResponse | null => {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") || // Cloudflare
      request.headers.get("x-client-ip") ||
      "unknown";

    const now = Date.now();
    const userRequests = requestCounts.get(ip);

    if (!userRequests || now > userRequests.resetTime) {
      requestCounts.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return null; // Allow request
    }

    if (userRequests.count >= maxRequests) {
      const retryAfter = Math.ceil((userRequests.resetTime - now) / 1000);
      return NextResponse.json(
        {
          error: "Too many requests",
          retryAfter,
          limit: maxRequests,
          window: windowMs / 1000,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": userRequests.resetTime.toString(),
          },
        }
      );
    }

    userRequests.count++;
    return null; // Allow request
  };
}

/**
 * Apply rate limiting with headers
 */
function withRateLimit(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>,
  rateLimit: (typeof RATE_LIMITS)[keyof typeof RATE_LIMITS] = RATE_LIMITS.DEFAULT
) {
  const rateLimiter = createRateLimiter();

  return async (
    request: NextRequest,
    ...args: any[]
  ): Promise<NextResponse> => {
    // Check rate limit
    const rateLimitResponse = rateLimiter(
      request,
      rateLimit.maxRequests,
      rateLimit.windowMs
    );

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Call original handler
    const response = await handler(request, ...args);

    // Add rate limit headers to successful responses
    response.headers.set("X-RateLimit-Limit", rateLimit.maxRequests.toString());
    response.headers.set(
      "X-RateLimit-Window",
      (rateLimit.windowMs / 1000).toString()
    );

    return response;
  };
}

/**
 * Configuration for route middleware
 */
export interface RouteConfig {
  /** Require Firebase authentication */
  requireAuth?: boolean;
  /** Validate resource ownership (stellaId matches authenticated user) */
  validateOwnership?: boolean;
  /** Required parameters to validate */
  params?: string[];
  /** Rate limiting configuration */
  rateLimit?: (typeof RATE_LIMITS)[keyof typeof RATE_LIMITS];
  /** Cache duration in seconds */
  cache?: number;
  /** Custom timeout for external API calls */
  timeout?: number;
}

/**
 * Enhanced context passed to route handlers
 */
export interface RouteContext {
  /** Validated parameters from URL */
  params: Record<string, string>;
  /** Firebase token (if authenticated) */
  token?: string;
  /** User ID from Firebase token */
  userId?: string;
  /** External API URL */
  apiUrl: string;
  /** Query parameters */
  query: URLSearchParams;
  /** Request body (for POST/PATCH) */
  body?: any;
  /** Form data (for file uploads) */
  formData?: FormData;
}

/**
 * Route handler function signature
 */
export type RouteHandler = (
  request: NextRequest,
  context: RouteContext
) => Promise<any>;

/**
 * Create a standardized route handler with middleware
 */
export function createRoute(config: RouteConfig = {}) {
  return function (handler: RouteHandler) {
    // Rate limiting disabled for development
    return async (request: NextRequest, routeParams: any) => {
      try {
        // Extract and validate parameters
        const params = (await routeParams?.params) || {};
        const context: RouteContext = {
          params,
          apiUrl: getApiUrl(),
          query: new URL(request.url).searchParams,
        };

        // Validate required parameters
        if (config.params?.length) {
          const validationError = validateRequiredParams(
            Object.fromEntries(
              config.params.map((param) => [param, params[param]])
            )
          );
          if (validationError) return validationError;
        }

        // Handle authentication
        if (config.requireAuth) {
          const tokenResult = await extractAndVerifyFirebaseToken(request);
          if (tokenResult instanceof NextResponse) {
            return tokenResult;
          }

          context.token = tokenResult.token;
          context.userId = tokenResult.userId; // Now contains the actual Firebase user ID

          // Validate resource ownership
          if (config.validateOwnership && params.stellaId) {
            // Backend already handles ownership validation, so we'll skip it here
            // The backend will return 403 if the user doesn't own the resource
            console.log(
              `Delegating ownership validation to backend for stellaId: ${params.stellaId}, userId: ${context.userId}`
            );
          }
        }

        // Parse request body for POST/PATCH
        if (["POST", "PATCH"].includes(request.method)) {
          const contentType = request.headers.get("content-type");
          if (contentType?.includes("multipart/form-data")) {
            context.formData = await request.formData();
          } else if (contentType?.includes("application/json")) {
            context.body = await request.json().catch(() => ({}));
          }
        }

        // Call the actual handler
        const result = await handler(request, context);

        // Handle null/undefined results
        if (result === null || result === undefined) {
          return NextResponse.json({ success: true });
        }

        // Check for conditional requests (If-None-Match)
        if (request.method === "GET") {
          const dataString = JSON.stringify(result);
          const etag = `"${simpleHash(dataString)}"`;
          const ifNoneMatch = request.headers.get("if-none-match");

          if (ifNoneMatch === etag) {
            // Content hasn't changed - return 304 Not Modified
            return new NextResponse(null, {
              status: 304,
              headers: {
                ETag: etag,
                "Cache-Control": config.cache
                  ? `public, s-maxage=${
                      config.cache
                    }, stale-while-revalidate=${Math.floor(config.cache / 5)}`
                  : "",
              },
            });
          }
        }

        // Format response
        if (config.cache) {
          return createSuccessResponse(result, config.cache);
        }

        return NextResponse.json(result);
      } catch (error: any) {
        // Handle validation errors with 400 status
        if (
          error.message?.includes("Invalid") ||
          error.message?.includes("required")
        ) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return handleApiError(
          error,
          `${request.method} ${new URL(request.url).pathname}`,
          JSON.stringify((await routeParams?.params) || {})
        );
      }
    }; // Rate limiting disabled
  };
}

/**
 * HTTP client for external API calls with request deduplication and caching
 */
export class ApiClient {
  private inflightRequests = new Map<string, Promise<any>>();
  private queryCache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 10 * 60 * 1000; // Increased to 10 minutes (aggressive)

  constructor(
    private baseUrl: string,
    private defaultTimeout: number = 10000
  ) {}

  private createConfig(token?: string, timeout?: number) {
    return {
      timeout: timeout || this.defaultTimeout,
      headers: token
        ? createAuthHeaders(token)
        : {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
    };
  }

  private getCacheKey(path: string, token?: string): string {
    return `${path}:${token || "public"}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.queryCache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_TTL) {
      this.queryCache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any): void {
    this.queryCache.set(key, { data, timestamp: Date.now() });

    // Aggressive caching - keep last 500 entries instead of 100
    if (this.queryCache.size > 500) {
      const firstKey = this.queryCache.keys().next().value;
      if (firstKey) {
        this.queryCache.delete(firstKey);
      }
    }
  }

  async get(path: string, token?: string, timeout?: number) {
    const cacheKey = this.getCacheKey(path, token);

    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Check for in-flight request
    const inflightKey = cacheKey;
    if (this.inflightRequests.has(inflightKey)) {
      return this.inflightRequests.get(inflightKey);
    }

    // Make new request
    const promise = axios
      .get(`${this.baseUrl}${path}`, this.createConfig(token, timeout))
      .then((response) => {
        this.inflightRequests.delete(inflightKey);
        this.setCache(cacheKey, response.data);
        return response.data;
      })
      .catch((error) => {
        this.inflightRequests.delete(inflightKey);
        throw error;
      });

    this.inflightRequests.set(inflightKey, promise);
    return promise;
  }

  async post(path: string, data: any, token?: string, timeout?: number) {
    const config = this.createConfig(token, timeout);

    // Handle form data uploads
    if (data instanceof FormData) {
      config.headers = {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      };
    }

    // Invalidate cache for this path on POST
    const cacheKey = this.getCacheKey(path, token);
    this.queryCache.delete(cacheKey);

    const response = await axios.post(`${this.baseUrl}${path}`, data, config);
    return response.data;
  }

  async patch(path: string, data: any, token?: string, timeout?: number) {
    // Invalidate cache for this path on PATCH
    const cacheKey = this.getCacheKey(path, token);
    this.queryCache.delete(cacheKey);

    const response = await axios.patch(
      `${this.baseUrl}${path}`,
      data,
      this.createConfig(token, timeout)
    );
    return response.data;
  }

  async delete(path: string, token?: string, timeout?: number) {
    // Invalidate cache for this path on DELETE
    const cacheKey = this.getCacheKey(path, token);
    this.queryCache.delete(cacheKey);

    const response = await axios.delete(
      `${this.baseUrl}${path}`,
      this.createConfig(token, timeout)
    );
    return response.data;
  }

  // Clear all caches (useful for logout or force refresh)
  clearCache(): void {
    this.queryCache.clear();
    this.inflightRequests.clear();
  }
}

/**
 * Validation schemas for common parameters
 */
export const ValidationSchemas = {
  pagination: (query: URLSearchParams) => {
    const page = parseInt(query.get("page") || "1");
    const limit = parseInt(query.get("limit") || "20");

    if (isNaN(page) || page < 1) {
      throw new Error("Invalid page parameter");
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      throw new Error("Invalid limit parameter (must be 1-100)");
    }

    return { page, limit };
  },
};

/**
 * Create a global API client instance
 */
export const apiClient = new ApiClient(
  process.env.STELLA_BACKEND_HOST || "http://localhost:3000"
);

/**
 * Pre-configured route types for common patterns
 */
export const RouteTypes = {
  /** Public read-only routes (stories, profiles) */
  PUBLIC_READ: {
    requireAuth: false,
    rateLimit: RATE_LIMITS.PUBLIC_READ,
    cache: 300,
  },

  /** Protected content modification - ownership validation delegated to backend */
  PROTECTED_MODIFY: {
    requireAuth: true,
    validateOwnership: true, // Logged but not enforced - backend handles actual validation
    rateLimit: RATE_LIMITS.CONTENT_MODIFY,
  },

  /** Image upload routes - ownership validation delegated to backend */
  IMAGE_UPLOAD: {
    requireAuth: true,
    validateOwnership: true, // Logged but not enforced - backend handles actual validation
    rateLimit: RATE_LIMITS.IMAGE_UPLOAD,
    timeout: 30000,
  },

  /** Profile creation */
  PROFILE_CREATE: {
    requireAuth: true,
    rateLimit: RATE_LIMITS.PROFILE_CREATE,
  },

  /** Health check */
  HEALTH: {
    requireAuth: false,
    rateLimit: RATE_LIMITS.HEALTH,
  },
} as const;
