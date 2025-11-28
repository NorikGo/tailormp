"use client";

import { useState, useEffect } from "react";
import { Tailor } from "@/app/types/tailor";

interface TailorsFilters {
  country?: string;
  minRating?: number;
  specialties?: string[];
  page?: number;
  limit?: number;
}

interface TailorsResponse {
  tailors: Tailor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TailorsState {
  tailors: Tailor[];
  pagination: TailorsResponse["pagination"] | null;
  loading: boolean;
  error: string | null;
}

export function useTailors(filters: TailorsFilters = {}) {
  const [state, setState] = useState<TailorsState>({
    tailors: [],
    pagination: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchTailors = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Build query params
        const params = new URLSearchParams();

        if (filters.country) params.append("country", filters.country);
        if (filters.minRating) params.append("minRating", filters.minRating.toString());
        if (filters.specialties && filters.specialties.length > 0) {
          params.append("specialties", filters.specialties.join(","));
        }
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.limit) params.append("limit", filters.limit.toString());

        const response = await fetch(`/api/tailors?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Fehler beim Laden der Schneider");
        }

        const data: TailorsResponse = await response.json();

        setState({
          tailors: data.tailors,
          pagination: data.pagination,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error("useTailors error:", error);
        setState({
          tailors: [],
          pagination: null,
          loading: false,
          error: error.message || "Fehler beim Laden der Schneider",
        });
      }
    };

    fetchTailors();
  }, [
    filters.country,
    filters.minRating,
    filters.specialties?.join(","),
    filters.page,
    filters.limit,
  ]);

  return state;
}
