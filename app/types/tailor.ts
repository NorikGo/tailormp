export interface Tailor {
  id: string;
  userId: string;
  name: string;
  bio: string;
  country: string;
  languages: string[];
  rating: number;
  totalOrders: number;
  yearsExperience: number;
  specialties: string[];
  isVerified: boolean;
}

export type TailorSpecialty =
  | "Anzüge"
  | "Hemden"
  | "Hosen"
  | "Mäntel"
  | "Kleider"
  | "Brautmode"
  | "Änderungen"
  | "Maßanfertigung";
