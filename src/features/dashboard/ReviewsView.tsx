/**
 * ReviewsView — avaliações de serviços concluídos via API.
 */
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { ServiceRequest } from "@/data/mockData";

interface ReviewsViewProps {
  completedRequests: ServiceRequest[];
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

  return (
    <>
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">
        Avaliações
      </h1>
      <p className="text-muted-foreground text-sm mb-6">
        Avalie seus serviços concluídos
      </p>

      {completedRequests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum serviço concluído para avaliar.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {completedRequests.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{r.service}</p>
                    <p className="text-sm text-muted-foreground">
                      {r.provider} · {r.category}
                    </p>
                  </div>
                  {reviewingId !== r.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 shrink-0"
                      onClick={() => setReviewingId(r.id)}
                    >
                      <Star className="h-4 w-4" /> Avaliar
                    </Button>
                  )}
                </div>

                {reviewingId === r.id && (
                  <div className="mt-4 space-y-3 border-t pt-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 transition-colors ${
                              star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">
                        {rating}/5
                      </span>
                    </div>
                    <Textarea
                      placeholder="Deixe um comentário (opcional)..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={2}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReviewingId(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        disabled={mutation.isPending}
                        onClick={() =>
                          mutation.mutate({
                            requestId: r.id,
                            rating,
                            comment: comment || undefined,
                          })
                        }
                      >
                        Enviar Avaliação
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default ReviewsView;
