import { Star, BadgeCheck, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Maria Silva",
    initials: "MS",
    role: "Cliente",
    location: "São Paulo, SP",
    service: "Eletricista",
    rating: 5,
    avatarGradient: "from-pink-400 to-rose-500",
    text: "Encontrei um eletricista excelente em minutos. O processo foi simples e o profissional muito competente e pontual!",
  },
  {
    name: "Carlos Oliveira",
    initials: "CO",
    role: "Prestador",
    location: "Rio de Janeiro, RJ",
    service: "Encanador",
    rating: 5,
    avatarGradient: "from-blue-400 to-indigo-500",
    featured: true,
    text: "Como prestador, a plataforma me ajudou a conseguir mais clientes e gerenciar minha agenda de forma muito mais eficiente.",
  },
  {
    name: "Ana Costa",
    initials: "AC",
    role: "Cliente",
    location: "Curitiba, PR",
    service: "Reformas",
    rating: 5,
    avatarGradient: "from-emerald-400 to-teal-500",
    text: "A transparência nas avaliações me deu confiança para contratar. Serviço impecável do início ao fim!",
  },
];

const Testimonials = () => (
  <section id="avaliacoes" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
      >
        <div>
          <span className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold mb-3">
            <span className="w-4 h-0.5 bg-primary rounded" />
            Depoimentos
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
            O que nossos usuários dizem
          </h2>
        </div>
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-2xl px-5 py-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">4.9 / 5</p>
            <p className="text-xs text-gray-500">+12.000 avaliações</p>
          </div>
        </div>
      </motion.div>

      {/* Cards grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-2xl p-7 flex flex-col border transition-shadow hover:shadow-lg ${
              t.featured
                ? "bg-gradient-to-br from-primary to-orange-600 border-transparent text-white shadow-xl shadow-orange-200"
                : "bg-white border-gray-100 shadow-sm"
            }`}
          >
            {/* Featured badge */}
            {t.featured && (
              <span className="inline-flex items-center gap-1 mb-4 px-3 py-1 bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider rounded-full self-start">
                ★ Destaque
              </span>
            )}

            {/* Quote icon */}
            <Quote className={`h-8 w-8 mb-3 ${t.featured ? "text-white/30" : "text-orange-100"}`} />

            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star
                  key={j}
                  className={`h-4 w-4 ${t.featured ? "fill-white text-white" : "fill-amber-400 text-amber-400"}`}
                />
              ))}
            </div>

            {/* Text */}
            <p className={`text-sm leading-relaxed flex-1 mb-6 ${t.featured ? "text-white/90" : "text-gray-600"}`}>
              "{t.text}"
            </p>

            {/* Author */}
            <div className={`flex items-center gap-3 pt-5 border-t ${t.featured ? "border-white/20" : "border-gray-100"}`}>
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${t.featured ? "ring-2 ring-white/30" : ""}`}>
                {t.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`font-semibold text-sm ${t.featured ? "text-white" : "text-gray-900"}`}>
                    {t.name}
                  </span>
                  <BadgeCheck className={`h-4 w-4 flex-shrink-0 ${t.featured ? "text-white/70" : "text-primary"}`} />
                </div>
                <p className={`text-xs mt-0.5 ${t.featured ? "text-white/60" : "text-gray-500"}`}>
                  {t.role} · {t.location}
                </p>
              </div>
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${t.featured ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                {t.service}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
