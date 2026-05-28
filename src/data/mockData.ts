/**
 * Dados estaticos e tipos usados pela Landing Page, Dashboard e testes.
 * Tipos de request/listing refletem o modelo da API.
 */

export type RequestStatus =
  | "pendente"
  | "aceita"
  | "em_andamento"
  | "concluida"
  | "cancelada";

/** Representacao no frontend de um ServiceRequest vindo da API */
export interface ServiceRequest {
  id: string;
  service: string;
  provider: string;
  providerInitials: string;
  status: RequestStatus;
  date: string;
  category: string;
  description?: string;
  listingId?: string;
  price?: number;
  scheduledAt?: string;
  updatedAt?: string;
  address?: string;
  providerAvatarUrl?: string;
  providerPhone?: string;
  providerRating?: number;
  providerReviewCount?: number;
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

export interface MockNotification {
  id: string;
  text: string;
  time: string;
  unread: boolean;
}

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

export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: "req-001",
    service: "Reparo de encanamento",
    provider: "João Pereira",
    providerInitials: "JP",
    status: "pendente",
    date: "12 mai. 2026",
    category: "Encanamento",
    description: "Vazamento na pia da cozinha com troca de sifão.",
    listingId: "listing-001",
    price: 180,
    address: "Rua das Flores, 120 - Centro",
    providerPhone: "+5511999990101",
    providerRating: 4.8,
    providerReviewCount: 86,
  },
  {
    id: "req-002",
    service: "Instalação de tomada",
    provider: "Marina Costa",
    providerInitials: "MC",
    status: "aceita",
    date: "14 mai. 2026",
    category: "Elétrica",
    description: "Instalação de tomada 20A no escritório.",
    listingId: "listing-002",
    price: 140,
    scheduledAt: "2026-05-30T14:00:00-03:00",
    address: "Av. Brasil, 830 - Sala 402",
    providerPhone: "+5511999990202",
    providerRating: 4.9,
    providerReviewCount: 124,
  },
  {
    id: "req-003",
    service: "Formatação de PC",
    provider: "Lucas Almeida",
    providerInitials: "LA",
    status: "concluida",
    date: "18 mai. 2026",
    category: "Tecnologia",
    description: "Backup, limpeza e instalação dos programas essenciais.",
    listingId: "listing-003",
    price: 220,
    scheduledAt: "2026-05-18T10:00:00-03:00",
    updatedAt: "2026-05-18T16:30:00-03:00",
    address: "Atendimento remoto",
    providerRating: 5,
    providerReviewCount: 52,
  },
  {
    id: "req-004",
    service: "Limpeza residencial completa",
    provider: "Camila Rocha",
    providerInitials: "CR",
    status: "em_andamento",
    date: "20 mai. 2026",
    category: "Limpeza",
    description: "Limpeza pós-obra em apartamento pequeno.",
    listingId: "listing-004",
    price: 260,
    scheduledAt: "2026-05-28T09:00:00-03:00",
    address: "Rua Harmonia, 44 - Vila Madalena",
    providerPhone: "+5511999990404",
    providerRating: 4.7,
    providerReviewCount: 73,
  },
];

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "notif-001",
    text: "Sua solicitação de encanamento foi enviada.",
    time: "Agora",
    unread: true,
  },
  {
    id: "notif-002",
    text: "Marina aceitou o atendimento elétrico.",
    time: "Há 2h",
    unread: false,
  },
  {
    id: "notif-003",
    text: "Você já pode avaliar o serviço de tecnologia.",
    time: "Ontem",
    unread: true,
  },
];
