/**
 * DashboardHome — view principal do Dashboard.
 * Exibe estatísticas e as últimas solicitações.
 */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import StatsGrid from "./components/StatsGrid";
import RequestList from "./components/RequestList";
import { type NewRequestForm } from "./hooks/useRequests";
import type { SidebarView } from "./types";
import { type ServiceRequest, type Listing } from "@/data/mockData";
import { api } from "@/lib/api";

interface DashboardHomeProps {
  userName: string;
  stats: { total: number; active: number; pending: number; completed: number };
  recentRequests: ServiceRequest[];
  onNavigate: (view: SidebarView) => void;
  onCreateRequest: (form: NewRequestForm) => boolean;
  userRole?: "cliente" | "prestador";
  onUpdateStatus?: (id: string, status: string) => void;
}

interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const DashboardHome = ({
  userName,
  stats,
  recentRequests,
  onNavigate,
  onCreateRequest,
  userRole,
  onUpdateStatus,
}: DashboardHomeProps) => {
  const [newRequest, setNewRequest] = useState<NewRequestForm>({
    listingId: "",
    message: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch available listings to populate the request dropdown
  const { data: listingsData } = useQuery({
    queryKey: ["listings", "all-modal"],
    queryFn: () => api.get<ListingsResponse>("/api/listings?limit=100"),
  });
  const listings = listingsData?.listings ?? [];

  const handleCreate = () => {
    const ok = onCreateRequest(newRequest);
    if (ok) {
      setNewRequest({ listingId: "", message: "" });
      setDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Bem-vindo de volta, {userName}!
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Nova Solicitação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Solicitação de Serviço</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova solicitação a um profissional.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="req-listing">Serviço Disponível *</Label>
                <Select
                  value={newRequest.listingId}
                  onValueChange={(v) =>
                    setNewRequest((p) => ({ ...p, listingId: v }))
                  }
                >
                  <SelectTrigger id="req-listing">
                    <SelectValue placeholder="Selecione um serviço anunciado" />
                  </SelectTrigger>
                  <SelectContent>
                    {listings.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.title} (R$ {l.price.toFixed(2)} - por {l.provider.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="req-message">Mensagem / Instruções</Label>
                <Textarea
                  id="req-message"
                  placeholder="Descreva o que precisa ou deixe uma mensagem para o profissional..."
                  value={newRequest.message}
                  onChange={(e) =>
                    setNewRequest((p) => ({ ...p, message: e.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleCreate}>Criar Solicitação</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <StatsGrid stats={stats} />

      <RequestList
        title="Solicitações Recentes"
        description="Acompanhe suas últimas solicitações de serviço"
        requests={recentRequests.slice(0, 5)}
        onViewAll={() => onNavigate("solicitacoes")}
        userRole={userRole}
        onUpdateStatus={onUpdateStatus}
      />
    </>
  );
};

export default DashboardHome;
