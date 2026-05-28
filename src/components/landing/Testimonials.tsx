import { Star, BadgeCheck, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Maria Silva",
    initials: "MS",
    role: "Cliente",
    location: "São Paulo, SP",
    rating: 5,
    text: "Encontrei um eletricista excelente em minutos. O processo foi simples e o profissional muito competente! Recomendo para todos.",
    avatarGradient: "from-pink-400 to-rose-500",
  },
  {
    name: "Carlos Oliveira",
    initials: "CO",
    role: "Prestador",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Como prestador, a plataforma me ajudou a conseguir mais clientes e gerenciar minha agenda de forma muito mais eficiente.",
    avatarGradient: "from-blue-400 to-indigo-500",
    featured: true,
  },
  {
    name: "Ana Costa",
    initials: "AC",
    role: "Cliente",
    location: "Curitiba, PR",
    rating: 5,
    text: "A transparência nas avaliações me deu confiança para contratar. Serviço impecável do início ao fim. Plataforma incrível!",
    avatarGradient: "from-emerald-400 to-teal-500",
  },
];

const Testimonials = () => {
  return (
    <section id="avaliacoes" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/30 -z-10" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-3 px-3 py-1 bg-primary/10 rounded-full">
            Depoimentos
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
            O que nossos usuários dizem
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Histórias reais de clientes e prestadores que transformaram sua experiência com serviços.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className={`relative bg-card rounded-2xl p-7 border transition-all duration-300 hover:shadow-xl ${
                t.featured
                  ? "border-primary/30 shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                  : "border-border hover:border-muted-foreground/20"
              }`}
            >
              {/* Featured badge */}
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary rounded-full text-[10px] font-bold text-primary-foreground uppercase tracking-widest shadow-md">
                  Destaque
                </div>
              )}

              {/* Large quote */}
              <Quote className="h-8 w-8 text-primary/20 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground leading-relaxed text-sm mb-6">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Avatar className="h-10 w-10">
                  <AvatarFallback
                    className={`bg-gradient-to-br ${t.avatarGradient} text-white font-bold text-sm`}
                  >
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-foreground">{t.name}</span>
                    <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t.role} · {t.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-14 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
        >
          {[
            { label: "Taxa de satisfação", value: "98%" },
            { label: "Avaliações verificadas", value: "12.000+" },
            { label: "Tempo médio de resposta", value: "< 2h" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-primary" />
              <span>
                <strong className="text-foreground">{item.value}</strong> {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
