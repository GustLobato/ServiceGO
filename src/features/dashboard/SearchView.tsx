import { useState, useMemo, type ComponentType } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Star, MapPin, Search, Wrench, Zap, Paintbrush, Home,
  Car, Sparkles, Sprout, Monitor, Loader2, Send, BadgeCheck,
  SlidersHorizontal, X, ChevronDown, ChevronUp,
  type LucideProps,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES, type Listing } from "@/data/mockData";
import type { SidebarView } from "./types";

// ── Category metadata ──────────────────────────────────────────
const CAT_META: Record<string, {
  icon: ComponentType<LucideProps>;
  iconBg: string;
  iconColor: string;
  pillBg: string;
  pillText: string;
}> = {
  "Encanamento": { icon: Wrench,     iconBg: "bg-blue-100",    iconColor: "text-blue-600",    pillBg: "bg-blue-50",    pillText: "text-blue-700" },
  "Elétrica":   { icon: Zap,        iconBg: "bg-amber-100",   iconColor: "text-amber-600",   pillBg: "bg-amber-50",   pillText: "text-amber-700" },
  "Pintura":    { icon: Paintbrush, iconBg: "bg-rose-100",    iconColor: "text-rose-600",    pillBg: "bg-rose-50",    pillText: "text-rose-700" },
  "Reformas":   { icon: Home,       iconBg: "bg-green-100",   iconColor: "text-green-700",   pillBg: "bg-green-50",   pillText: "text-green-800" },
  "Tecnologia": { icon: Monitor,    iconBg: "bg-sky-100",     iconColor: "text-sky-600",     pillBg: "bg-sky-50",     pillText: "text-sky-700" },
  "Limpeza":    { icon: Sparkles,   iconBg: "bg-pink-100",    iconColor: "text-pink-600",    pillBg: "bg-pink-50",    pillText: "text-pink-700" },
  "Jardinagem": { icon: Sprout,     iconBg: "bg-emerald-100", iconColor: "text-emerald-700", pillBg: "bg-emerald-50", pillText: "text-emerald-800" },
  "Automotivo": { icon: Car,        iconBg: "bg-purple-100",  iconColor: "text-purple-600",  pillBg: "bg-purple-50",  pillText: "text-purple-700" },
};

const DEFAULT_META: { icon: ComponentType<LucideProps>; iconBg: string; iconColor: string; pillBg: string; pillText: string } = { icon: Wrench, iconBg: "bg-gray-100", iconColor: "text-gray-500", pillBg: "bg-gray-50", pillText: "text-gray-600" };
const getCatMeta = (cat: string) => CAT_META[cat] ?? DEFAULT_META;

// ── Avatar helpers ─────────────────────────────────────────────
const GRADIENTS = [
  "from-blue-400 to-blue-600", "from-purple-400 to-violet-600",
  "from-emerald-400 to-teal-600", "from-rose-400 to-rose-600",
  "from-amber-400 to-orange-500", "from-pink-400 to-pink-600",
  "from-sky-400 to-sky-600", "from-green-400 to-emerald-600",
];

const getGradient = (name: string) =>
  GRADIENTS[name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length];

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const formatPrice = (price: number, type: string) => {
  const fmt = price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  if (type === "hourly") return `${fmt}/h`;
  if (type === "negotiable") return "Negociável";
  return fmt;
};

// Simple heuristic: rating ≥ 4.0 → disponível
const isAvailable = (l: Listing) => l.rating >= 4.0;

