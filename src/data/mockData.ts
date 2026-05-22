/**
 * Dados estáticos e tipos — usados pela Landing Page e Dashboard.
 * Tipos de request/listing agora refletem o modelo da API.
 */

// ---- Tipos ----------------------------------------------------------------
export type RequestStatus =
  | "pendente"
  | "aceita"
  | "em_andamento"
  | "concluida"
  | "cancelada";

/** Representação no frontend de um ServiceRequest vindo da API */
export interface ServiceRequest {
  id: string;
  service: string;         // listing.title
  provider: string;        // listing.provider.name
  providerInitials: string;
  status: RequestStatus;
  date: string;            // formatted createdAt
  category: string;        // listing.category
  description?: string;    // message
  listingId?: string;
  price?: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: string;
  location?: string;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  provider: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  client: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

// ---- Dados estáticos (landing page) ---------------------------------------
export const CATEGORIES: readonly string[] = [
  "Encanamento",
  "Elétrica",
  "Pintura",
  "Reformas",
  "Tecnologia",
  "Limpeza",
  "Jardinagem",
  "Automotivo",
] as const;
