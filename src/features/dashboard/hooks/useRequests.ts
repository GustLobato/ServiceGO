/**
 * useRequests — hook centralizado para gerenciamento de solicitações de serviço.
 * Separa a lógica de estado do componente visual e torna o estado reutilizável
 * entre DashboardHome (resumo) e RequestsView (lista completa).
 */
import { useState, useMemo } from "react";
import { INITIAL_REQUESTS, type ServiceRequest, type RequestStatus } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/data/mockData";

export { CATEGORIES };

export interface NewRequestForm {
  service: string;
  category: string;
  description: string;
}

const EMPTY_FORM: NewRequestForm = { service: "", category: "", description: "" };

export function useRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        r.service.toLowerCase().includes(q) ||
        r.provider.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const stats = useMemo(
    () => ({
      total: requests.length,
      active: requests.filter(
        (r) => r.status === "em_andamento" || r.status === "aceita"
      ).length,
      pending: requests.filter((r) => r.status === "pendente").length,
      completed: requests.filter((r) => r.status === "concluida").length,
    }),
    [requests]
  );

  const createRequest = (form: NewRequestForm): boolean => {
    if (!form.service.trim() || !form.category) {
      toast({
        title: "Preencha os campos obrigatórios",
        variant: "destructive",
      });
      return false;
    }

    const newReq: ServiceRequest = {
      id: crypto.randomUUID(),
      service: form.service.trim(),
      provider: "Aguardando...",
      providerInitials: "??",
      status: "pendente" as RequestStatus,
      date: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      category: form.category,
      description: form.description,
    };

    setRequests((prev) => [newReq, ...prev]);
    toast({
      title: "Solicitação criada!",
      description: `"${newReq.service}" adicionada com sucesso.`,
    });
    return true;
  };

  return {
    requests,
    filteredRequests,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    createRequest,
    emptyForm: EMPTY_FORM,
  };
}
