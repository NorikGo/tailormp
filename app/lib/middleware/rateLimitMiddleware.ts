import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  RateLimitConfig,
} from "../rateLimit";

/**
 * Rate Limit Middleware Wrapper
 *
 * Wraps API route handlers with rate limiting
 * Returns 429 if rate limit exceeded
 */
export function withRateLimit(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>,
  config: RateLimitConfig
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    // Extract client IP
    const clientIp = getClientIp(request.headers);

    // Create identifier (could also include route path for per-endpoint limits)
    const identifier = `${clientIp}`;

    // Check rate limit
    const result = checkRateLimit(identifier, config);

    // Add rate limit headers to response
    const headers = {
      "X-RateLimit-Limit": result.limit.toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Reset": result.reset.toString(),
    };

    // If rate limit exceeded, return 429
    if (!result.success) {
      const retryAfter = Math.ceil((result.reset * 1000 - Date.now()) / 1000);

      return NextResponse.json(
        {
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            ...headers,
            "Retry-After": retryAfter.toString(),
          },
        }
      );
    }

    // Call the original handler
    const response = await handler(request, ...args);

    // Add rate limit headers to successful response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}

/**
 * Simple rate limit check without wrapping
 * Returns response if rate limited, null otherwise
 */
export function checkRateLimitForRequest(
  request: NextRequest,
  config: RateLimitConfig
): NextResponse | null {
  const clientIp = getClientIp(request.headers);
  const result = checkRateLimit(clientIp, config);

  if (!result.success) {
    const retryAfter = Math.ceil((result.reset * 1000 - Date.now()) / 1000);

    return NextResponse.json(
      {
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.reset.toString(),
          "Retry-After": retryAfter.toString(),
        },
      }
    );
  }

  return null;
}
