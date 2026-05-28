import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { type ComponentType } from "react";
import { type LucideProps } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Star, CheckCircle2, Wrench, Zap, Paintbrush, Home,
  Car, Sparkles, Sprout, Monitor, Send, X,
  MessageSquare, Filter, BadgeCheck, ThumbsUp,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { ServiceRequest } from "@/data/mockData";

// ---------- Types ----------

interface CatConfig {
  icon: ComponentType<LucideProps>;
  bg: string;
  color: string;
}

interface SubmittedReview {
  id: string;
  clientName: string;
  clientInitials: string;
  clientGradient: string;
  service: string;
  provider: string;
  category: string;
  rating: number;
  date: string;
  comment: string;
}

interface ReviewsViewProps {
  completedRequests: ServiceRequest[];
}

type RatingFilter = "all" | 5 | 4 | 3;

// ---------- Constants ----------

const CAT_ICON: Record<string, CatConfig> = {
  encanamento: { icon: Wrench,     bg: "bg-blue-100",    color: "text-blue-600" },
  eletrica:    { icon: Zap,        bg: "bg-amber-100",   color: "text-amber-500" },
  pintura:     { icon: Paintbrush, bg: "bg-rose-100",    color: "text-rose-500" },
  reformas:    { icon: Home,       bg: "bg-green-100",   color: "text-green-600" },
  tecnologia:  { icon: Monitor,    bg: "bg-sky-100",     color: "text-sky-600" },
  limpeza:     { icon: Sparkles,   bg: "bg-pink-100",    color: "text-pink-500" },
  jardinagem:  { icon: Sprout,     bg: "bg-emerald-100", color: "text-emerald-600" },
  automotivo:  { icon: Car,        bg: "bg-purple-100",  color: "text-purple-600" },
};

const MOCK_SUBMITTED: SubmittedReview[] = [
  {
    id: "r1",
    clientName: "Maria Silva",
    clientInitials: "MS",
    clientGradient: "from-pink-400 to-rose-500",
    service: "Instalação elétrica residencial",
    provider: "Carlos Oliveira",
    category: "eletrica",
    rating: 5,
    date: "15 mai 2025",
    comment: "Excelente trabalho! O Carlos foi muito profissional, pontual e resolveu tudo com qualidade. Recomendo sem hesitar a quem precisar.",
  },
  {
    id: "r2",
    clientName: "João Pereira",
    clientInitials: "JP",
    clientGradient: "from-blue-400 to-indigo-500",
    service: "Reforma completa do banheiro",
    provider: "Ana Martins",
    category: "reformas",
    rating: 5,
    date: "02 abr 2025",
    comment: "Serviço impecável. Entregou no prazo e dentro do orçamento combinado. O acabamento ficou perfeito.",
  },
  {
    id: "r3",
    clientName: "Ana Costa",
    clientInitials: "AC",
    clientGradient: "from-emerald-400 to-teal-500",
    service: "Limpeza residencial completa",
    provider: "Pedro Santos",
    category: "limpeza",
    rating: 4,
    date: "20 mar 2025",
    comment: "Bom serviço no geral, chegou um pouco atrasado mas compensou muito na qualidade da limpeza.",
  },
  {
    id: "r4",
    clientName: "Ricardo Souza",
    clientInitials: "RS",
    clientGradient: "from-amber-400 to-orange-500",
    service: "Manutenção e paisagismo",
    provider: "Luiz Ferreira",
    category: "jardinagem",
    rating: 5,
    date: "10 mar 2025",
    comment: "Trabalho fantástico! O jardim ficou muito bem cuidado. O profissional foi atencioso e dedicado do início ao fim.",
  },
];

const RATING_FILTERS: { label: string; value: RatingFilter }[] = [
  { label: "Todos", value: "all" },
  { label: "5 estrelas", value: 5 },
  { label: "4 estrelas", value: 4 },
  { label: "3 ou menos", value: 3 },
];

// ---------- Helpers ----------

function getCatIcon(category: string): CatConfig {
  const key = category.toLowerCase().replace(/[^a-z]/g, "");
  return CAT_ICON[key] ?? { icon: Wrench, bg: "bg-gray-100", color: "text-gray-500" };
}

