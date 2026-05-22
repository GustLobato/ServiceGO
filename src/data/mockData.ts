/**
 * Dados mock centralizados — usados pelo Dashboard e testes.
 * Remova/substitua este arquivo quando integrar com uma API real.
 */

export type RequestStatus = "pendente" | "aceita" | "em_andamento" | "concluida";

export interface ServiceRequest {
  id: string;
  service: string;
  provider: string;
  providerInitials: string;
  status: RequestStatus;
  date: string;
  category: string;
  description?: string;
}

export interface Notification {
  id: number;
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
    id: "1",
    service: "Reparo de encanamento",
    provider: "João Pereira",
    providerInitials: "JP",
    status: "em_andamento",
    date: "15 Mar 2026",
    category: "Encanamento",
    description: "Torneira da cozinha com vazamento.",
  },
  {
    id: "2",
    service: "Instalação elétrica",
    provider: "Ana Santos",
    providerInitials: "AS",
    status: "pendente",
    date: "14 Mar 2026",
    category: "Elétrica",
    description: "Instalar tomadas na sala.",
  },
  {
    id: "3",
    service: "Pintura de sala",
    provider: "Carlos Lima",
    providerInitials: "CL",
    status: "concluida",
    date: "10 Mar 2026",
    category: "Pintura",
    description: "Pintura completa da sala de estar.",
  },
  {
    id: "4",
    service: "Limpeza de jardim",
    provider: "Maria Souza",
    providerInitials: "MS",
    status: "aceita",
    date: "12 Mar 2026",
    category: "Reformas",
    description: "Limpeza geral do jardim.",
  },
  {
    id: "5",
    service: "Manutenção de PC",
    provider: "Pedro Costa",
    providerInitials: "PC",
    status: "concluida",
    date: "08 Mar 2026",
    category: "Tecnologia",
    description: "PC lento, precisa de formatação.",
  },
];

export const MOCK_NOTIFICATIONS: readonly Notification[] = [
  {
    id: 1,
    text: "João Pereira atualizou o status do reparo de encanamento",
    time: "2 min atrás",
    unread: true,
  },
  {
    id: 2,
    text: "Ana Santos aceitou sua solicitação de instalação elétrica",
    time: "1h atrás",
    unread: true,
  },
  {
    id: 3,
    text: "Avaliação de Carlos Lima publicada com sucesso",
    time: "3h atrás",
    unread: false,
  },
] as const;
