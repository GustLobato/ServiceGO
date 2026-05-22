/**
 * RequestList — componente extraído do Dashboard.
 * Exibe uma lista de solicitações de serviço com badges de status.
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
import { Clock, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
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
};

interface RequestListProps {
  requests: ServiceRequest[];
  title?: string;
  description?: string;
  onViewAll?: () => void;
  emptyMessage?: string;
}

const RequestList = ({
  requests,
  title,
  description,
  onViewAll,
  emptyMessage = "Nenhuma solicitação encontrada.",
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
            const config = statusConfig[req.status];
            return (
              <div
                key={req.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
              >
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
                  </div>
                </div>
                <div className="text-right hidden sm:block shrink-0">
                  <div className="text-xs text-muted-foreground">{req.date}</div>
                </div>
                <Badge
                  variant={config.variant}
                  className="text-xs gap-1 shrink-0"
                >
                  <config.icon className="h-3 w-3" />
                  {config.label}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </CardContent>
  </Card>
);

export default RequestList;
