import { Star, BadgeCheck, Quote } from "lucide-react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Maria Silva",
    initials: "MS",
    role: "Cliente",
    location: "São Paulo, SP",
    service: "Eletricista",
    rating: 5,
    avatarGradient: "from-pink-400 to-rose-500",
    text: "Encontrei um eletricista excelente em minutos. O processo foi simples e o profissional muito competente e pontual!",
    featured: false,
  },
  {
    name: "Carlos Oliveira",
    initials: "CO",
    role: "Prestador",
    location: "Rio de Janeiro, RJ",
    service: "Encanador",
    rating: 5,
    avatarGradient: "from-blue-400 to-indigo-500",
    text: "Como prestador, a plataforma me ajudou a conseguir mais clientes e gerenciar minha agenda de forma muito mais eficiente.",
    featured: true,
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
    featured: false,
  },
];

const StarRow = ({ count, white }: { count: number; white?: boolean }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${white ? "fill-white text-white" : "fill-amber-400 text-amber-400"}`}
      />
    ))}
  </div>
);

const Testimonials = () => (
  <section id="avaliacoes" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
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

        {/* Aggregate rating widget */}
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-2xl px-5 py-3 self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center flex-shrink-0">
            <Star className="h-5 w-5 fill-white text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-none mb-1">4.9 / 5.0</p>
            <p className="text-xs text-gray-500">+12.000 avaliações</p>
          </div>
        </div>
      </motion.div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className={`relative rounded-2xl p-7 flex flex-col border transition-all duration-200 ${
              t.featured
                ? "bg-gradient-to-br from-primary via-orange-500 to-orange-600 border-transparent shadow-2xl shadow-orange-200/60 hover:shadow-orange-200/80 hover:-translate-y-0.5"
                : "bg-white border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
            }`}
          >
            {/* Featured badge */}
            {t.featured && (
              <span className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider rounded-full self-start">
                <Star className="h-3 w-3 fill-white text-white" />
                Destaque
              </span>
            )}

            {/* Quote icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 flex-shrink-0 ${
              t.featured ? "bg-white/15" : "bg-orange-50"
            }`}>
              <Quote className={`h-5 w-5 ${t.featured ? "text-white/70" : "text-primary/50"}`} />
            </div>

            {/* Stars */}
            <StarRow count={t.rating} white={t.featured} />

            {/* Text */}
            <p className={`text-sm leading-relaxed flex-1 mt-4 mb-6 ${t.featured ? "text-white/90" : "text-gray-600"}`}>
              "{t.text}"
            </p>

            {/* Divider */}
            <div className={`border-t ${t.featured ? "border-white/20" : "border-gray-100"}`} />

            {/* Author */}
            <div className="flex items-center gap-3 pt-5">
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                t.featured ? "ring-2 ring-white/30" : "ring-2 ring-gray-100"
              }`}>
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
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                t.featured ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
              }`}>
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
