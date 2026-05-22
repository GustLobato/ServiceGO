/**
 * SearchView — view de busca por categorias de serviço.
 */
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/data/mockData";
import type { SidebarView } from "./types";

interface SearchViewProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigate: (view: SidebarView) => void;
}

const SearchView = ({
  searchQuery,
  onSearchChange,
  onNavigate,
}: SearchViewProps) => (
  <>
    <h1 className="font-display text-2xl font-bold text-foreground mb-2">
      Buscar Serviços
    </h1>
    <p className="text-muted-foreground text-sm mb-6">
      Encontre profissionais para o que você precisa
    </p>

    {/* Campo de busca visível apenas em mobile (desktop usa o header) */}
    <div className="md:hidden mb-4">
      <Input
        placeholder="Buscar serviços..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {CATEGORIES.map((cat) => (
        <Card
          key={cat}
          className="group cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all"
          onClick={() => {
            onSearchChange(cat);
            onNavigate("solicitacoes");
          }}
        >
          <CardContent className="p-6 text-center">
            <h3 className="font-display font-semibold text-foreground">{cat}</h3>
            <p className="text-xs text-muted-foreground mt-1">Ver profissionais</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </>
);

export default SearchView;
