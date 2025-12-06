import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/app/lib/prisma";
import { z } from "zod";

/**
 * PATCH /api/reviews/[id]
 * Update a review (only by the review author)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Validation
    const updateReviewSchema = z.object({
      rating: z.number().int().min(1).max(5).optional(),
      comment: z.string().max(1000).optional(),
    });

    const validatedData = updateReviewSchema.parse(body);

    // Check if review exists and user owns it
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.userId !== user.id) {
      return NextResponse.json(
        { error: "You can only edit your own reviews" },
        { status: 403 }
      );
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Update tailor rating if rating changed
    if (validatedData.rating !== undefined) {
      const allTailorReviews = await prisma.review.findMany({
        where: { tailorId: review.tailorId },
      });

      const avgRating =
        allTailorReviews.reduce((sum, r) => sum + r.rating, 0) /
        allTailorReviews.length;

      await prisma.tailor.update({
        where: { id: review.tailorId },
        data: { rating: Math.round(avgRating * 10) / 10 },
      });
    }

    return NextResponse.json({ review: updatedReview }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 422 }
      );
    }

    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reviews/[id]
 * Delete a review (only by the review author)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if review exists and user owns it
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.userId !== user.id) {
      return NextResponse.json(
        { error: "You can only delete your own reviews" },
        { status: 403 }
      );
    }

    // Delete review
    await prisma.review.delete({
      where: { id },
    });

    // Update tailor rating
    const allTailorReviews = await prisma.review.findMany({
      where: { tailorId: review.tailorId },
    });

    const avgRating =
      allTailorReviews.length > 0
        ? allTailorReviews.reduce((sum, r) => sum + r.rating, 0) /
          allTailorReviews.length
        : null;

    await prisma.tailor.update({
      where: { id: review.tailorId },
      data: { rating: avgRating },
    });

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
