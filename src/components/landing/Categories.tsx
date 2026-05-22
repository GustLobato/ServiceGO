import { Wrench, Paintbrush, Zap, Home, Car, Scissors, Monitor, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { icon: Wrench, name: "Encanamento", count: 340 },
  { icon: Zap, name: "Elétrica", count: 280 },
  { icon: Paintbrush, name: "Pintura", count: 210 },
  { icon: Home, name: "Reformas", count: 450 },
  { icon: Car, name: "Automotivo", count: 190 },
  { icon: Scissors, name: "Estética", count: 320 },
  { icon: Monitor, name: "Tecnologia", count: 260 },
  { icon: BookOpen, name: "Aulas", count: 180 },
];

const Categories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCategoryClick = (name: string) => {
    toast({ title: `Categoria: ${name}`, description: "Redirecionando para cadastro..." });
    navigate("/cadastro");
  };

  return (
    <section id="servicos" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Categorias</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
            Serviços para tudo que você precisa
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="group cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                onClick={() => handleCategoryClick(cat.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{cat.count} profissionais</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
