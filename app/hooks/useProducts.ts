import { useState, useEffect } from "react";
import { Product } from "@/app/types/product";

export interface ProductsFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsState {
  products: Product[];
  pagination: ProductsPagination | null;
  loading: boolean;
  error: string | null;
}

export function useProducts(filters: ProductsFilters = {}) {
  const [state, setState] = useState<ProductsState>({
    products: [],
    pagination: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Build query params
        const params = new URLSearchParams();
        if (filters.category) params.append("category", filters.category);
        if (filters.minPrice !== undefined)
          params.append("minPrice", filters.minPrice.toString());
        if (filters.maxPrice !== undefined)
          params.append("maxPrice", filters.maxPrice.toString());
        if (filters.sort) params.append("sort", filters.sort);
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.limit) params.append("limit", filters.limit.toString());

        const response = await fetch(`/api/products?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Fehler beim Laden der Produkte");
        }

        const data = await response.json();

        setState({
          products: data.products,
          pagination: data.pagination,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        // console.error("Fetch products error:", err);
        setState({
          products: [],
          pagination: null,
          loading: false,
          error: err.message || "Fehler beim Laden der Produkte",
        });
      }
    };

    fetchProducts();
  }, [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    filters.page,
    filters.limit,
  ]);

  return state;
}
