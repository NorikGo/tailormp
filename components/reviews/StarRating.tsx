"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
  showValue = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const starSize = sizeClasses[size];

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => {
        const isFilled = value <= displayRating;
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={`
              ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}
              transition-transform
              ${readonly ? "" : "focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"}
            `}
            aria-label={`${value} star${value > 1 ? "s" : ""}`}
          >
            <Star
              className={`
                ${starSize}
                ${
                  isFilled
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-none text-slate-300"
                }
                transition-colors
              `}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-2 text-sm font-medium text-slate-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
