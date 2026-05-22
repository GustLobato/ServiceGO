import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Maria Silva",
    initials: "MS",
    role: "Cliente",
    rating: 5,
    text: "Encontrei um eletricista excelente em minutos. O processo foi simples e o profissional muito competente!",
  },
  {
    name: "Carlos Oliveira",
    initials: "CO",
    role: "Prestador",
    rating: 5,
    text: "Como prestador, a plataforma me ajudou a conseguir mais clientes e gerenciar minha agenda de forma eficiente.",
  },
  {
    name: "Ana Costa",
    initials: "AC",
    role: "Cliente",
    rating: 5,
    text: "A transparência nas avaliações me deu confiança para contratar. Serviço impecável do início ao fim.",
  },
];

const Testimonials = () => {
  return (
    <section id="avaliacoes" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Depoimentos</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
            O que nossos usuários dizem
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
