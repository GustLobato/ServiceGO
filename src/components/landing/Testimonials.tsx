import { Star, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Maria Silva", initials: "MS", role: "Cliente", location: "São Paulo, SP",
    rating: 5, avatarBg: "from-pink-400 to-rose-500",
    text: "Encontrei um eletricista excelente em minutos. O processo foi simples e o profissional muito competente!",
  },
  {
    name: "Carlos Oliveira", initials: "CO", role: "Prestador", location: "Rio de Janeiro, RJ",
    rating: 5, avatarBg: "from-blue-400 to-indigo-500", featured: true,
    text: "Como prestador, a plataforma me ajudou a conseguir mais clientes e gerenciar minha agenda de forma muito mais eficiente.",
  },
  {
    name: "Ana Costa", initials: "AC", role: "Cliente", location: "Curitiba, PR",
    rating: 5, avatarBg: "from-emerald-400 to-teal-500",
    text: "A transparência nas avaliações me deu confiança para contratar. Serviço impecável do início ao fim!",
  },
];

const Testimonials = () => (
  <section id="avaliacoes" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
        <span className="text-primary text-sm font-semibold">Depoimentos</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2">O que nossos usuários dizem</h2>
        <p className="text-gray-500 mt-3 max-w-lg">Histórias reais de clientes e prestadores que já usam o ServiceGO.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-2xl p-7 border transition-shadow hover:shadow-lg ${
              t.featured ? "border-primary/30 shadow-md ring-1 ring-primary/10" : "border-gray-100 shadow-sm"
            }`}
          >
            {t.featured && (
              <span className="inline-block mb-4 px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                Destaque
              </span>
            )}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-6">"{t.text}"</p>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {t.initials}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-gray-900">{t.name}</span>
                  <BadgeCheck className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-gray-500">{t.role} · {t.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
