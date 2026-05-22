/**
 * SearchView — busca de serviços disponíveis via API.
 */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Send } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES, type Listing } from "@/data/mockData";
import type { SidebarView } from "./types";

interface SearchViewProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigate: (view: SidebarView) => void;
}

interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const SearchView = ({
  searchQuery,
  onSearchChange,
  onNavigate,
}: SearchViewProps) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["listings", searchQuery, selectedCategory],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory) params.set("category", selectedCategory);
      params.set("limit", "20");
      return api.get<ListingsResponse>(`/api/listings?${params}`);
    },
  });

  const requestMutation = useMutation({
    mutationFn: (listingId: string) =>
      api.post("/api/requests", { listingId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requests"] });
      toast({ title: "Solicitação enviada!", description: "O prestador será notificado." });
    },
    onError: (e: Error) => {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    },
  });

  const listings = data?.listings ?? [];

  return (
    <>
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">
        Buscar Serviços
      </h1>
      <p className="text-muted-foreground text-sm mb-6">
        Encontre profissionais para o que você precisa
      </p>

      <div className="mb-4">
        <Input
          placeholder="Buscar serviços..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Categorias */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge
          variant={selectedCategory === "" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedCategory("")}
        >
          Todas
        </Badge>
        {CATEGORIES.map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Listagens */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando serviços...</div>
      ) : listings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum serviço encontrado. Tente outra busca.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display font-semibold text-foreground leading-tight">
                    {listing.title}
                  </h3>
                  <Badge variant="outline" className="shrink-0 ml-2">
                    {listing.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {listing.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <span className="font-semibold text-foreground">
                    R$ {listing.price.toFixed(2)}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {listing.rating.toFixed(1)}
                  </span>
                  {listing.location && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {listing.location}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    por {listing.provider.name}
                  </span>
                  <Button
                    size="sm"
                    className="gap-1"
                    onClick={() => requestMutation.mutate(listing.id)}
                    disabled={requestMutation.isPending}
                  >
                    <Send className="h-3 w-3" /> Solicitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default SearchView;
