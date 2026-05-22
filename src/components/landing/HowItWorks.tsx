import { Search, MessageSquare, CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Search,
    title: "Busque o serviço",
    description: "Encontre profissionais por categoria, localização ou palavras-chave.",
    color: "bg-service-blue/10 text-service-blue",
  },
  {
    icon: MessageSquare,
    title: "Solicite um orçamento",
    description: "Envie sua solicitação e receba propostas de prestadores qualificados.",
    color: "bg-service-purple/10 text-service-purple",
  },
  {
    icon: CheckCircle2,
    title: "Acompanhe o serviço",
    description: "Monitore cada etapa em tempo real pelo seu dashboard.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Star,
    title: "Avalie o profissional",
    description: "Deixe sua avaliação e ajude outros clientes a escolherem melhor.",
    color: "bg-accent/10 text-accent",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Processo</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
            Como funciona
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Quatro passos simples para encontrar e contratar o profissional perfeito.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
              )}
              <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-5`}>
                <step.icon className="h-7 w-7" />
              </div>
              <div className="text-xs font-semibold text-muted-foreground mb-2">PASSO {i + 1}</div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