// ── Sub-components ─────────────────────────────────────────────
function StarRow({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`h-3.5 w-3.5 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
          />
        ))}
      </div>
      <span className="text-xs font-bold text-gray-800">{rating.toFixed(1)}</span>
      {count > 0 && <span className="text-xs text-gray-400">({count})</span>}
    </div>
  );
}

// ── Filter sidebar state types ─────────────────────────────────
const PRICE_OPTIONS = [
  { label: "Qualquer preço", value: null as null },
  { label: "Até R$ 100",    value: 100 },
  { label: "Até R$ 200",    value: 200 },
  { label: "Até R$ 500",    value: 500 },
];

const RATING_OPTIONS = [
  { label: "Qualquer",      value: 0 },
  { label: "3+ estrelas",   value: 3 },
  { label: "4+ estrelas",   value: 4 },
  { label: "4.5+ estrelas", value: 4.5 },
];

// ── Interface ──────────────────────────────────────────────────
interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface SearchViewProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigate: (view: SidebarView) => void;
}

// ── Main component ─────────────────────────────────────────────
const SearchView = ({ searchQuery, onSearchChange }: SearchViewProps) => {
  const { toast } = useToast();
  const qc = useQueryClient();

  // existing state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [requesting, setRequesting] = useState<string | null>(null);

  // new UI state
  const [locationQuery, setLocationQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<"relevance" | "rating" | "price_asc" | "price_desc">("relevance");

  // ── Query (unchanged) ────────────────────────────────────────
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
    onMutate: (id) => setRequesting(id),
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

  // ── Client-side filter + sort ────────────────────────────────
  const displayListings = useMemo(() => {
    let result = listings;
    if (priceMax !== null) result = result.filter((l) => l.price <= priceMax);
    if (minRating > 0) result = result.filter((l) => l.rating >= minRating);
    if (onlyAvailable) result = result.filter(isAvailable);
    if (sortBy === "rating") return [...result].sort((a, b) => b.rating - a.rating);
    if (sortBy === "price_asc") return [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") return [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [listings, priceMax, minRating, onlyAvailable, sortBy]);

  // ── Active filter chips ──────────────────────────────────────
  const activeFilters = [
    selectedCategory ? { label: selectedCategory, onRemove: () => setSelectedCategory("") } : null,
    priceMax !== null ? { label: `Até R$ ${priceMax}`, onRemove: () => setPriceMax(null) } : null,
    minRating > 0 ? { label: `${minRating}+ estrelas`, onRemove: () => setMinRating(0) } : null,
    onlyAvailable ? { label: "Disponíveis", onRemove: () => setOnlyAvailable(false) } : null,
  ].filter(Boolean) as { label: string; onRemove: () => void }[];

  const clearAllFilters = () => {
    setSelectedCategory("");
    setPriceMax(null);
    setMinRating(0);
    setOnlyAvailable(false);
  };

  // ── Sidebar content (reused desktop + mobile) ────────────────
  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Categoria</p>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory("")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-left ${
              selectedCategory === "" ? "bg-orange-50 text-primary" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Search className="h-3 w-3 text-gray-500" />
            </span>
            Todas as categorias
          </button>
          {CATEGORIES.map((cat) => {
            const meta = getCatMeta(cat);
            const CatIcon = meta.icon;
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-left ${
                  active ? `${meta.pillBg} ${meta.pillText}` : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? meta.iconBg : "bg-gray-100"}`}>
                  <CatIcon className={`h-3 w-3 ${active ? meta.iconColor : "text-gray-400"}`} />
                </span>
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Faixa de preço</p>
        <div className="space-y-1">
          {PRICE_OPTIONS.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setPriceMax(opt.value)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors text-left ${
                priceMax === opt.value ? "bg-orange-50 text-primary font-semibold" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
              {priceMax === opt.value && <span className="w-2 h-2 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Min rating */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Avaliação mínima</p>
        <div className="space-y-1">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMinRating(opt.value)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors text-left ${
                minRating === opt.value ? "bg-orange-50 text-primary font-semibold" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.value > 0 && (
                <div className="flex gap-0.5">
                  {Array.from({ length: Math.floor(opt.value) }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              )}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Disponibilidade</p>
        <button
          onClick={() => setOnlyAvailable(!onlyAvailable)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
            onlyAvailable
              ? "bg-green-50 text-green-700 border-green-200"
              : "text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${onlyAvailable ? "bg-green-500" : "bg-gray-300"}`} />
            Apenas disponíveis
          </span>
          <div className={`w-9 h-5 rounded-full transition-colors relative ${onlyAvailable ? "bg-green-500" : "bg-gray-200"}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${onlyAvailable ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
        </button>
      </div>

      {/* Clear */}
      {activeFilters.length > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full text-center text-sm text-gray-500 hover:text-red-500 transition-colors py-1"
        >
          Limpar todos os filtros
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* ── Page header ── */}
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          Profissionais encontrados
          <span className="text-primary"> perto de você</span>
        </h1>
        <p className="text-gray-500 mt-1.5 text-sm">
          {isLoading ? "Buscando profissionais..." : `${displayListings.length} profissional${displayListings.length !== 1 ? "is" : ""} disponível${displayListings.length !== 1 ? "is" : ""} na sua região`}
        </p>
      </div>

      {/* ── Premium search bar ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row mb-6 overflow-hidden">
        {/* Service search */}
        <div className="flex items-center gap-3 flex-1 px-4 py-4 sm:px-5 border-b sm:border-b-0 sm:border-r border-gray-100">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar serviço ou profissional..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-gray-900 placeholder:text-gray-400"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange("")} className="text-gray-300 hover:text-gray-500">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 px-4 py-4 sm:px-5 border-b sm:border-b-0 sm:border-r border-gray-100">
          <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="São Paulo, SP"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="bg-transparent text-sm outline-none text-gray-900 placeholder:text-gray-400 w-full sm:w-36"
          />
        </div>

        {/* Search button */}
        <div className="flex items-center px-3 py-3 sm:py-2">
          <button
            onClick={() => onSearchChange(searchQuery)}
            className="w-full sm:w-auto bg-primary hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-orange-200"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* ── Category pills ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory("")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
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
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                active
                  ? `${meta.pillBg} ${meta.pillText} border-transparent shadow-sm`
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <CatIcon className={`h-3.5 w-3.5 ${active ? meta.iconColor : "text-gray-400"}`} />
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Layout: sidebar + results ── */}
      <div className="flex gap-6 items-start">

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-gray-900 text-sm">Filtros</h3>
              {activeFilters.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex w-full items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {activeFilters.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
              {filtersOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
            </button>

            {/* Mobile filter panel */}
            {filtersOpen && (
              <div className="mt-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <FilterPanel />
              </div>
            )}
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {activeFilters.map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-primary text-xs font-semibold border border-orange-100"
                >
                  {f.label}
                  <button onClick={f.onRemove} className="hover:text-orange-700">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Results bar */}
          {!isLoading && displayListings.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{displayListings.length}</span> profissional{displayListings.length !== 1 ? "is" : ""} encontrado{displayListings.length !== 1 ? "s" : ""}
              </p>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <label className="text-xs text-gray-500 font-medium">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full text-xs text-gray-700 font-medium bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-primary cursor-pointer sm:w-auto"
                >
                  <option value="relevance">Relevância</option>
                  <option value="rating">Mais avaliados</option>
                  <option value="price_asc">Menor preço</option>
                  <option value="price_desc">Maior preço</option>
                </select>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
              <p className="text-sm text-gray-500">Buscando profissionais...</p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && displayListings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Search className="h-7 w-7 text-gray-300" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-700 text-base">Nenhum profissional encontrado</p>
                <p className="text-sm text-gray-500 mt-1">Tente outros termos ou ajuste os filtros</p>
              </div>
              {activeFilters.length > 0 && (
                <button onClick={clearAllFilters} className="text-sm text-primary font-semibold hover:underline">
                  Limpar filtros
                </button>
              )}
            </div>
          )}

          {/* ── Professional cards grid ── */}
          {!isLoading && displayListings.length > 0 && (
            <div className="grid gap-4 xl:grid-cols-2">
              {displayListings.map((listing) => {
                const meta = getCatMeta(listing.category);
                const CatIcon = meta.icon;
                const initials = getInitials(listing.provider.name);
                const gradient = getGradient(listing.provider.name);
                const available = isAvailable(listing);
                const isPending = requesting === listing.id;

                return (
                  <div
                    key={listing.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
                  >
                    {/* Card body */}
                    <div className="p-5">
                      {/* Provider row */}
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-sm`}>
                          {initials}
                          {/* Availability dot */}
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${available ? "bg-green-500" : "bg-gray-300"}`} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-display font-bold text-gray-900 text-base leading-tight">
                              {listing.provider.name}
                            </h3>
                            <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                          </div>

                          {/* Category chip */}
                          <div className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full ${meta.pillBg} ${meta.pillText} text-[11px] font-semibold`}>
                            <CatIcon className={`h-3 w-3 ${meta.iconColor}`} />
                            {listing.category}
                          </div>

                          {/* Stars */}
                          <div className="mt-2">
                            <StarRow rating={listing.rating} count={listing.reviewCount} />
                          </div>
                        </div>

                        {/* Available badge */}
                        <div className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          available ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
                        }`}>
                          {available ? "Disponível" : "Em breve"}
                        </div>
                      </div>

                      {/* Title + description */}
                      <div className="mt-4">
                        <p className="font-semibold text-gray-800 text-sm leading-snug mb-1">
                          {listing.title}
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {listing.description}
                        </p>
                      </div>

                      {/* Location */}
                      {listing.location && (
                        <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          <span>{listing.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Card footer */}
                    <div className="px-5 py-4 border-t border-gray-50 flex flex-col gap-3 mt-auto sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">A partir de</p>
                        <p className="font-display font-bold text-primary text-lg leading-none mt-0.5">
                          {formatPrice(listing.price, listing.priceType)}
                        </p>
                      </div>

                      <div className="flex w-full items-center gap-2 sm:w-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 flex-1 px-3 text-xs rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 shadow-none sm:flex-none"
                          onClick={() => toast({ title: "Em breve", description: "Perfil completo disponível em breve." })}
                        >
                          Ver perfil
                        </Button>
                        <Button
                          size="sm"
                          className="h-9 flex-1 px-4 text-xs gap-1.5 rounded-xl shadow-sm shadow-orange-200 sm:flex-none"
                          onClick={() => requestMutation.mutate(listing.id)}
                          disabled={isPending}
                        >
                          {isPending
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <Send className="h-3.5 w-3.5" />
                          }
                          Solicitar
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer note */}
          {!isLoading && displayListings.length > 0 && (
            <p className="mt-8 text-center text-xs text-gray-400">
              Resultados atualizados em tempo real · {displayListings.length} profissional{displayListings.length !== 1 ? "is" : ""} encontrado{displayListings.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchView;
