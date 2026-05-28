import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import {
  Ban,
  CalendarDays,
  Car,
  Check,
  ChevronRight,
  Eye,
  FileText,
  Home,
  Monitor,
  Paintbrush,
  Play,
  Sparkles,
  Sprout,
  Wrench,
  Zap,
} from "lucide-react";
import type { ServiceRequest, RequestStatus } from "@/data/mockData";

const CAT_ICON: Record<string, { icon: typeof Wrench; bg: string; color: string }> = {
  encanamento: { icon: Wrench,     bg: "bg-blue-50",    color: "text-blue-600" },
  eletrica:    { icon: Zap,        bg: "bg-amber-50",   color: "text-amber-600" },
  pintura:     { icon: Paintbrush, bg: "bg-rose-50",    color: "text-rose-500" },
  reformas:    { icon: Home,       bg: "bg-emerald-50", color: "text-emerald-600" },
  automotivo:  { icon: Car,        bg: "bg-violet-50",  color: "text-violet-600" },
  limpeza:     { icon: Sparkles,   bg: "bg-pink-50",    color: "text-pink-500" },
  jardinagem:  { icon: Sprout,     bg: "bg-green-50",   color: "text-green-600" },
  tecnologia:  { icon: Monitor,    bg: "bg-sky-50",     color: "text-sky-600" },
  aulas:       { icon: Monitor,    bg: "bg-orange-50",  color: "text-primary" },
};

const STATUS_ACCENT: Record<RequestStatus, string> = {
  pendente: "bg-amber-400",
  aceita: "bg-primary",
  em_andamento: "bg-blue-500",
  concluida: "bg-emerald-500",
  cancelada: "bg-red-400",
};

function getCatIcon(category: string) {
  const key = category.toLowerCase().replace(/[^a-z]/g, "");
  return CAT_ICON[key] ?? { icon: Wrench, bg: "bg-orange-50", color: "text-primary" };
}

interface RequestListProps {
  requests: ServiceRequest[];
  title?: string;
  onViewAll?: () => void;
  emptyMessage?: string;
  userRole?: "cliente" | "prestador";
  onUpdateStatus?: (id: string, status: string) => void;
  onRequestSelect?: (request: ServiceRequest) => void;
  description?: string;
}

