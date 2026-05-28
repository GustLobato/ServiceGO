import { Wrench, Zap, Paintbrush, Home, Car, Sparkles, Monitor, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { type ComponentType } from "react";
import { type LucideProps } from "lucide-react";

interface Category {
  icon: ComponentType<LucideProps>;
  name: string;
  desc: string;
  count: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
}

const CATEGORIES: Category[] = [
  {
    icon: Wrench,
    name: "Encanador",
    desc: "Consertos e instalações hidráulicas",
    count: "248",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-600",
  },
  {
    icon: Zap,
    name: "Eletricista",
    desc: "Instalações e reparos elétricos",
    count: "312",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-600",
  },
  {
    icon: Paintbrush,
    name: "Pintor",
    desc: "Pinturas internas e externas",
    count: "189",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-600",
  },
  {
    icon: Home,
    name: "Reformas",
    desc: "Reformas e acabamentos em geral",
    count: "421",
    iconBg: "bg-green-50",
    iconColor: "text-green-700",
    badgeBg: "bg-green-50",
    badgeText: "text-green-700",
  },
  {
    icon: Car,
    name: "Automotivo",
    desc: "Manutenção e reparos veiculares",
    count: "156",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-600",
  },
  {
    icon: Sparkles,
    name: "Beleza",
    desc: "Cabeleireiros, manicures e mais",
    count: "503",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
    badgeBg: "bg-pink-50",
    badgeText: "text-pink-600",
  },
  {
    icon: Monitor,
    name: "Tecnologia",
    desc: "Suporte técnico e assistência",
    count: "277",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-600",
  },
  {
    icon: BookOpen,
    name: "Aulas",
    desc: "Aulas particulares e reforço",
    count: "198",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-600",
  },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section id="servicos" className="py-16 sm:py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section header */}
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
              Categorias
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              Serviços para tudo<br className="hidden md:block" /> que você precisa
            </h2>
          </div>
          <p className="text-gray-500 max-w-xs md:text-right text-sm leading-relaxed">
            Mais de <span className="font-semibold text-gray-700">2.300 profissionais</span> verificados prontos para atender você.
          </p>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              onClick={() => navigate("/cadastro")}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden text-left hover:shadow-xl hover:-translate-y-1.5 hover:border-gray-200 transition-all duration-200"
            >
              {/* Colored icon area */}
              <div className={`h-[88px] ${cat.iconBg} flex items-center justify-center relative overflow-hidden`}>
                {/* Soft inner glow blob */}
                <div className="absolute w-24 h-24 rounded-full bg-white/50 blur-xl" />
                <cat.icon className={`h-9 w-9 ${cat.iconColor} relative z-10 group-hover:scale-110 transition-transform duration-200`} />
              </div>

              {/* Text content */}
              <div className="p-4 sm:p-5">
                <p className="font-display font-bold text-sm sm:text-base text-gray-900 mb-1 leading-tight">
                  {cat.name}
                </p>
                <p className="text-[11px] sm:text-xs text-gray-500 leading-snug mb-4">
                  {cat.desc}
                </p>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full ${cat.badgeBg} ${cat.badgeText}`}>
                    {cat.count} profis.
                  </span>
                  <div className={`w-6 h-6 rounded-full ${cat.iconBg} flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200`}>
                    <ArrowRight className={`h-3 w-3 ${cat.iconColor}`} />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <button
            onClick={() => navigate("/cadastro")}
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-2.5 transition-all"
          >
            Ver todos os serviços disponíveis
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default Categories;
