/**
 * ReviewsView — view de avaliações de serviços concluídos.
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ServiceRequest } from "@/data/mockData";

interface ReviewsViewProps {
  completedRequests: ServiceRequest[];
}

const ReviewsView = ({ completedRequests }: ReviewsViewProps) => {
  const { toast } = useToast();

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
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{r.service}</p>
                  <p className="text-sm text-muted-foreground">
                    {r.provider} · {r.category}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 shrink-0"
                  onClick={() =>
                    toast({
                      title: "Em breve",
                      description:
                        "Sistema de avaliações será implementado em breve.",
                    })
                  }
                >
                  <Star className="h-4 w-4" /> Avaliar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default ReviewsView;
