/**
 * @deprecated - This file has been replaced by routeFactory.ts
 *
 * All authentication helper functions have been migrated to the new route factory pattern.
 * For new API routes, use createRoute() from routeFactory.ts instead.
 *
 * Migration mapping:
 * - extractFirebaseToken() -> automatic authentication middleware in routeFactory.ts
 * - createAuthHeaders() -> handled by ApiClient in routeFactory.ts
 *
 * @see routeFactory.ts for the new pattern
 */

// This file is kept as a placeholder to avoid breaking imports during transition.
// All functionality has been moved to routeFactory.ts
