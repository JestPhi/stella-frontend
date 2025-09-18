/**
 * @deprecated - This file has been replaced by routeFactory.ts
 *
 * All security helper functions have been migrated to the new route factory pattern.
 * For new API routes, use createRoute() from routeFactory.ts instead.
 *
 * Migration mapping:
 * - withRateLimit() -> automatic rate limiting middleware in routeFactory.ts
 * - RATE_LIMITS -> now defined in RouteTypes in routeFactory.ts
 * - validateAuth() -> automatic authentication middleware in routeFactory.ts
 * - createRateLimiter() -> internal implementation in routeFactory.ts
 *
 * The sanitizeInput() function is preserved below as it may still be useful
 * for client-side data processing.
 *
 * @see routeFactory.ts for the new pattern
 */

/**
 * Input sanitization middleware
 * This function is preserved as it may be useful for client-side data processing
 */
export function sanitizeInput(data: any): any {
  if (typeof data === "string") {
    return data.trim().slice(0, 10000); // Limit string length
  }

  if (Array.isArray(data)) {
    return data.slice(0, 100).map(sanitizeInput); // Limit array size
  }

  if (data && typeof data === "object") {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (key.length > 100) continue; // Skip long keys
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  return data;
}
