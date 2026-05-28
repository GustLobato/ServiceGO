import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { type ComponentType } from "react";
import { type LucideProps } from "lucide-react";
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
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Plus, User, ArrowRight, TrendingUp, Star, Target, Zap,
  CheckCircle2, Clock, BarChart3, Calendar, FileText, Search,
  ChevronRight, X,
} from "lucide-react";
import StatsGrid from "./components/StatsGrid";
import RequestList from "./components/RequestList";
import { type NewRequestForm } from "./hooks/useRequests";
import type { SidebarView } from "./types";
import { type ServiceRequest, type Listing, type RequestStatus } from "@/data/mockData";
import { api } from "@/lib/api";

// ---- Shared interfaces ----

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

interface MetricCard {
  icon: ComponentType<LucideProps>;
  label: string;
  desc: string;
  value: number;
  iconBg: string;
  iconColor: string;
  onClick: () => void;
}

// ---- Activity status map ----

interface ActivityCfg {
  label: string;
  icon: ComponentType<LucideProps>;
  bg: string;
  color: string;
}

const ACTIVITY_STATUS: Record<RequestStatus, ActivityCfg> = {
  pendente:     { label: "Solicitação enviada",    icon: Clock,         bg: "bg-amber-100",  color: "text-amber-600" },
  aceita:       { label: "Solicitação aceita",     icon: CheckCircle2,  bg: "bg-blue-100",   color: "text-blue-600" },
  em_andamento: { label: "Serviço em andamento",   icon: Zap,           bg: "bg-indigo-100", color: "text-indigo-600" },
  concluida:    { label: "Serviço concluído",      icon: CheckCircle2,  bg: "bg-green-100",  color: "text-green-600" },
  cancelada:    { label: "Solicitação cancelada",  icon: X,             bg: "bg-red-100",    color: "text-red-500" },
};

