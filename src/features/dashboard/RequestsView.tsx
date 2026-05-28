import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Filter,
  Search,
  Sparkles,
} from "lucide-react";
import RequestList from "./components/RequestList";
import ScheduleStatCard from "./components/ScheduleStatCard";
import type { ServiceRequest } from "@/data/mockData";

interface RequestsViewProps {
  filteredRequests: ServiceRequest[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  userRole?: "cliente" | "prestador";
  onUpdateStatus?: (id: string, status: string) => void;
  onRequestSelect?: (request: ServiceRequest) => void;
}

const STATUS_OPTIONS = [
  { value: "all",          label: "Todos os status" },
  { value: "pendente",     label: "Pendente" },
  { value: "aceita",       label: "Aceita" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida",    label: "Concluída" },
  { value: "cancelada",    label: "Cancelada" },
];

const RequestsView = ({
  filteredRequests,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  userRole,
  onUpdateStatus,
  onRequestSelect,
}: RequestsViewProps) => {
  const activeCount = filteredRequests.filter(
    (req) => req.status === "aceita" || req.status === "em_andamento",
  ).length;
  const pendingCount = filteredRequests.filter((req) => req.status === "pendente").length;
  const completedCount = filteredRequests.filter((req) => req.status === "concluida").length;
  const viewTitle = userRole === "prestador" ? "Agenda de atendimentos" : "Meus agendamentos";
  const viewDescription =
    userRole === "prestador"
      ? "Organize solicitações recebidas, aceite novos serviços e acompanhe cada atendimento em tempo real."
      : "Acompanhe serviços solicitados, status, valores e próximos passos em uma agenda simples e visual.";

  return (
    <div className="relative overflow-hidden space-y-6 pb-8">
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-orange-100/70 blur-3xl" />
      <div className="pointer-events-none absolute left-1/4 top-32 h-40 w-40 rounded-full bg-amber-100/60 blur-3xl" />

      <section className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-5 shadow-[0_24px_80px_-48px_rgba(249,115,22,0.7)] sm:p-7">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-orange-50 via-orange-50/60 to-transparent" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="sg-accent-line mb-3">ServiceGO Agenda</div>
            <h1 className="font-display text-3xl font-bold text-gray-950 sm:text-4xl">
              {viewTitle}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
              {viewDescription}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-orange-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold leading-none text-gray-950">
                  {filteredRequests.length}
                </p>
                <p className="mt-1 text-xs font-medium text-gray-500">
                  {filteredRequests.length === 1 ? "item encontrado" : "itens encontrados"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ScheduleStatCard
          icon={CalendarCheck}
          label="Na agenda"
          value={activeCount}
          detail="Aceitos ou em andamento"
          tone="orange"
        />
        <ScheduleStatCard
          icon={Clock3}
          label="Aguardando"
          value={pendingCount}
          detail="Pendentes de resposta"
          tone="amber"
        />
        <ScheduleStatCard
          icon={CheckCircle2}
          label="Concluídos"
          value={completedCount}
          detail="Serviços finalizados"
          tone="green"
        />
        <ScheduleStatCard
          icon={Filter}
          label="Filtrados"
          value={filteredRequests.length}
          detail={statusFilter === "all" ? "Mostrando todos os status" : "Filtro ativo aplicado"}
          tone="slate"
        />
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm shadow-gray-200/70 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por serviço, categoria ou profissional..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="sg-input h-12 pl-10 text-sm shadow-none"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-1.5">
            <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-400 shadow-sm sm:flex">
              <Filter className="h-4 w-4" />
            </div>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="h-11 w-full min-w-0 rounded-xl border-gray-200 bg-white shadow-none focus:border-primary sm:w-56">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <RequestList
        title="Linha do tempo"
        description="Todos os serviços seguem conectados aos mesmos dados e status da sua conta."
        requests={filteredRequests}
        userRole={userRole}
        onUpdateStatus={onUpdateStatus}
        onRequestSelect={onRequestSelect}
        emptyMessage={
          statusFilter !== "all"
            ? "Nenhuma solicitação com esse status."
            : "Nenhuma solicitação encontrada. Tente buscar por outro termo."
        }
      />
    </div>
  );
};

export default RequestsView;
