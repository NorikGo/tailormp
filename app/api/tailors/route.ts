import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { checkRateLimitForRequest } from "@/app/lib/middleware/rateLimitMiddleware";
import { RATE_LIMITS } from "@/app/lib/rateLimit";

// Enable caching for 60 seconds
export const revalidate = 60;

export async function GET(request: NextRequest) {
  // Check rate limit for anonymous users (10 requests per minute)
  const rateLimitResponse = checkRateLimitForRequest(request, RATE_LIMITS.API_ANONYMOUS);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const searchParams = request.nextUrl.searchParams;

    // Query parameters
    const country = searchParams.get("country");
    const minRating = searchParams.get("minRating");
    const specialties = searchParams.get("specialties");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Build filter object
    const where: any = {};

    if (country) {
      where.country = country;
    }

    if (minRating) {
      where.rating = {
        gte: parseFloat(minRating),
      };
    }

    if (specialties) {
      const specialtiesArray = specialties.split(",");
      where.specialties = {
        hasSome: specialtiesArray,
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch tailors with filters
    const [tailors, total] = await Promise.all([
      prisma.tailor.findMany({
        where,
        orderBy: {
          rating: "desc",
        },
        skip,
        take: limit,
        select: {
          id: true,
          user_id: true,
          name: true,
          bio: true,
          country: true,
          languages: true,
          rating: true,
          totalOrders: true,
          yearsExperience: true,
          specialties: true,
          isVerified: true,
        },
      }),
      prisma.tailor.count({ where }),
    ]);

    const response = NextResponse.json(
      {
        tailors,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );

    // Add cache headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

    return response;
  } catch (error) {
    console.error("Tailors API error:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Schneider" },
      { status: 500 }
    );
  }
}
