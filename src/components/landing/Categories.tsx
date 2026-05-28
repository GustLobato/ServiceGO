import { Wrench, Zap, Paintbrush, Home, Car, Scissors, Monitor, BookOpen, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categories = [
  { icon: Wrench,     name: "Encanador",   desc: "Consertos e instalações hidráulicas",   bg: "bg-blue-100",   color: "text-blue-600",    border: "hover:border-blue-200" },
  { icon: Zap,        name: "Eletricista", desc: "Instalações e reparos elétricos",       bg: "bg-amber-100",  color: "text-amber-500",   border: "hover:border-amber-200" },
  { icon: Paintbrush, name: "Pintor",      desc: "Pinturas internas e externas",          bg: "bg-rose-100",   color: "text-rose-500",    border: "hover:border-rose-200" },
  { icon: Home,       name: "Reformas",    desc: "Reformas e acabamentos em geral",       bg: "bg-green-100",  color: "text-green-600",   border: "hover:border-green-200" },
  { icon: Car,        name: "Automotivo",  desc: "Manutenção e reparos veiculares",       bg: "bg-purple-100", color: "text-purple-600",  border: "hover:border-purple-200" },
  { icon: Scissors,   name: "Beleza",      desc: "Cabeleireiros, manicures e mais",       bg: "bg-pink-100",   color: "text-pink-500",    border: "hover:border-pink-200" },
  { icon: Monitor,    name: "Tecnologia",  desc: "Suporte técnico e assistência",         bg: "bg-sky-100",    color: "text-sky-600",     border: "hover:border-sky-200" },
  { icon: BookOpen,   name: "Aulas",       desc: "Aulas particulares e reforço escolar",  bg: "bg-orange-100", color: "text-orange-500",  border: "hover:border-orange-200" },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section id="servicos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-primary text-sm font-semibold">Categorias</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Serviços para tudo que você precisa
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl">
            Mais de 2.000 profissionais prontos em 8 categorias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate("/cadastro")}
              className={`group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 text-left hover:shadow-md transition-all duration-200 ${cat.border} hover:border`}
            >
              <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                <cat.icon className={`h-6 w-6 ${cat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${cat.color}`}>{cat.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{cat.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 flex-shrink-0 transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
