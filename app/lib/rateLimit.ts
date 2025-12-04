/**
 * In-Memory Rate Limiting
 *
 * Implements sliding window rate limiting using Map
 * For production, consider using Upstash Redis or similar
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number; // Maximum requests
  windowMs: number; // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp when limit resets
}

/**
 * Default rate limit configs
 */
export const RATE_LIMITS = {
  // Authentication endpoints (strict)
  LOGIN: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  REGISTER: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 requests per hour

  // API endpoints (authenticated)
  API_AUTHENTICATED: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute

  // API endpoints (anonymous/public)
  API_ANONYMOUS: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 requests per minute
};

/**
 * Check rate limit for given identifier
 *
 * @param identifier Unique identifier (e.g., IP address or user ID)
 * @param config Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  // Get or create entry
  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  const success = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);

  return {
    success,
    limit: config.maxRequests,
    remaining,
    reset: Math.floor(entry.resetTime / 1000), // Convert to seconds
  };
}

/**
 * Extract IP address from request headers
 * Tries multiple headers for proxy/load balancer support
 */
export function getClientIp(headers: Headers): string {
  // Try various headers in order of preference
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const cfConnectingIp = headers.get("cf-connecting-ip"); // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // Fallback to a placeholder (not ideal, but better than crashing)
  return "unknown";
}

/**
 * Reset rate limit for identifier (useful for testing)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests,
      reset: Math.floor((now + config.windowMs) / 1000),
    };
  }

  const remaining = Math.max(0, config.maxRequests - entry.count);
  const success = entry.count < config.maxRequests;

  return {
    success,
    limit: config.maxRequests,
    remaining,
    reset: Math.floor(entry.resetTime / 1000),
  };
}
