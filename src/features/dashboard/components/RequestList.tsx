import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, AlertCircle, Ban, Play, Check, ChevronRight, Wrench, Zap, Paintbrush, Home, Car, Scissors, Monitor, BookOpen } from "lucide-react";
import type { ServiceRequest, RequestStatus } from "@/data/mockData";

/* ── Status config ── */
const STATUS_CONFIG: Record<RequestStatus, { label: string; dot: string; text: string; bg: string }> = {
  pendente:     { label: "Aguardando resposta", dot: "bg-amber-400",  text: "text-amber-600",  bg: "bg-amber-50" },
  aceita:       { label: "Aceita",              dot: "bg-blue-400",   text: "text-blue-600",   bg: "bg-blue-50" },
  em_andamento: { label: "Em andamento",        dot: "bg-blue-500",   text: "text-blue-700",   bg: "bg-blue-50" },
  concluida:    { label: "Concluído",           dot: "bg-green-500",  text: "text-green-700",  bg: "bg-green-50" },
  cancelada:    { label: "Cancelado",           dot: "bg-red-400",    text: "text-red-600",    bg: "bg-red-50" },
};

/* ── Category icon map ── */
const CAT_ICON: Record<string, { icon: typeof Wrench; bg: string; color: string }> = {
  encanamento: { icon: Wrench,     bg: "bg-blue-100",   color: "text-blue-600" },
  eletrica:    { icon: Zap,        bg: "bg-amber-100",  color: "text-amber-500" },
  pintura:     { icon: Paintbrush, bg: "bg-rose-100",   color: "text-rose-500" },
  reformas:    { icon: Home,       bg: "bg-green-100",  color: "text-green-600" },
  automotivo:  { icon: Car,        bg: "bg-purple-100", color: "text-purple-600" },
  estetica:    { icon: Scissors,   bg: "bg-pink-100",   color: "text-pink-500" },
  tecnologia:  { icon: Monitor,    bg: "bg-sky-100",    color: "text-sky-600" },
  aulas:       { icon: BookOpen,   bg: "bg-orange-100", color: "text-orange-500" },
};

function getCatIcon(category: string) {
  const key = category.toLowerCase().replace(/[^a-z]/g, "");
  return CAT_ICON[key] ?? { icon: Wrench, bg: "bg-gray-100", color: "text-gray-500" };
}

interface RequestListProps {
  requests: ServiceRequest[];
  title?: string;
  onViewAll?: () => void;
  emptyMessage?: string;
  userRole?: "cliente" | "prestador";
  onUpdateStatus?: (id: string, status: string) => void;
  description?: string;
}

const RequestList = ({ requests, title, onViewAll, emptyMessage = "Nenhuma solicitação encontrada.", userRole, onUpdateStatus }: RequestListProps) => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
    {title && (
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="font-display font-semibold text-gray-900">{title}</h2>
        {onViewAll && (
          <button onClick={onViewAll} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            Ver todas <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    )}

    {requests.length === 0 ? (
      <p className="text-center text-gray-400 py-12 text-sm">{emptyMessage}</p>
    ) : (
      <>
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1.5fr_1fr_auto] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <span>Serviço</span>
          <span>Data</span>
          <span>Profissional</span>
          <span>Status</span>
          <span />
        </div>

        <div className="divide-y divide-gray-50">
          {requests.map((req) => {
            const cfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.pendente;
            const catIcon = getCatIcon(req.category);
            const CatIcon = catIcon.icon;
            const showActions = onUpdateStatus && userRole;

            return (
              <div key={req.id} className="grid md:grid-cols-[2fr_1fr_1.5fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-gray-50/60 transition-colors">
                {/* Service */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${catIcon.bg} flex items-center justify-center flex-shrink-0`}>
                    <CatIcon className={`h-4.5 w-4.5 ${catIcon.color}`} style={{ width: 18, height: 18 }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{req.service}</p>
                    <p className="text-xs text-gray-400">{req.category}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="text-sm text-gray-600">{req.date}</div>

                {/* Provider */}
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {req.providerInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{req.provider}</p>
                    {req.price && (
                      <p className="text-xs text-primary font-semibold">R$ {req.price.toFixed(2)}</p>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  {showActions && (
                    <>
                      {req.status === "pendente" && userRole === "prestador" && (
                        <>
                          <Button size="sm" className="h-8 px-3 text-xs gap-1" onClick={() => onUpdateStatus(req.id, "accepted")}>
                            <Check className="h-3.5 w-3.5" /> Aceitar
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 px-3 text-xs text-red-500 border-red-200 hover:bg-red-50" onClick={() => onUpdateStatus(req.id, "cancelled")}>
                            <Ban className="h-3.5 w-3.5" /> Recusar
                          </Button>
                        </>
                      )}
                      {req.status === "pendente" && userRole === "cliente" && (
                        <Button size="sm" variant="outline" className="h-8 px-3 text-xs text-red-500 border-red-200 hover:bg-red-50" onClick={() => onUpdateStatus(req.id, "cancelled")}>
                          <Ban className="h-3.5 w-3.5" /> Cancelar
                        </Button>
                      )}
                      {req.status === "aceita" && userRole === "prestador" && (
                        <Button size="sm" className="h-8 px-3 text-xs gap-1" onClick={() => onUpdateStatus(req.id, "in_progress")}>
                          <Play className="h-3.5 w-3.5" /> Iniciar
                        </Button>
                      )}
                      {req.status === "em_andamento" && userRole === "prestador" && (
                        <Button size="sm" className="h-8 px-3 text-xs gap-1" onClick={() => onUpdateStatus(req.id, "completed")}>
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
          <div className="px-6 py-4 border-t border-gray-50 text-center">
            <button onClick={onViewAll} className="text-sm text-primary font-semibold hover:underline">
              Ver todas as solicitações
            </button>
          </div>
        )}
      </>
    )}
  </div>
);

export default RequestList;
