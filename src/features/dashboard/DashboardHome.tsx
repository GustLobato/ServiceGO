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
import { Plus, User, ArrowRight, TrendingUp, Star, Target, Zap } from "lucide-react";
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
  userRole?: "cliente" | "prestador" | "admin";
  onUpdateStatus?: (id: string, status: string) => void;
}

interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/* ─── CLIENT DASHBOARD ─── */
const ClientDashboard = ({
  firstName,
  stats,
  recentRequests,
  onNavigate,
  onCreateRequest,
  onUpdateStatus,
}: {
  firstName: string;
  stats: DashboardHomeProps["stats"];
  recentRequests: ServiceRequest[];
  onNavigate: (view: SidebarView) => void;
  onCreateRequest: (form: NewRequestForm) => boolean;
  onUpdateStatus?: (id: string, status: string) => void;
}) => {
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
            <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-sm shadow-orange-200 rounded-xl hidden sm:flex">
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
                <Select
                  value={newRequest.listingId}
                  onValueChange={(v) => setNewRequest((p) => ({ ...p, listingId: v }))}
                >
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

      {/* Quick action bar — mobile */}
      <div className="sm:hidden mb-6">
        <Button
          className="w-full gap-2 bg-primary hover:bg-primary/90 rounded-xl h-12"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-5 w-5" /> Nova solicitação de serviço
        </Button>
      </div>

      <StatsGrid stats={stats} userRole="cliente" />

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => onNavigate("buscar")}
          className="flex items-center gap-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5 text-left hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Buscar serviços</p>
            <p className="text-sm text-gray-500 mt-0.5">Encontre o profissional ideal</p>
          </div>
          <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => onNavigate("solicitacoes")}
          className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 text-left hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Minhas solicitações</p>
            <p className="text-sm text-gray-500 mt-0.5">Acompanhe seus pedidos</p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <RequestList
        title="Solicitações recentes"
        requests={recentRequests.slice(0, 5)}
        onViewAll={() => onNavigate("solicitacoes")}
        userRole="cliente"
        onUpdateStatus={onUpdateStatus}
      />
    </>
  );
};

/* ─── PROVIDER DASHBOARD ─── */
const ProviderDashboard = ({
  firstName,
  stats,
  recentRequests,
  onNavigate,
  onUpdateStatus,
}: {
  firstName: string;
  stats: DashboardHomeProps["stats"];
  recentRequests: ServiceRequest[];
  onNavigate: (view: SidebarView) => void;
  onUpdateStatus?: (id: string, status: string) => void;
}) => {
  const newLeads = recentRequests.filter((r) => r.status === "pendente");
  const hasIncompleteProfile = true;

  return (
    <>
      {/* Welcome header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Olá, {firstName}! 👋
          </h1>
          <p className="text-gray-500 mt-1.5">
            Aqui estão seus leads e solicitações de hoje.
          </p>
        </div>
        <Button
          onClick={() => onNavigate("perfil")}
          variant="outline"
          className="gap-2 rounded-xl border-gray-200 hover:border-primary hover:text-primary hidden sm:flex"
        >
          <User className="h-4 w-4" /> Meu perfil
        </Button>
      </div>

      {/* Complete profile banner */}
      {hasIncompleteProfile && (
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-100 rounded-2xl p-5 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Star className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Complete seu perfil</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Perfis completos recebem até <strong>3× mais leads</strong>. Adicione bio, foto e serviços.
            </p>
          </div>
          <Button
            size="sm"
            className="rounded-xl bg-primary hover:bg-primary/90 shrink-0"
            onClick={() => onNavigate("perfil")}
          >
            Completar
          </Button>
        </div>
      )}

      <StatsGrid stats={stats} userRole="prestador" />

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => onNavigate("solicitacoes")}
          className="flex items-center gap-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5 text-left hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">Novos leads</p>
              {newLeads.length > 0 && (
                <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                  {newLeads.length}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">Solicitações aguardando resposta</p>
          </div>
          <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => onNavigate("avaliacoes")}
          className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 text-left hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Star className="h-6 w-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Avaliações</p>
            <p className="text-sm text-gray-500 mt-0.5">Veja o que seus clientes dizem</p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Requests received */}
      <RequestList
        title="Solicitações recebidas"
        requests={recentRequests.slice(0, 5)}
        onViewAll={() => onNavigate("solicitacoes")}
        userRole="prestador"
        onUpdateStatus={onUpdateStatus}
        emptyMessage="Nenhuma solicitação recebida ainda."
      />
    </>
  );
};

/* ─── MAIN COMPONENT ─── */
const DashboardHome = ({
  userName,
  stats,
  recentRequests,
  onNavigate,
  onCreateRequest,
  userRole,
  onUpdateStatus,
}: DashboardHomeProps) => {
  const firstName = userName.split(" ")[0];

  if (userRole === "prestador") {
    return (
      <ProviderDashboard
        firstName={firstName}
        stats={stats}
        recentRequests={recentRequests}
        onNavigate={onNavigate}
        onUpdateStatus={onUpdateStatus}
      />
    );
  }

  return (
    <ClientDashboard
      firstName={firstName}
      stats={stats}
      recentRequests={recentRequests}
      onNavigate={onNavigate}
      onCreateRequest={onCreateRequest}
      onUpdateStatus={onUpdateStatus}
    />
  );
};

export default DashboardHome;
