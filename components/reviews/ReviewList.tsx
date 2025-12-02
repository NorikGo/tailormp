"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "./StarRating";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
  };
}

interface ReviewStats {
  total: number;
  avgRating: number;
  ratingCounts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ReviewListProps {
  productId: string;
}

export function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews`);

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Bewertungen");
      }

      const data = await response.json();
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (err: any) {
      console.error("Error fetching reviews:", err);
      setError(err.message || "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
        {error}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-slate-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">Noch keine Bewertungen</p>
            <p className="text-sm mt-1">
              Sei der Erste, der dieses Produkt bewertet!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      {stats && (
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900 mb-1">
                  {stats.avgRating.toFixed(1)}
                </div>
                <StarRating rating={stats.avgRating} readonly size="md" />
                <p className="text-sm text-slate-600 mt-2">
                  {stats.total} Bewertung{stats.total !== 1 ? "en" : ""}
                </p>
              </div>

              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.ratingCounts[star as keyof typeof stats.ratingCounts];
                  const percentage =
                    stats.total > 0 ? (count / stats.total) * 100 : 0;

                  return (
                    <div key={star} className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-600 w-4">{star}</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="py-4">
              <div className="flex items-start gap-4">
                {/* Avatar Placeholder */}
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-600 font-medium">
                    {review.user.email.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-slate-900">
                        {review.user.email.split("@")[0]}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString("de-DE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <StarRating rating={review.rating} readonly size="sm" />
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-slate-700 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
