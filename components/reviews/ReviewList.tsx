"use client";

import { useEffect, useState } from "react";
import { Star, Loader2, Trash2, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
  };
  product: {
    id: string;
    title: string;
  };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ReviewListProps {
  productId?: string;
  tailorId?: string;
  limit?: number;
}

export function ReviewList({ productId, tailorId, limit }: ReviewListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (productId) params.set("productId", productId);
      if (tailorId) params.set("tailorId", tailorId);

      const response = await fetch(`/api/reviews?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Bewertungen");
      }

      const data = await response.json();
      setReviews(limit ? data.reviews.slice(0, limit) : data.reviews);
      setStats(data.stats);
    } catch (err) {
      console.error("Fetch reviews error:", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, tailorId]);

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Möchten Sie diese Bewertung wirklich löschen?")) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Fehler beim Löschen der Bewertung");
      }

      toast({
        title: "Bewertung gelöscht",
        description: "Die Bewertung wurde erfolgreich gelöscht.",
      });

      // Refresh reviews
      fetchReviews();
    } catch (error) {
      console.error("Delete review error:", error);
      toast({
        title: "Fehler",
        description:
          error instanceof Error
            ? error.message
            : "Fehler beim Löschen der Bewertung",
        variant: "destructive",
      });
    }
  };

  // ───────────────────────────────────────────
  // Loading State
  // ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  // ───────────────────────────────────────────
  // Error State
  // ───────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
        <Button variant="outline" className="mt-4" onClick={fetchReviews}>
          Erneut versuchen
        </Button>
      </div>
    );
  }

  // ───────────────────────────────────────────
  // Empty State
  // ───────────────────────────────────────────
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Noch keine Bewertungen vorhanden.</p>
        <p className="text-sm text-slate-500 mt-2">
          Seien Sie der Erste, der eine Bewertung abgibt!
        </p>
      </div>
    );
  }

  // ───────────────────────────────────────────
  // Reviews List
  // ───────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Statistics */}
      {stats && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold text-slate-900">
                {stats.averageRating.toFixed(1)}
              </div>
              <div>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(stats.averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600">
                  Basierend auf {stats.totalReviews}{" "}
                  {stats.totalReviews === 1 ? "Bewertung" : "Bewertungen"}
                </p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
                const percentage =
                  stats.totalReviews > 0
                    ? (count / stats.totalReviews) * 100
                    : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-8">
                      {rating} <Star className="w-3 h-3 inline" />
                    </span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    {review.user.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(review.createdAt).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Actions (only for own reviews) */}
                {user && user.id === review.user.id && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {review.comment && (
                <p className="text-slate-700 leading-relaxed">{review.comment}</p>
              )}

              {review.createdAt !== review.updatedAt && (
                <p className="text-xs text-slate-500 mt-2 italic">
                  Bearbeitet am{" "}
                  {new Date(review.updatedAt).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
