/**
 * RequestList — componente extraído do Dashboard.
 * Exibe uma lista de solicitações de serviço com badges de status e ações interativas.
 */
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, CheckCircle2, AlertCircle, ChevronRight, Ban, Play, Check } from "lucide-react";
import type { ServiceRequest, RequestStatus } from "@/data/mockData";

const statusConfig: Record<
  RequestStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: typeof Clock;
  }
> = {
  pendente: { label: "Pendente", variant: "outline", icon: Clock },
  aceita: { label: "Aceita", variant: "secondary", icon: CheckCircle2 },
  em_andamento: { label: "Em andamento", variant: "default", icon: AlertCircle },
  concluida: { label: "Concluída", variant: "secondary", icon: CheckCircle2 },
  cancelada: { label: "Cancelada", variant: "destructive", icon: AlertCircle },
};

interface RequestListProps {
  requests: ServiceRequest[];
  title?: string;
  description?: string;
  onViewAll?: () => void;
  emptyMessage?: string;
  userRole?: "cliente" | "prestador";
  onUpdateStatus?: (id: string, status: string) => void;
}

const RequestList = ({
  requests,
  title,
  description,
  onViewAll,
  emptyMessage = "Nenhuma solicitação encontrada.",
  userRole,
  onUpdateStatus,
}: RequestListProps) => (
  <Card>
    {title && (
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-lg">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {onViewAll && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-primary"
              onClick={onViewAll}
            >
              Ver todas <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
    )}
    <CardContent>
      {requests.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const config = statusConfig[req.status] || { label: req.status, variant: "outline", icon: Clock };
            const showActions = onUpdateStatus && userRole;

            return (
              <div
                key={req.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-border"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {req.providerInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-foreground truncate">
                      {req.service}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {req.provider} · {req.category}
                      {req.description && (
                        <span className="block mt-1 italic text-muted-foreground/80 line-clamp-1">
                          "{req.description}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right hidden md:block shrink-0">
                    <div className="text-xs text-muted-foreground">{req.date}</div>
                    {req.price && (
                      <div className="text-xs font-semibold text-foreground mt-0.5">
                        R$ {req.price.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <Badge
                    variant={config.variant}
                    className="text-xs gap-1 shrink-0 capitalize"
                  >
                    <config.icon className="h-3 w-3" />
                    {config.label}
                  </Badge>

                  {/* Botões de Ação para gerenciar o status da solicitação */}
                  {showActions && (
                    <div className="flex items-center gap-1.5 ml-2">
                      {req.status === "pendente" && userRole === "prestador" && (
                        <>
                          <Button
                            size="sm"
                            className="h-8 gap-1 px-2.5"
                            onClick={() => onUpdateStatus(req.id, "accepted")}
                          >
                            <Check className="h-3.5 w-3.5" /> Aceitar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1 px-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
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
                          className="h-8 gap-1 px-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onUpdateStatus(req.id, "cancelled")}
                        >
                          <Ban className="h-3.5 w-3.5" /> Cancelar
                        </Button>
                      )}
                      {req.status === "aceita" && userRole === "prestador" && (
                        <Button
                          size="sm"
                          className="h-8 gap-1 px-2.5"
                          onClick={() => onUpdateStatus(req.id, "in_progress")}
                        >
                          <Play className="h-3.5 w-3.5" /> Iniciar
                        </Button>
                      )}
                      {req.status === "aceita" && userRole === "cliente" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1 px-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onUpdateStatus(req.id, "cancelled")}
                        >
                          <Ban className="h-3.5 w-3.5" /> Cancelar
                        </Button>
                      )}
                      {req.status === "em_andamento" && userRole === "prestador" && (
                        <Button
                          size="sm"
                          className="h-8 gap-1 px-2.5"
                          onClick={() => onUpdateStatus(req.id, "completed")}
                        >
                          <Check className="h-3.5 w-3.5" /> Concluir
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CardContent>
  </Card>
);

export default RequestList;