// ---------- StarRow (display only) ----------

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${cls} ${s <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`}
        />
      ))}
    </div>
  );
}

// ---------- StarPicker (interactive) ----------

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  const labels = ["", "Ruim", "Regular", "Bom", "Muito bom", "Excelente"];

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            className={`h-9 w-9 transition-colors ${
              star <= display ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"
            }`}
          />
        </button>
      ))}
      {display > 0 && (
        <span className="ml-1 text-sm font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
          {labels[display]}
        </span>
      )}
    </div>
  );
}

// ---------- SubmittedReviewCard ----------

function SubmittedReviewCard({ review, index }: { review: SubmittedReview; index: number }) {
  const catCfg = getCatIcon(review.category);
  const CatIcon = catCfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      {/* Top gradient accent line */}
      <div className={`h-1 w-full bg-gradient-to-r ${review.clientGradient}`} />

      <div className="p-5 sm:p-6">
        {/* Header: avatar + name + rating */}
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${review.clientGradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}
          >
            {review.clientInitials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">{review.clientName}</span>
              <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="w-full flex-shrink-0 sm:ml-auto sm:w-auto">
                <StarRow rating={review.rating} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{review.date}</p>
          </div>
        </div>

        {/* Comment */}
        <p className="text-sm text-gray-600 leading-relaxed mt-4 mb-4 sm:pl-16">
          "{review.comment}"
        </p>

        {/* Footer: category + service + provider + badge */}
        <div className="flex flex-col items-start gap-2 pt-4 border-t border-gray-50 sm:flex-row sm:items-center sm:gap-3 sm:flex-wrap">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${catCfg.bg} flex-shrink-0`}>
            <CatIcon className={`h-3.5 w-3.5 ${catCfg.color}`} />
            <span className={`text-xs font-semibold ${catCfg.color} capitalize`}>{review.category}</span>
          </div>

          <span className="text-xs text-gray-500 min-w-0 break-words sm:flex-1 sm:truncate">{review.service}</span>

          <span className="text-xs font-medium text-gray-500 flex-shrink-0">
            com <span className="text-primary font-semibold">{review.provider}</span>
          </span>

          <span className="flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full flex-shrink-0">
            <CheckCircle2 className="h-3 w-3" />
            Serviço concluído
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ---------- Main component ----------