/* ─────────────────────────────────────────────────
   CLIENT DASHBOARD
───────────────────────────────────────────────── */
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

  // Derived data
  const scheduledRequests = recentRequests
    .filter((r) => r.status === "aceita" || r.status === "em_andamento")
    .slice(0, 3);

  const activityItems = recentRequests.slice(0, 5);

  // Metric cards config
  const METRICS: MetricCard[] = [
    {
      icon: FileText,
      label: "Solicitações ativas",
      desc: "Em aberto ou em andamento",
      value: stats.active,
      iconBg: "bg-orange-100",
      iconColor: "text-primary",
      onClick: () => onNavigate("solicitacoes"),
    },
    {
      icon: CheckCircle2,
      label: "Serviços concluídos",
      desc: "Finalizados com sucesso",
      value: stats.completed,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      onClick: () => onNavigate("avaliacoes"),
    },
    {
      icon: Clock,
      label: "Orçamentos recebidos",
      desc: "Aguardando sua resposta",
      value: stats.pending,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      onClick: () => onNavigate("solicitacoes"),
    },
    {
      icon: BarChart3,
      label: "Total de solicitações",
      desc: "Histórico completo",
      value: stats.total,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      onClick: () => onNavigate("solicitacoes"),
    },
  ];

  return (
    <>
      {/* ── Greeting header ── */}
      <div className="flex flex-col gap-4 mb-7 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-0.5 bg-primary rounded" />
            <span className="text-primary text-sm font-semibold">Painel do cliente</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
            Olá, {firstName}!
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Acompanhe suas solicitações e encontre os melhores profissionais.
          </p>
        </div>

        {/* Desktop new request button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-sm shadow-orange-200 rounded-xl hidden sm:flex hover:-translate-y-0.5 transition-all">
              <Plus className="h-4 w-4" />
              Nova solicitação
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

      {/* Mobile new request button */}
      <div className="sm:hidden mb-6">
        <Button
          className="w-full gap-2 bg-primary hover:bg-primary/90 rounded-xl h-12 shadow-md shadow-orange-200"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Nova solicitação de serviço
        </Button>
      </div>

      {/* ── 4 Metric cards ── */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {METRICS.map((m, i) => {
          const MIcon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.35 }}
            >
              <button
                onClick={m.onClick}
                className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group shadow-sm sm:p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${m.iconBg}`}>
                    <MIcon className={`h-5 w-5 ${m.iconColor}`} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="font-display text-2xl font-bold text-gray-900 leading-none tabular-nums sm:text-3xl">
                  {m.value}
                </p>
                <p className="text-sm font-semibold text-gray-700 mt-1.5">{m.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
        <button
          onClick={() => onNavigate("buscar")}
          className="flex items-center gap-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5 text-left hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-200">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Buscar profissionais</p>
            <p className="text-sm text-gray-500 mt-0.5">Encontre o especialista ideal</p>
          </div>
          <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </button>

        <button
          onClick={() => onNavigate("solicitacoes")}
          className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 text-left hover:shadow-md transition-all group shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Minhas solicitações</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Acompanhe seus pedidos
              {stats.active > 0 && (
                <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  {stats.active}
                </span>
              )}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </button>
      </div>

      {/* ── Main + Sidebar layout ── */}
      <div className="flex gap-6 flex-col lg:flex-row">

        {/* Main content */}
        <div className="flex-1 space-y-6 min-w-0">

          {/* Recent requests */}
          <RequestList
            title="Solicitações recentes"
            requests={recentRequests.slice(0, 5)}
            onViewAll={() => onNavigate("solicitacoes")}
            userRole="cliente"
            onUpdateStatus={onUpdateStatus}
          />

          {/* Activity feed */}
          {activityItems.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-blue-500" />
                </div>
                <h2 className="font-display font-semibold text-gray-900">Atividade recente</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {activityItems.map((req) => {
                  const cfg = ACTIVITY_STATUS[req.status] ?? ACTIVITY_STATUS.pendente;
                  const AIcon = cfg.icon;
                  return (
                    <div key={req.id} className="flex flex-col gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors sm:flex-row sm:items-start sm:px-6">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                        <AIcon className={`h-4 w-4 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{cfg.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {req.service}
                          {req.provider && <span className="text-gray-400"> · {req.provider}</span>}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:flex-shrink-0 sm:flex-col sm:items-end">
                        <StatusBadge status={req.status} className="text-[11px]" />
                        <span className="text-[11px] text-gray-400">{req.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-72 xl:w-80 space-y-5 flex-shrink-0">

          {/* Próximos agendamentos */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-4 w-4 text-amber-500" />
              </div>
              <h3 className="font-display font-semibold text-gray-900 text-sm">Próximos agendamentos</h3>
            </div>

            {scheduledRequests.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-5 w-5 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-600">Nenhum agendamento ativo</p>
                <p className="text-xs text-gray-400 mt-1">
                  Solicitações aceitas aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {scheduledRequests.map((req) => (
                  <div key={req.id} className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{req.service}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{req.provider}</p>
                      </div>
                      <StatusBadge status={req.status} className="text-[10px] flex-shrink-0" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">{req.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA — Buscar profissional */}
          <div className="rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-400 p-5 relative overflow-hidden">
            {/* Dot grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.07]"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            {/* Ring */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border border-white/15 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3 border border-white/20">
                <Search className="h-5 w-5 text-white" />
              </div>
              <p className="font-bold text-white text-base leading-snug">
                Precisa de um profissional?
              </p>
              <p className="text-white/75 text-xs mt-1.5 leading-relaxed">
                Encontre o especialista ideal para o seu serviço rapidamente.
              </p>
              <Button
                className="mt-4 w-full bg-white text-primary hover:bg-white/90 font-semibold rounded-xl h-10 text-sm gap-2 shadow-lg"
                onClick={() => onNavigate("buscar")}
              >
                <Search className="h-4 w-4" />
                Buscar profissional
              </Button>
            </div>
          </div>

          {/* Quick stats summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-display font-semibold text-gray-900 text-sm mb-4">Resumo</h3>
            <div className="space-y-3">
              {[
                { label: "Solicitações ativas", value: stats.active, color: "bg-primary" },
                { label: "Orçamentos pendentes", value: stats.pending, color: "bg-purple-500" },
                { label: "Serviços concluídos", value: stats.completed, color: "bg-green-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">{item.label}</span>
                      <span className="text-xs font-bold text-gray-900">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: stats.total > 0 ? `${Math.round((item.value / stats.total) * 100)}%` : "0%" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────
   PROVIDER DASHBOARD  (unchanged)
───────────────────────────────────────────────── */
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
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
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
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-100 rounded-2xl p-5 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
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
            className="w-full rounded-xl bg-primary hover:bg-primary/90 shrink-0 sm:w-auto"
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
            <div className="flex flex-wrap items-center gap-2">
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

/* ─────────────────────────────────────────────────
   MAIN COMPONENT  (unchanged)
───────────────────────────────────────────────── */
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
