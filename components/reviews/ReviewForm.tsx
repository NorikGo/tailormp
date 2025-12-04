"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Bitte melden Sie sich an, um eine Bewertung abzugeben.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (rating === 0) {
      toast({
        title: "Bewertung erforderlich",
        description: "Bitte wählen Sie eine Bewertung aus.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Speichern der Bewertung");
      }

      toast({
        title: "Bewertung gespeichert",
        description: "Vielen Dank für Ihre Bewertung!",
      });

      // Reset form
      setRating(0);
      setComment("");

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast({
        title: "Fehler",
        description:
          error instanceof Error
            ? error.message
            : "Fehler beim Speichern der Bewertung",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bewertung abgeben</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">
            Melden Sie sich an, um eine Bewertung abzugeben.
          </p>
          <Button onClick={() => router.push("/login")}>Anmelden</Button>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Bewertung *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-slate-600 mt-1">{rating} von 5 Sternen</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Kommentar (optional)
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Teilen Sie Ihre Erfahrungen mit diesem Produkt..."
              maxLength={1000}
              rows={4}
              disabled={isSubmitting}
            />
            <p className="text-xs text-slate-500 mt-1">
              {comment.length}/1000 Zeichen
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting || rating === 0}>
            {isSubmitting ? "Wird gespeichert..." : "Bewertung abgeben"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