const ReviewsView = ({ completedRequests }: ReviewsViewProps) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const mutation = useMutation({
    mutationFn: (data: { requestId: string; rating: number; comment?: string }) =>
      api.post("/api/reviews", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requests"] });
      toast({ title: "Avaliação enviada!", description: "Obrigado pelo feedback." });
      setReviewingId(null);
      setRating(5);
      setComment("");
    },
    onError: (e: Error) => {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    },
  });

  const handleStartReview = (id: string) => {
    setReviewingId(id);
    setRating(5);
    setComment("");
  };

  // Computed stats
  const allRatings = MOCK_SUBMITTED.map((r) => r.rating);
  const avgRating = allRatings.length
    ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
    : "–";
  const satisfactionRate = allRatings.length
    ? Math.round((allRatings.filter((r) => r >= 4).length / allRatings.length) * 100)
    : 0;
  const totalReviews = MOCK_SUBMITTED.length + completedRequests.length;

  // Filtered submitted reviews
  const displayedReviews = useMemo(() => {
    return MOCK_SUBMITTED.filter((r) => {
      if (ratingFilter === 3 && r.rating > 3) return false;
      if (ratingFilter !== "all" && ratingFilter !== 3 && r.rating !== ratingFilter) return false;
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      return true;
    });
  }, [ratingFilter, categoryFilter]);

  const categories = Array.from(new Set(MOCK_SUBMITTED.map((r) => r.category)));

  const STATS = [
    {
      icon: Star,
      label: "Nota média",
      value: avgRating,
      suffix: "/5",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      icon: MessageSquare,
      label: "Total de avaliações",
      value: String(totalReviews),
      suffix: "",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: CheckCircle2,
      label: "Serviços avaliados",
      value: String(MOCK_SUBMITTED.length),
      suffix: "",
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      icon: ThumbsUp,
      label: "Taxa de satisfação",
      value: String(satisfactionRate),
      suffix: "%",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="w-4 h-0.5 bg-primary rounded" />
          <span className="text-primary text-sm font-semibold">ServiceGO</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900">Avaliações</h1>
        <p className="text-gray-500 mt-1.5 text-sm">
          Avaliações reais dos serviços contratados pelo ServiceGO
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i, duration: 0.35 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center mb-3`}>
              <s.icon className={`h-5 w-5 ${s.iconColor}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 tabular-nums leading-none">
              {s.value}
              <span className="text-base text-gray-400 font-medium">{s.suffix}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.35 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wide flex-shrink-0">
            <Filter className="h-3.5 w-3.5" />
            Filtros
          </div>

          {/* Rating chips */}
          <div className="flex flex-wrap gap-2">
            {RATING_FILTERS.map((f) => (
              <button
                key={String(f.value)}
                onClick={() => setRatingFilter(f.value)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  ratingFilter === f.value
                    ? "bg-primary text-white shadow-sm shadow-orange-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.value !== "all" && (
                  <Star
                    className={`h-3 w-3 ${ratingFilter === f.value ? "fill-white text-white" : "fill-amber-400 text-amber-400"}`}
                  />
                )}
                {f.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 hidden sm:block" />

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categoryFilter === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Todas as categorias
            </button>
            {categories.map((cat) => {
              const cfg = getCatIcon(cat);
              const CatIcon = cfg.icon;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                    categoryFilter === cat
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <CatIcon className="h-3 w-3" />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Pending reviews section */}
      {completedRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.35 }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="font-display text-lg font-bold text-gray-900">Aguardando avaliação</h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
              {completedRequests.length}
            </span>
          </div>

          <div className="space-y-4">
            {completedRequests.map((r) => {
              const catCfg = getCatIcon(r.category);
              const CatIcon = catCfg.icon;
              const isReviewing = reviewingId === r.id;

              return (
                <div
                  key={r.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isReviewing
                      ? "border-primary/30 shadow-md ring-1 ring-primary/10"
                      : "border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  {/* Card header */}
                  <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
                    <div className={`w-14 h-14 rounded-2xl ${catCfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <CatIcon className={`h-6 w-6 ${catCfg.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{r.service}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-sm text-gray-500">{r.provider}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-sm text-gray-400 capitalize">{r.category}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{r.date}</span>
                      </div>
                    </div>

                    <div className="flex w-full items-center gap-3 sm:w-auto sm:flex-shrink-0">
                      <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Concluído
                      </span>
                      {!isReviewing ? (
                        <Button
                          size="sm"
                          className="w-full gap-1.5 rounded-xl bg-primary hover:bg-primary/90 shadow-sm shadow-orange-200 sm:w-auto"
                          onClick={() => handleStartReview(r.id)}
                        >
                          <Star className="h-3.5 w-3.5" />
                          Avaliar
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-auto rounded-xl text-gray-400 hover:text-gray-600 sm:ml-0"
                          onClick={() => setReviewingId(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Inline review form */}
                  {isReviewing && (
                    <div className="px-5 pb-5 border-t border-gray-50 sm:px-6 sm:pb-6">
                      <div className="pt-5 space-y-5">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-3">
                            Como foi sua experiência com {r.provider.split(" ")[0]}?
                          </p>
                          <StarPicker value={rating} onChange={setRating} />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Comentário{" "}
                            <span className="font-normal text-gray-400">(opcional)</span>
                          </p>
                          <Textarea
                            placeholder="Descreva sua experiência. O que foi bom? O que poderia melhorar?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            className="rounded-xl border-gray-200 resize-none focus:border-primary"
                          />
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full rounded-xl sm:w-auto"
                            onClick={() => setReviewingId(null)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            className="w-full gap-1.5 rounded-xl bg-primary hover:bg-primary/90 sm:w-auto"
                            disabled={mutation.isPending || rating === 0}
                            onClick={() =>
                              mutation.mutate({
                                requestId: r.id,
                                rating,
                                comment: comment || undefined,
                              })
                            }
                          >
                            <Send className="h-3.5 w-3.5" />
                            {mutation.isPending ? "Enviando..." : "Enviar avaliação"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Submitted reviews history */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.35 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-gray-900">Histórico de avaliações</h2>
          {displayedReviews.length > 0 && (
            <span className="text-xs text-gray-400 font-medium">
              {displayedReviews.length}{" "}
              {displayedReviews.length === 1 ? "avaliação" : "avaliações"}
            </span>
          )}
        </div>

        {displayedReviews.length === 0 ? (
          /* Filtered empty state */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center sm:p-16">
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Star className="h-9 w-9 text-amber-400" />
            </div>
            <h3 className="font-display font-semibold text-gray-900 text-lg">
              Nenhuma avaliação encontrada
            </h3>
            <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
              Tente ajustar os filtros para ver mais resultados.
            </p>
            <button
              onClick={() => {
                setRatingFilter("all");
                setCategoryFilter("all");
              }}
              className="mt-5 text-primary text-sm font-semibold hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedReviews.map((review, i) => (
              <SubmittedReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>
        )}
      </motion.div>

    </div>
  );
};

export default ReviewsView;
