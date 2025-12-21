import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { checkRateLimitForRequest } from "@/app/lib/middleware/rateLimitMiddleware";
import { RATE_LIMITS } from "@/app/lib/rateLimit";

// Enable caching for 60 seconds (revalidate every minute)
export const revalidate = 60;

export async function GET(request: NextRequest) {
  // Check rate limit for anonymous users (10 requests per minute)
  const rateLimitResponse = checkRateLimitForRequest(request, RATE_LIMITS.API_ANONYMOUS);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract query parameters
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "createdAt";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");

    // Build where clause
    const where: any = {};

    // Search in title and description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && category !== "all") {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "title_asc":
        orderBy = { title: "asc" };
        break;
      case "createdAt_desc":
        orderBy = { createdAt: "desc" };
        break;
      case "rating":
        // Sort by tailor rating
        orderBy = { tailor: { rating: "desc" } };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch products and total count in parallel with optimized queries
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          currency: true,
          category: true,
          isActive: true,
          createdAt: true,
          tailor: {
            select: {
              id: true,
              name: true,
              country: true,
              rating: true,
              isVerified: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              position: true,
            },
            orderBy: { position: "asc" },
            take: 1,
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const response = NextResponse.json(
      {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      { status: 200 }
    );

    // Add cache headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

    return response;
  } catch (error) {
    // console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Produkte" },
      { status: 500 }
    );
  }
}
