import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      country,
      city,
      yearsExperience,
      specialties,
      portfolioLinks,
      motivation,
      imageUrls,
    } = body;

    // Validation
    if (!name || !email || !phone || !city || !yearsExperience || !specialties || !motivation) {
      return NextResponse.json(
        { error: "Alle Pflichtfelder müssen ausgefüllt sein" },
        { status: 400 }
      );
    }

    if (yearsExperience < 1) {
      return NextResponse.json(
        { error: "Jahre Erfahrung muss mindestens 1 sein" },
        { status: 400 }
      );
    }

    if (!Array.isArray(specialties) || specialties.length === 0) {
      return NextResponse.json(
        { error: "Mindestens eine Spezialisierung ist erforderlich" },
        { status: 400 }
      );
    }

    if (motivation.length < 50) {
      return NextResponse.json(
        { error: "Motivation muss mindestens 50 Zeichen lang sein" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingApplication = await prisma.tailorApplication.findFirst({
      where: { email },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "Eine Bewerbung mit dieser E-Mail existiert bereits" },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.tailorApplication.create({
      data: {
        name,
        email,
        phone,
        country: country || "Vietnam",
        city,
        yearsExperience,
        specialties,
        portfolioLinks: portfolioLinks || null,
        motivation,
        imageUrls: imageUrls || [],
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        status: application.status,
      },
    });
  } catch (error) {
    console.error("Error creating tailor application:", error);
    return NextResponse.json(
      { error: "Bewerbung konnte nicht erstellt werden" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint is for admin use only - check authorization
    // For now, we'll return unauthorized
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Bewerbungen konnten nicht geladen werden" },
      { status: 500 }
    );
  }
}
