import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// Enable caching for 60 seconds
export const revalidate = 60;

export async function GET(request: NextRequest) {
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
      prisma.tailorProfile.findMany({
        where,
        orderBy: {
          rating: "desc",
        },
        skip,
        take: limit,
        select: {
          id: true,
          userId: true,
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
      prisma.tailorProfile.count({ where }),
    ]);

    return NextResponse.json(
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
  } catch (error) {
    console.error("Tailors API error:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Schneider" },
      { status: 500 }
    );
  }
}
