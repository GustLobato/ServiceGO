import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Star, MapPin, Search, Wrench, Zap, Paintbrush, Home,
  Car, Sparkles, Sprout, Monitor, Loader2, Send, Clock,
} from "lucide-react";
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

const CAT_META: Record<string, {
  icon: typeof Wrench;
  gradient: string;
  iconBg: string;
  iconColor: string;
  pillBg: string;
  pillText: string;
}> = {
  "Encanamento": { icon: Wrench,     gradient: "from-blue-400 to-blue-600",      iconBg: "bg-blue-100",    iconColor: "text-blue-600",   pillBg: "bg-blue-50",    pillText: "text-blue-600" },
  "Elétrica":   { icon: Zap,        gradient: "from-amber-400 to-orange-500",   iconBg: "bg-amber-100",   iconColor: "text-amber-500",  pillBg: "bg-amber-50",   pillText: "text-amber-600" },
  "Pintura":    { icon: Paintbrush, gradient: "from-rose-400 to-rose-600",      iconBg: "bg-rose-100",    iconColor: "text-rose-500",   pillBg: "bg-rose-50",    pillText: "text-rose-600" },
  "Reformas":   { icon: Home,       gradient: "from-green-400 to-emerald-600",  iconBg: "bg-green-100",   iconColor: "text-green-600",  pillBg: "bg-green-50",   pillText: "text-green-700" },
  "Tecnologia": { icon: Monitor,    gradient: "from-sky-400 to-sky-600",        iconBg: "bg-sky-100",     iconColor: "text-sky-600",    pillBg: "bg-sky-50",     pillText: "text-sky-600" },
  "Limpeza":    { icon: Sparkles,   gradient: "from-pink-400 to-rose-500",      iconBg: "bg-pink-100",    iconColor: "text-pink-500",   pillBg: "bg-pink-50",    pillText: "text-pink-600" },
  "Jardinagem": { icon: Sprout,     gradient: "from-emerald-400 to-teal-600",   iconBg: "bg-emerald-100", iconColor: "text-emerald-600",pillBg: "bg-emerald-50", pillText: "text-emerald-700" },
  "Automotivo": { icon: Car,        gradient: "from-purple-400 to-purple-600",  iconBg: "bg-purple-100",  iconColor: "text-purple-600", pillBg: "bg-purple-50",  pillText: "text-purple-600" },
};

const DEFAULT_META = {
  icon: Wrench,
  gradient: "from-gray-400 to-gray-500",
  iconBg: "bg-gray-100",
  iconColor: "text-gray-500",
  pillBg: "bg-gray-50",
  pillText: "text-gray-600",
};

function getCatMeta(category: string) {
  return CAT_META[category] ?? DEFAULT_META;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatPrice(price: number, type: string) {
  const formatted = price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  if (type === "hourly") return `${formatted}/h`;
  if (type === "negotiable") return "Negociável";
  return formatted;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`h-3.5 w-3.5 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
      {count > 0 && <span className="text-xs text-gray-400">({count})</span>}
    </div>
  );
}

const SearchView = ({ searchQuery, onSearchChange }: SearchViewProps) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [requesting, setRequesting] = useState<string | null>(null);

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
    mutationFn: (listingId: string) => api.post("/api/requests", { listingId }),
    onMutate: (listingId) => setRequesting(listingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requests"] });
      toast({ title: "Solicitação enviada!", description: "O prestador será notificado." });
      setRequesting(null);
    },
    onError: (e: Error) => {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
      setRequesting(null);
    },
  });

  const listings = data?.listings ?? [];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Buscar Serviços</h1>
        <p className="text-gray-500 mt-1.5">Encontre o profissional perfeito para o que você precisa</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Buscar por serviço, profissional ou categoria..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-14 rounded-2xl border-gray-200 bg-white shadow-sm text-base focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory("")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            selectedCategory === ""
              ? "bg-primary text-white border-primary shadow-sm shadow-orange-200"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          Todas
        </button>
        {CATEGORIES.map((cat) => {
          const meta = getCatMeta(cat);
          const CatIcon = meta.icon;
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                active
                  ? `${meta.pillBg} ${meta.pillText} border-current shadow-sm`
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <CatIcon className={`h-3.5 w-3.5 ${active ? meta.iconColor : "text-gray-400"}`} />
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-gray-500 mb-5">
          {listings.length === 0
            ? "Nenhum serviço encontrado"
            : `${listings.length} serviço${listings.length !== 1 ? "s" : ""} encontrado${listings.length !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm">Buscando serviços...</span>
        </div>
      )}

      {/* Empty */}
      {!isLoading && listings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Search className="h-7 w-7 text-gray-300" />
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-600">Nenhum serviço encontrado</p>
            <p className="text-sm mt-1">Tente outros termos ou remova os filtros</p>
          </div>
        </div>
      )}

      {/* Listing cards grid */}
      {!isLoading && listings.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => {
            const meta = getCatMeta(listing.category);
            const CatIcon = meta.icon;
            const initials = getInitials(listing.provider.name);
            const isPending = requesting === listing.id;

            return (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
                {/* Card header — gradient with icon */}
                <div className={`relative h-32 bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}>
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <CatIcon className="h-8 w-8 text-white" />
                  </div>

                  {/* Category badge top-right */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wide">
                    {listing.category}
                  </span>

                  {/* Provider avatar bottom-left */}
                  <div className="absolute bottom-0 left-4 translate-y-1/2">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-700">{initials}</span>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="pt-9 px-5 pb-5 flex flex-col flex-1">
                  <p className="text-xs text-gray-500 mb-1">por {listing.provider.name}</p>
                  <h3 className="font-display font-bold text-gray-900 text-base leading-snug mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {listing.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <StarRating rating={listing.rating} count={listing.reviewCount} />
                    {listing.location && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        {listing.location}
                      </div>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-xs text-gray-400">A partir de</p>
                      <p className="font-display font-bold text-primary text-lg leading-none">
                        {formatPrice(listing.price, listing.priceType)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1.5 bg-primary hover:bg-primary/90 rounded-xl shadow-sm shadow-orange-200 h-9 px-4"
                      onClick={() => requestMutation.mutate(listing.id)}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                      Solicitar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Results info */}
      {!isLoading && listings.length > 0 && (
        <div className="mt-8 flex items-center gap-2 text-xs text-gray-400 justify-center">
          <Clock className="h-3.5 w-3.5" />
          Resultados atualizados em tempo real
        </div>
      )}
    </div>
  );
};

export default SearchView;
