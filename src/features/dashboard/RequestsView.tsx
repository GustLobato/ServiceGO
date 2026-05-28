import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import RequestList from "./components/RequestList";
import type { ServiceRequest } from "@/data/mockData";

interface RequestsViewProps {
  filteredRequests: ServiceRequest[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  userRole?: "cliente" | "prestador";
  onUpdateStatus?: (id: string, status: string) => void;
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
}: RequestsViewProps) => (
  <div>
    {/* Header */}
    <div className="mb-8">
      <h1 className="font-display text-3xl font-bold text-gray-900">
        {userRole === "prestador" ? "Solicitações recebidas" : "Minhas Solicitações"}
      </h1>
      <p className="text-gray-500 mt-1.5">
        {filteredRequests.length === 0
          ? "Nenhuma solicitação encontrada"
          : `${filteredRequests.length} solicitaç${filteredRequests.length !== 1 ? "ões" : "ão"} encontrada${filteredRequests.length !== 1 ? "s" : ""}`}
      </p>
    </div>

    {/* Filters bar */}
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por serviço ou profissional..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-11 rounded-xl border-gray-200 focus:border-primary"
        />
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-48 h-11 rounded-xl border-gray-200 focus:border-primary">
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

    <RequestList
      requests={filteredRequests}
      userRole={userRole}
      onUpdateStatus={onUpdateStatus}
      emptyMessage={
        statusFilter !== "all"
          ? "Nenhuma solicitação com esse status."
          : "Nenhuma solicitação encontrada. Tente buscar por outro termo."
      }
    />
  </div>
);

export default RequestsView;
