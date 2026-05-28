import { Wrench, Paintbrush, Zap, Home, Car, Scissors, Monitor, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categories = [
  { icon: Wrench,    name: "Encanamento", count: 340, bg: "bg-blue-50",    iconColor: "text-blue-600",   ring: "group-hover:ring-blue-200" },
  { icon: Zap,       name: "Elétrica",    count: 280, bg: "bg-amber-50",   iconColor: "text-amber-600",  ring: "group-hover:ring-amber-200" },
  { icon: Paintbrush,name: "Pintura",     count: 210, bg: "bg-rose-50",    iconColor: "text-rose-500",   ring: "group-hover:ring-rose-200" },
  { icon: Home,      name: "Reformas",    count: 450, bg: "bg-emerald-50", iconColor: "text-emerald-600",ring: "group-hover:ring-emerald-200" },
  { icon: Car,       name: "Automotivo",  count: 190, bg: "bg-purple-50",  iconColor: "text-purple-600", ring: "group-hover:ring-purple-200" },
  { icon: Scissors,  name: "Estética",    count: 320, bg: "bg-pink-50",    iconColor: "text-pink-500",   ring: "group-hover:ring-pink-200" },
  { icon: Monitor,   name: "Tecnologia",  count: 260, bg: "bg-sky-50",     iconColor: "text-sky-600",    ring: "group-hover:ring-sky-200" },
  { icon: BookOpen,  name: "Aulas",       count: 180, bg: "bg-orange-50",  iconColor: "text-orange-500", ring: "group-hover:ring-orange-200" },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section id="servicos" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-3 px-3 py-1 bg-primary/10 rounded-full">
            Categorias
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
            Serviços para tudo que você precisa
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Mais de 2.000 profissionais prontos para atender você em 8 categorias diferentes.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              onClick={() => navigate("/cadastro")}
              className={`group cursor-pointer bg-card border border-border rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg ring-2 ring-transparent ${cat.ring}`}
            >
              <div
                className={`w-13 h-13 w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110`}
              >
                <cat.icon className={`h-6 w-6 ${cat.iconColor}`} />
              </div>
              <h3 className="font-display font-semibold text-foreground text-sm">{cat.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{cat.count} profissionais</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <button
            onClick={() => navigate("/cadastro")}
            className="text-sm font-medium text-primary hover:underline underline-offset-4 transition-colors"
          >
            Ver todos os serviços disponíveis →
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
