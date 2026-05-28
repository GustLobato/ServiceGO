import { Search, MessageSquare, CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Busque o serviço",
    desc: "Encontre profissionais por categoria, localização ou palavras-chave em segundos.",
    bg: "bg-blue-100",
    color: "text-blue-600",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    icon: MessageSquare,
    number: "02",
    title: "Solicite um orçamento",
    desc: "Envie sua solicitação e receba propostas de prestadores qualificados.",
    bg: "bg-purple-100",
    color: "text-purple-600",
    gradient: "from-purple-400 to-purple-600",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "Acompanhe o serviço",
    desc: "Monitore cada etapa em tempo real pelo seu painel personalizado.",
    bg: "bg-orange-100",
    color: "text-primary",
    gradient: "from-orange-400 to-primary",
  },
  {
    icon: Star,
    number: "04",
    title: "Avalie o profissional",
    desc: "Deixe sua avaliação e ajude outros clientes a escolherem melhor.",
    bg: "bg-amber-100",
    color: "text-amber-500",
    gradient: "from-amber-400 to-amber-600",
  },
];

const HowItWorks = () => (
  <section id="como-funciona" className="py-24 relative overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-b from-orange-50/60 to-white" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold mb-3">
          <span className="w-4 h-0.5 bg-primary rounded" />
          Processo
          <span className="w-4 h-0.5 bg-primary rounded" />
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-1">
          Como funciona
        </h2>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          Em apenas quatro passos simples você encontra e contrata o profissional perfeito.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="grid md:grid-cols-4 gap-8 relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-200 via-purple-200 to-amber-200" />

        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="relative text-center md:text-left"
          >
            {/* Step icon */}
            <div className="relative inline-block mb-6">
              <div className={`w-20 h-20 rounded-2xl ${step.bg} flex items-center justify-center`}>
                <step.icon className={`h-8 w-8 ${step.color}`} />
              </div>
              {/* Step number badge */}
              <span className={`absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white text-[11px] font-bold shadow-sm`}>
                {step.number.slice(1)}
              </span>
            </div>

            <p className="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase mb-2">
              Passo {step.number}
            </p>
            <h3 className="font-display text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
