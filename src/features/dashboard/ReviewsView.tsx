import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Star, CheckCircle2, Wrench, Zap, Paintbrush, Home,
  Car, Sparkles, Sprout, Monitor, Send, X,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { ServiceRequest } from "@/data/mockData";

interface ReviewsViewProps {
  completedRequests: ServiceRequest[];
}

const CAT_ICON: Record<string, { icon: typeof Wrench; bg: string; color: string }> = {
  encanamento: { icon: Wrench,     bg: "bg-blue-100",    color: "text-blue-600" },
  eletrica:    { icon: Zap,        bg: "bg-amber-100",   color: "text-amber-500" },
  pintura:     { icon: Paintbrush, bg: "bg-rose-100",    color: "text-rose-500" },
  reformas:    { icon: Home,       bg: "bg-green-100",   color: "text-green-600" },
  tecnologia:  { icon: Monitor,    bg: "bg-sky-100",     color: "text-sky-600" },
  limpeza:     { icon: Sparkles,   bg: "bg-pink-100",    color: "text-pink-500" },
  jardinagem:  { icon: Sprout,     bg: "bg-emerald-100", color: "text-emerald-600" },
  automotivo:  { icon: Car,        bg: "bg-purple-100",  color: "text-purple-600" },
};

function getCatIcon(category: string) {
  const key = category.toLowerCase().replace(/[^a-z]/g, "");
  return CAT_ICON[key] ?? { icon: Wrench, bg: "bg-gray-100", color: "text-gray-500" };
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  const labels = ["", "Ruim", "Regular", "Bom", "Muito bom", "Excelente"];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`h-9 w-9 transition-colors ${
                star <= display
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-200 fill-gray-200"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-600">
          {labels[display] || "Selecione"}
        </span>
      </div>
    </div>
  );
}

const ReviewsView = ({ completedRequests }: ReviewsViewProps) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Avaliações</h1>
        <p className="text-gray-500 mt-1.5">
          {completedRequests.length === 0
            ? "Nenhum serviço concluído ainda"
            : `${completedRequests.length} serviço${completedRequests.length !== 1 ? "s" : ""} aguardando avaliação`}
        </p>
      </div>

      {/* Empty state */}
      {completedRequests.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Star className="h-9 w-9 text-amber-400" />
          </div>
          <h3 className="font-display font-semibold text-gray-900 text-lg">Nenhuma avaliação pendente</h3>
          <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
            Quando você concluir um serviço, ele aparecerá aqui para você avaliar.
          </p>
        </div>
      )}

      {/* Review cards */}
      {completedRequests.length > 0 && (
        <div className="space-y-4">
          {completedRequests.map((r) => {
            const catCfg = getCatIcon(r.category);
            const CatIcon = catCfg.icon;
            const isReviewing = reviewingId === r.id;

            return (
              <div
                key={r.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isReviewing ? "border-primary/30 shadow-md ring-1 ring-primary/10" : "border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Card header */}
                <div className="flex items-center gap-4 px-6 py-5">
                  {/* Category icon */}
                  <div className={`w-14 h-14 rounded-2xl ${catCfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <CatIcon className={`h-6 w-6 ${catCfg.color}`} />
                  </div>

                  {/* Service info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{r.service}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-sm text-gray-500">{r.provider}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-sm text-gray-400">{r.category}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Concluído
                    </span>
                    {!isReviewing && (
                      <Button
                        size="sm"
                        className="gap-1.5 rounded-xl bg-primary hover:bg-primary/90 shadow-sm shadow-orange-200"
                        onClick={() => handleStartReview(r.id)}
                      >
                        <Star className="h-3.5 w-3.5" />
                        Avaliar
                      </Button>
                    )}
                    {isReviewing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-xl text-gray-400 hover:text-gray-600"
                        onClick={() => setReviewingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Review form */}
                {isReviewing && (
                  <div className="px-6 pb-6 border-t border-gray-50">
                    <div className="pt-5 space-y-5">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">
                          Como foi sua experiência com {r.provider.split(" ")[0]}?
                        </p>
                        <StarPicker value={rating} onChange={setRating} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Comentário <span className="font-normal text-gray-400">(opcional)</span>
                        </p>
                        <Textarea
                          placeholder="Descreva sua experiência. O que foi bom? O que poderia melhorar?"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                          className="rounded-xl border-gray-200 resize-none focus:border-primary"
                        />
                      </div>

                      <div className="flex gap-3 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => setReviewingId(null)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          className="gap-1.5 rounded-xl bg-primary hover:bg-primary/90"
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
      )}
    </div>
  );
};

export default ReviewsView;
