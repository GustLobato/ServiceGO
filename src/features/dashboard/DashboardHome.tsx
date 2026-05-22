/**
 * DashboardHome — view principal do Dashboard.
 * Exibe estatísticas e as últimas solicitações.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CATEGORIES, type NewRequestForm } from "./hooks/useRequests";
import type { SidebarView } from "./types";
import type { ServiceRequest } from "@/data/mockData";

interface DashboardHomeProps {
  userName: string;
  stats: { total: number; active: number; pending: number; completed: number };
  recentRequests: ServiceRequest[];
  onNavigate: (view: SidebarView) => void;
  onCreateRequest: (form: NewRequestForm) => boolean;
}

const DashboardHome = ({
  userName,
  stats,
  recentRequests,
  onNavigate,
  onCreateRequest,
}: DashboardHomeProps) => {
  const [newRequest, setNewRequest] = useState<NewRequestForm>({
    service: "",
    category: "",
    description: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreate = () => {
    const ok = onCreateRequest(newRequest);
    if (ok) {
      setNewRequest({ service: "", category: "", description: "" });
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
                Preencha os dados para criar uma nova solicitação.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="req-service">Serviço *</Label>
                <Input
                  id="req-service"
                  placeholder="Ex: Reparo de encanamento"
                  value={newRequest.service}
                  onChange={(e) =>
                    setNewRequest((p) => ({ ...p, service: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="req-category">Categoria *</Label>
                <Select
                  value={newRequest.category}
                  onValueChange={(v) =>
                    setNewRequest((p) => ({ ...p, category: v }))
                  }
                >
                  <SelectTrigger id="req-category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="req-description">Descrição</Label>
                <Textarea
                  id="req-description"
                  placeholder="Descreva o que precisa..."
                  value={newRequest.description}
                  onChange={(e) =>
                    setNewRequest((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              {/* Não usa DialogClose aqui para poder controlar o fechamento via lógica */}
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
      />
    </>
  );
};

export default DashboardHome;
