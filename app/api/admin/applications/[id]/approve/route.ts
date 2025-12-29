import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { hash } from "bcryptjs";

async function checkAdminAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { authorized: false, userId: null };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== "admin") {
    return { authorized: false, userId: null };
  }

  return { authorized: true, userId: user.id };
}

function generatePassword(length: number = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, userId } = await checkAdminAuth();

    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notes } = await request.json();
    const { id: applicationId } = await params;

    // Get the application
    const application = await prisma.tailorApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.status !== "pending") {
      return NextResponse.json(
        { error: "Application has already been reviewed" },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: application.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    // Generate random password
    const generatedPassword = generatePassword();
    const hashedPassword = await hash(generatedPassword, 10);

    // Create User account
    const newUser = await prisma.user.create({
      data: {
        email: application.email,
        password: hashedPassword,
        role: "tailor",
        firstName: application.name.split(" ")[0],
        lastName: application.name.split(" ").slice(1).join(" ") || "",
        fullName: application.name,
      },
    });

    // Create Tailor profile
    await prisma.tailor.create({
      data: {
        user_id: newUser.id,
        name: application.name,
        country: application.country,
        city: application.city,
        phone: application.phone,
        specialties: application.specialties,
        yearsExperience: application.yearsExperience,
        portfolioImages: application.imageUrls,
        isVerified: true, // Auto-verify approved tailors
        isActive: true,
      },
    });

    // Update application status
    await prisma.tailorApplication.update({
      where: { id: applicationId },
      data: {
        status: "approved",
        reviewedAt: new Date(),
        reviewedBy: userId,
        notes: notes || null,
      },
    });

    // TODO: Send email with login credentials
    // For now, we'll just log the credentials
    console.log("New Tailor Account Created:");
    console.log("Email:", application.email);
    console.log("Password:", generatedPassword);

    return NextResponse.json({
      success: true,
      message: "Application approved and tailor account created",
      credentials: {
        email: application.email,
        password: generatedPassword,
      },
    });
  } catch (error) {
    console.error("Error approving application:", error);
    return NextResponse.json(
      { error: "Failed to approve application" },
      { status: 500 }
    );
  }
}
