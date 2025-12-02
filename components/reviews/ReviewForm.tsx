"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { reviewSchema, type ReviewInput } from "@/app/lib/validations";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [rating, setRating] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<ReviewInput, "rating">>({
    resolver: zodResolver(reviewSchema.omit({ rating: true })),
  });

  const onSubmit = async (data: Omit<ReviewInput, "rating">) => {
    if (rating === 0) {
      setError("Bitte wähle eine Bewertung");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "dummy-customer-id", // TODO: Replace with real auth
        },
        body: JSON.stringify({
          ...data,
          rating,
          productId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler beim Erstellen der Bewertung");
      }

      setSuccess(true);
      reset();
      setRating(0);

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err: any) {
      console.error("Error submitting review:", err);
      setError(err.message || "Ein Fehler ist aufgetreten");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="text-green-600 text-lg font-semibold mb-2">
              ✓ Bewertung erfolgreich erstellt!
            </div>
            <p className="text-slate-600 text-sm">
              Vielen Dank für dein Feedback
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bewertung abgeben</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Rating */}
          <div>
            <Label className="mb-2 block">Deine Bewertung *</Label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="lg"
            />
            {rating === 0 && error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment">Dein Kommentar (optional)</Label>
            <Textarea
              id="comment"
              {...register("comment")}
              placeholder="Teile deine Erfahrungen mit diesem Produkt..."
              rows={4}
              className="mt-1"
            />
            {errors.comment && (
              <p className="text-sm text-red-600 mt-1">
                {errors.comment.message}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Mindestens 10 Zeichen, falls du einen Kommentar hinterlassen möchtest
            </p>
          </div>

          {/* Error Message */}
          {error && error !== "Bitte wähle eine Bewertung" && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Wird gesendet...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Bewertung absenden
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
