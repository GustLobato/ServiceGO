import { Wrench, Zap, Paintbrush, Home, Car, Scissors, Monitor, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    icon: Wrench,     name: "Encanador",   count: "248 profissionais",
    desc: "Consertos e instalações hidráulicas",
    gradient: "from-blue-500 to-blue-700",
    lightBg: "bg-blue-50", lightColor: "text-blue-600",
    border: "hover:border-blue-200",
  },
  {
    icon: Zap,        name: "Eletricista", count: "312 profissionais",
    desc: "Instalações e reparos elétricos",
    gradient: "from-amber-400 to-orange-600",
    lightBg: "bg-amber-50", lightColor: "text-amber-600",
    border: "hover:border-amber-200",
  },
  {
    icon: Paintbrush, name: "Pintor",      count: "189 profissionais",
    desc: "Pinturas internas e externas",
    gradient: "from-rose-400 to-rose-600",
    lightBg: "bg-rose-50", lightColor: "text-rose-600",
    border: "hover:border-rose-200",
  },
  {
    icon: Home,       name: "Reformas",    count: "421 profissionais",
    desc: "Reformas e acabamentos em geral",
    gradient: "from-green-500 to-emerald-700",
    lightBg: "bg-green-50", lightColor: "text-green-700",
    border: "hover:border-green-200",
  },
  {
    icon: Car,        name: "Automotivo",  count: "156 profissionais",
    desc: "Manutenção e reparos veiculares",
    gradient: "from-purple-500 to-purple-700",
    lightBg: "bg-purple-50", lightColor: "text-purple-600",
    border: "hover:border-purple-200",
  },
  {
    icon: Scissors,   name: "Beleza",      count: "503 profissionais",
    desc: "Cabeleireiros, manicures e mais",
    gradient: "from-pink-400 to-pink-600",
    lightBg: "bg-pink-50", lightColor: "text-pink-600",
    border: "hover:border-pink-200",
  },
  {
    icon: Monitor,    name: "Tecnologia",  count: "277 profissionais",
    desc: "Suporte técnico e assistência",
    gradient: "from-sky-400 to-sky-600",
    lightBg: "bg-sky-50", lightColor: "text-sky-600",
    border: "hover:border-sky-200",
  },
  {
    icon: BookOpen,   name: "Aulas",       count: "198 profissionais",
    desc: "Aulas particulares e reforço",
    gradient: "from-orange-400 to-primary",
    lightBg: "bg-orange-50", lightColor: "text-orange-600",
    border: "hover:border-orange-200",
  },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section id="servicos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
            Mais de 2.300 profissionais verificados prontos para atender você em 8 categorias.
          </p>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              onClick={() => navigate("/cadastro")}
              className={`group relative bg-white border border-gray-100 rounded-2xl overflow-hidden text-left hover:shadow-lg transition-all duration-200 ${cat.border} hover:border`}
            >
              {/* Card top gradient */}
              <div className={`h-2 bg-gradient-to-r ${cat.gradient}`} />

              <div className="p-5">
                <div className={`w-14 h-14 rounded-2xl ${cat.lightBg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <cat.icon className={`h-7 w-7 ${cat.lightColor}`} />
                </div>

                <p className={`font-display font-bold text-base ${cat.lightColor} mb-1`}>{cat.name}</p>
                <p className="text-xs text-gray-500 leading-snug mb-3">{cat.desc}</p>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-400">{cat.count}</span>
                  <div className={`w-7 h-7 rounded-full ${cat.lightBg} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <ArrowRight className={`h-3.5 w-3.5 ${cat.lightColor}`} />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* CTA link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => navigate("/cadastro")}
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
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
