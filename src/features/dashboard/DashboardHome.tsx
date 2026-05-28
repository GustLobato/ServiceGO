import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
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

const DashboardHome = ({ userName, stats, recentRequests, onNavigate, onCreateRequest, userRole, onUpdateStatus }: DashboardHomeProps) => {
  const [newRequest, setNewRequest] = useState<NewRequestForm>({ listingId: "", message: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const firstName = userName.split(" ")[0];

  return (
    <>
      {/* Welcome header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Olá, {firstName}! 👋
          </h1>
          <p className="text-gray-500 mt-1.5">
            Bem-vindo ao seu painel. Acompanhe suas solicitações e encontre os melhores profissionais.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-sm shadow-orange-200 rounded-xl">
              <Plus className="h-4 w-4" /> Nova solicitação
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Nova Solicitação de Serviço</DialogTitle>
              <DialogDescription>
                Selecione o serviço e descreva o que você precisa.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Serviço Disponível *</Label>
                <Select value={newRequest.listingId} onValueChange={(v) => setNewRequest((p) => ({ ...p, listingId: v }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {listings.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.title} — R$ {l.price.toFixed(2)} · {l.provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mensagem / Instruções</Label>
                <Textarea
                  placeholder="Descreva o que você precisa ou deixe uma mensagem..."
                  className="rounded-xl resize-none"
                  rows={3}
                  value={newRequest.message}
                  onChange={(e) => setNewRequest((p) => ({ ...p, message: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="rounded-xl">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleCreate} className="rounded-xl bg-primary hover:bg-primary/90">
                Criar Solicitação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <StatsGrid stats={stats} />

      <RequestList
        title="Solicitações recentes"
        requests={recentRequests.slice(0, 5)}
        onViewAll={() => onNavigate("solicitacoes")}
        userRole={userRole}
        onUpdateStatus={onUpdateStatus}
      />
    </>
  );
};

export default DashboardHome;
