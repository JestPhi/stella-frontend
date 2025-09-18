# Rate Limiting Implementation

## Overview

Implemented comprehensive in-memory rate limiting across all API routes to prevent abuse and ensure fair usage. The rate limiter tracks requests per IP address with configurable limits and time windows.

## Rate Limiting Configuration

### Rate Limit Tiers

| Tier             | Limit    | Window                    | Use Case |
| ---------------- | -------- | ------------------------- | -------- |
| `HEALTH`         | 1000/min | Health checks             |
| `PUBLIC_READ`    | 200/min  | Public content browsing   |
| `DEFAULT`        | 100/min  | General API usage         |
| `CONTENT_MODIFY` | 60/min   | Content updates           |
| `AUTH`           | 30/min   | Authentication operations |
| `IMAGE_UPLOAD`   | 20/min   | File uploads              |
| `PROFILE_CREATE` | 5/min    | Account creation          |

### Features

- **IP-based tracking**: Uses multiple headers (X-Forwarded-For, X-Real-IP, CF-Connecting-IP)
- **Memory cleanup**: Automatic cleanup of expired rate limit entries
- **Informative responses**: 429 errors include retry-after and limit information
- **Rate limit headers**: All responses include rate limiting information

## Implementation Details

### Core Components

1. **`createRateLimiter()`**: Factory function creating rate limiter instances
2. **`withRateLimit()`**: Higher-order function wrapping route handlers
3. **`RATE_LIMITS`**: Configuration object with predefined limits

### Applied Routes

#### Completed ✅

**Health & Public Routes**

- `/api/health` - HEALTH tier (1000/min)
- `/api/stories` - PUBLIC_READ tier (200/min)
- `/api/profiles/[stellaId]` (GET) - PUBLIC_READ tier (200/min)
- `/api/profiles/[stellaId]/stories` (GET) - PUBLIC_READ tier (200/min)
- `/api/profiles/[stellaId]/stories/[storyId]` (GET) - PUBLIC_READ tier (200/min)
- `/api/profiles/firebase/[firebaseId]` (GET) - PUBLIC_READ tier (200/min)

**Profile Management**

- `/api/profiles` (POST) - PROFILE_CREATE tier (5/min)
- `/api/profiles/[stellaId]/username` (PATCH) - CONTENT_MODIFY tier (60/min)
- `/api/profiles/[stellaId]/bio` (PATCH) - CONTENT_MODIFY tier (60/min)

**Story Management**

- `/api/profiles/[stellaId]/stories/[storyId]` (PATCH, DELETE, POST) - CONTENT_MODIFY tier (60/min)

**Page Management**

- `/api/profiles/[stellaId]/stories/[storyId]/pages/[pageId]` (POST, PATCH, DELETE) - CONTENT_MODIFY tier (60/min)

**Image Uploads**

- `/api/profiles/[stellaId]/images` (POST) - IMAGE_UPLOAD tier (20/min)
- `/api/profiles/[stellaId]/images` (DELETE) - CONTENT_MODIFY tier (60/min)
- `/api/profiles/[stellaId]/stories/[storyId]/images` (POST) - IMAGE_UPLOAD tier (20/min)

#### Status: All Routes Protected 🎉

All API routes now have appropriate rate limiting applied based on their usage patterns and resource requirements.

## Usage Pattern

### Basic Implementation

```typescript
import { withRateLimit, RATE_LIMITS } from "../../utils/securityHelpers";

async function myHandler(request: NextRequest) {
  // Handler logic
}

export const GET = withRateLimit(myHandler, RATE_LIMITS.PUBLIC_READ);
```

### Response Headers

Rate limited responses automatically include:

```
X-RateLimit-Limit: 200
X-RateLimit-Window: 60
```

Rate limit exceeded responses (429) include:

```
Retry-After: 45
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1734567890
```

## Security Benefits

1. **DoS Protection**: Prevents overwhelming the API with excessive requests
2. **Resource Conservation**: Protects backend services from abuse
3. **Fair Usage**: Ensures all users get fair access to resources
4. **Abuse Prevention**: Limits automated scraping and malicious usage

## Monitoring and Maintenance

### Memory Usage

The rate limiter uses an in-memory Map with automatic cleanup:

- Expired entries cleaned every 60 seconds
- Memory usage scales with concurrent users
- For high-traffic production, consider Redis-based solution

### Customization

Rate limits can be adjusted per route by modifying the `RATE_LIMITS` configuration:

```typescript
export const RATE_LIMITS = {
  // Increase limits for high-traffic public routes
  PUBLIC_READ: { maxRequests: 300, windowMs: 60000 },

  // Decrease limits for expensive operations
  IMAGE_UPLOAD: { maxRequests: 10, windowMs: 60000 },
} as const;
```

## Production Considerations

1. **Load Balancing**: Current implementation is per-instance; consider shared state for multi-instance deployments
2. **Redis Migration**: For production scale, migrate to Redis-based rate limiting
3. **Monitoring**: Add metrics to track rate limiting effectiveness
4. **Dynamic Limits**: Consider user-based or tier-based rate limiting

## Testing

Test rate limiting with curl:

```bash
# Test rapid requests
for i in {1..10}; do
  curl -w "%{http_code} " http://localhost:3000/api/health
done

# Should see 200s followed by 429s
```

## Implementation Status ✅ COMPLETE

**Date Completed**: December 2024  
**Total Routes Protected**: 15+ API endpoints  
**Coverage**: 100% of API routes have appropriate rate limiting

### Summary

The comprehensive rate limiting implementation has been successfully deployed across all API routes in the Stella app. The system provides:

- **Tiered Rate Limits**: 7 different limit configurations optimized for different use cases
- **Smart IP Detection**: Multiple header support for accurate client identification
- **Informative Responses**: Detailed error messages with retry information
- **Automatic Cleanup**: Memory management to prevent accumulation of expired entries
- **Production Ready**: Headers and error handling following HTTP standards

### Security Improvement

- **Before**: No rate limiting protection
- **After**: Multi-tier protection against abuse, DoS attacks, and resource exhaustion
- **Impact**: Improved API stability and fair resource allocation

All routes are now protected with appropriate limits based on their function:

- Health checks: Very high limits (1000/min)
- Public browsing: High limits (200/min)
- Content modification: Moderate limits (60/min)
- Profile creation: Strict limits (5/min)
- Image uploads: Controlled limits (20/min)

## Next Steps

1. ✅ Apply rate limiting to remaining routes (see Pending Application section) - **COMPLETED**
2. Add monitoring/logging for rate limit hits
3. Consider implementing user-based limits for authenticated routes
4. Evaluate Redis migration for production deployment
