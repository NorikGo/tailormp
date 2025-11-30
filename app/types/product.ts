export type ProductCategory =
  | "Anzug"
  | "Hemd"
  | "Hose"
  | "Mantel"
  | "Kleid"
  | "Jacke"
  | "Weste"
  | "Accessoire";

export interface Product {
  id: string;
  tailorId: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string | null;
  featured: boolean;
  createdAt: Date;
}

export interface ProductWithTailor extends Product {
  tailor: {
    id: string;
    name: string;
    country: string;
    rating: number;
    isVerified: boolean;
  };
}
