/**
 * useRequests — hook centralizado para gerenciamento de solicitações de serviço.
 * Agora busca e persiste dados via API REST.
 */
import { useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, statusToPt } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES, type ServiceRequest, type RequestStatus } from "@/data/mockData";

export { CATEGORIES };

export interface NewRequestForm {
  listingId: string;
  message: string;
}

// ---- API response types ---------------------------------------------------
interface ApiRequest {
  id: string;
  status: string;
  message?: string;
  price?: number;
  scheduledAt?: string;
  createdAt: string;
  updatedAt?: string;
  listing: {
    id: string;
    title: string;
    category?: string;
    price?: number;
    location?: string;
    rating?: number;
    reviewCount?: number;
    provider: { id: string; name: string; avatarUrl?: string; phone?: string };
  };
  client?: { id: string; name: string; avatarUrl?: string };
}

function mapRequest(r: ApiRequest): ServiceRequest {
  const providerName = r.listing?.provider?.name ?? "Prestador";
  return {
    id: r.id,
    service: r.listing?.title ?? "Serviço",
    provider: providerName,
    providerInitials: providerName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    status: statusToPt(r.status) as RequestStatus,
    date: new Date(r.createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    category: r.listing?.category ?? "",
    description: r.message,
    listingId: r.listing?.id,
    price: r.price ?? r.listing?.price,
    scheduledAt: r.scheduledAt,
    updatedAt: r.updatedAt,
    address: r.listing?.location,
    providerAvatarUrl: r.listing?.provider?.avatarUrl,
    providerPhone: r.listing?.provider?.phone,
    providerRating: r.listing?.rating,
    providerReviewCount: r.listing?.reviewCount,
  };
}

export function useRequests() {
  const { toast } = useToast();
  const qc = useQueryClient();

  // ---- Fetch requests from API -------------------------------------------
  const {
    data: requests = [],
    isLoading,
  } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const data = await api.get<ApiRequest[]>("/api/requests/mine");
      return data.map(mapRequest);
    },
  });

  return useRequestsInner(requests, isLoading, toast, qc);
}

/** Inner hook that manages client-side filters on top of API data */
function useRequestsInner(
  requests: ServiceRequest[],
  isLoading: boolean,
  toast: ReturnType<typeof useToast>["toast"],
  qc: ReturnType<typeof useQueryClient>,
) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        r.service.toLowerCase().includes(q) ||
        r.provider.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const stats = useMemo(
    () => ({
      total: requests.length,
      active: requests.filter(
        (r) => r.status === "em_andamento" || r.status === "aceita",
      ).length,
      pending: requests.filter((r) => r.status === "pendente").length,
      completed: requests.filter((r) => r.status === "concluida").length,
    }),
    [requests],
  );

  // ---- Create request via API --------------------------------------------
  const createMutation = useMutation({
    mutationFn: (form: NewRequestForm) =>
      api.post("/api/requests", {
        listingId: form.listingId,
        message: form.message || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requests"] });
      toast({ title: "Solicitação criada!", description: "Sua solicitação foi enviada ao prestador." });
    },
    onError: (e: Error) => {
      toast({ title: "Erro ao criar solicitação", description: e.message, variant: "destructive" });
    },
  });

  const createRequest = useCallback(
    (form: NewRequestForm): boolean => {
      if (!form.listingId) {
        toast({ title: "Selecione um serviço", variant: "destructive" });
        return false;
      }
      createMutation.mutate(form);
      return true;
    },
    [createMutation, toast],
  );

  // ---- Update status via API ---------------------------------------------
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/api/requests/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requests"] });
      toast({ title: "Status atualizado!" });
    },
    onError: (e: Error) => {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    },
  });

  const updateStatus = useCallback(
    (id: string, status: string) => statusMutation.mutate({ id, status }),
    [statusMutation],
  );

  return {
    requests,
    filteredRequests,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    createRequest,
    updateStatus,
    isLoading,
    emptyForm: { listingId: "", message: "" } as NewRequestForm,
  };
}

import React from "react";
