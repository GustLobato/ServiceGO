/**
 * RequestsView — view completa de todas as solicitações com filtros.
 */
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RequestList from "./components/RequestList";
import type { ServiceRequest } from "@/data/mockData";

interface RequestsViewProps {
  filteredRequests: ServiceRequest[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
}

const RequestsView = ({
  filteredRequests,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: RequestsViewProps) => (
  <>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Minhas Solicitações
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {filteredRequests.length} solicitações encontradas
        </p>
      </div>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Filtrar status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="aceita">Aceita</SelectItem>
          <SelectItem value="em_andamento">Em andamento</SelectItem>
          <SelectItem value="concluida">Concluída</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Mobile search */}
    <div className="md:hidden mb-4">
      <Input
        placeholder="Buscar..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>

    <RequestList requests={filteredRequests} />
  </>
);

export default RequestsView;
