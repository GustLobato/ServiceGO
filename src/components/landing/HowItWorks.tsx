import { Search, MessageSquare, CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Search,
    title: "Busque o serviço",
    description: "Encontre profissionais por categoria, localização ou palavras-chave.",
    gradient: "from-blue-500 to-sky-400",
    shadow: "shadow-blue-200",
    number: "01",
  },
  {
    icon: MessageSquare,
    title: "Solicite um orçamento",
    description: "Envie sua solicitação e receba propostas de prestadores qualificados.",
    gradient: "from-violet-500 to-purple-400",
    shadow: "shadow-purple-200",
    number: "02",
  },
  {
    icon: CheckCircle2,
    title: "Acompanhe o serviço",
    description: "Monitore cada etapa em tempo real pelo seu dashboard personalizado.",
    gradient: "from-primary to-orange-400",
    shadow: "shadow-orange-200",
    number: "03",
  },
  {
    icon: Star,
    title: "Avalie o profissional",
    description: "Deixe sua avaliação e ajude outros clientes a escolherem melhor.",
    gradient: "from-amber-500 to-yellow-400",
    shadow: "shadow-amber-200",
    number: "04",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-secondary/40 -z-10" />
      <div
        className="absolute inset-0 opacity-[0.03] -z-10"
        style={{
          backgroundImage:
            "linear-gradient(hsl(25 95% 53%) 1px, transparent 1px), linear-gradient(to right, hsl(25 95% 53%) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-3 px-3 py-1 bg-primary/10 rounded-full">
            Processo
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
            Como funciona
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
            Quatro passos simples para encontrar e contratar o profissional perfeito.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto relative">
          {/* Connector line desktop */}
          <div className="hidden md:block absolute top-9 left-[12.5%] right-[12.5%] h-px">
            <div className="h-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative text-center group"
            >
              {/* Number badge */}
              <div className="absolute -top-3 -right-1 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center z-10 hidden md:flex">
                <span className="text-[10px] font-bold text-muted-foreground">{step.number}</span>
              </div>

              {/* Icon */}
              <div
                className={`w-18 h-18 w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg ${step.shadow} flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1`}
              >
                <step.icon className="h-8 w-8 text-white" />
              </div>

              <div className="text-xs font-bold text-muted-foreground mb-2 tracking-widest">
                PASSO {i + 1}
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