const RequestList = ({
  requests,
  title,
  onViewAll,
  emptyMessage = "Nenhuma solicitação encontrada.",
  userRole,
  onUpdateStatus,
  onRequestSelect,
  description,
}: RequestListProps) => (
  <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_18px_60px_-42px_rgba(15,23,42,0.45)]">
    <div className="pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full bg-orange-100/60 blur-3xl" />

    {title && (
      <div className="relative flex flex-col gap-3 border-b border-gray-100 bg-gradient-to-r from-white via-orange-50/50 to-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="font-display text-lg font-bold text-gray-950">{title}</h2>
          {description && (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-500">
              {description}
            </p>
          )}
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1 self-start rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-orange-100 transition-all hover:-translate-y-0.5 hover:shadow-md sm:self-auto"
          >
            Ver todas <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    )}

    {requests.length === 0 ? (
      <EmptyState
        icon={FileText}
        iconBg="bg-orange-50"
        iconColor="text-primary"
        title="Nenhuma solicitação"
        description={emptyMessage}
      />
    ) : (
      <>
        <div className="hidden grid-cols-[minmax(0,2.1fr)_minmax(110px,0.8fr)_minmax(0,1.4fr)_minmax(120px,0.9fr)_auto] gap-4 border-b border-gray-100 bg-gray-50/80 px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 lg:grid">
          <span>Serviço</span>
          <span>Data</span>
          <span>Profissional</span>
          <span>Status</span>
          <span />
        </div>

        <div className="relative divide-y divide-gray-100">
          {requests.map((req) => {
            const catIcon = getCatIcon(req.category);
            const CatIcon = catIcon.icon;
            const showActions = onUpdateStatus && userRole;

            return (
              <div
                key={req.id}
                className="group relative grid gap-4 px-5 py-5 transition-colors hover:bg-orange-50/30 lg:grid-cols-[minmax(0,2.1fr)_minmax(110px,0.8fr)_minmax(0,1.4fr)_minmax(120px,0.9fr)_auto] lg:items-center lg:px-6"
              >
                <span
                  className={cn(
                    "absolute bottom-5 left-0 top-5 w-1 rounded-r-full opacity-80 lg:bottom-4 lg:top-4",
                    STATUS_ACCENT[req.status as RequestStatus] ?? "bg-primary",
                  )}
                />

                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset ring-black/5",
                      catIcon.bg,
                    )}
                  >
                    <CatIcon className={cn("h-5 w-5", catIcon.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-950">{req.service}</p>
                    <p className="mt-1 text-xs font-medium text-gray-400">{req.category}</p>
                    {req.description && (
                      <p className="mt-2 line-clamp-1 text-xs leading-relaxed text-gray-500">
                        {req.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 md:hidden">
                    <CalendarDays className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 lg:hidden">
                      Data
                    </p>
                    <p className="font-medium text-gray-600">{req.date}</p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar className="h-9 w-9 flex-shrink-0 ring-4 ring-orange-50">
                    <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                      {req.providerInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {req.provider}
                    </p>
                    {req.price && (
                      <p className="mt-1 inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-primary">
                        R$ {req.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <StatusBadge status={req.status as RequestStatus} />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
                  {onRequestSelect && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 w-full border-orange-100 px-3 text-xs text-primary shadow-none hover:bg-orange-50 sm:w-auto lg:h-8"
                      onClick={() => onRequestSelect(req)}
                    >
                      <Eye className="h-3.5 w-3.5" /> Detalhes
                    </Button>
                  )}

                  {showActions && (
                    <>
                      {req.status === "pendente" && userRole === "prestador" && (
                        <>
                          <Button
                            size="sm"
                            className="h-9 w-full px-3 text-xs sm:w-auto lg:h-8"
                            onClick={() => onUpdateStatus(req.id, "accepted")}
                          >
                            <Check className="h-3.5 w-3.5" /> Aceitar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 w-full border-red-200 px-3 text-xs text-red-500 shadow-none hover:bg-red-50 sm:w-auto lg:h-8"
                            onClick={() => onUpdateStatus(req.id, "cancelled")}
                          >
                            <Ban className="h-3.5 w-3.5" /> Recusar
                          </Button>
                        </>
                      )}
                      {req.status === "pendente" && userRole === "cliente" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 w-full border-red-200 px-3 text-xs text-red-500 shadow-none hover:bg-red-50 sm:w-auto lg:h-8"
                          onClick={() => onUpdateStatus(req.id, "cancelled")}
                        >
                          <Ban className="h-3.5 w-3.5" /> Cancelar
                        </Button>
                      )}
                      {req.status === "aceita" && userRole === "prestador" && (
                        <Button
                          size="sm"
                          className="h-9 w-full px-3 text-xs sm:w-auto lg:h-8"
                          onClick={() => onUpdateStatus(req.id, "in_progress")}
                        >
                          <Play className="h-3.5 w-3.5" /> Iniciar
                        </Button>
                      )}
                      {req.status === "em_andamento" && userRole === "prestador" && (
                        <Button
                          size="sm"
                          className="h-9 w-full px-3 text-xs sm:w-auto lg:h-8"
                          onClick={() => onUpdateStatus(req.id, "completed")}
                        >
                          <Check className="h-3.5 w-3.5" /> Concluir
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {onViewAll && (
          <div className="border-t border-gray-100 bg-white px-6 py-4 text-center">
            <button
              onClick={onViewAll}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Ver todas as solicitações <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </>
    )}
  </div>
);

export default RequestList;
