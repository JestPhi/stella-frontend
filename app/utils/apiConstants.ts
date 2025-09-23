/**
 * Common API constants and configurations
 */

export const API_TIMEOUTS = {
  DEFAULT: 10000,
  UPLOAD: 15000,
  LONG_OPERATION: 30000,
} as const;

export const CACHE_DURATIONS = {
  PROFILE: 600, // 10 minutes
  STORY: 120, // 2 minutes
  SHORT: 60, // 1 minute
} as const;

export const RATE_LIMITS = {
  CONTENT_MODIFY: { maxRequests: 20, windowMs: 60000 },
  IMAGE_UPLOAD: { maxRequests: 10, windowMs: 60000 },
  PROFILE_CREATE: { maxRequests: 5, windowMs: 60000 },
} as const;
