import { Search, MessageSquare, CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: Search,       number: "01", title: "Busque o serviço",       desc: "Encontre profissionais por categoria, localização ou palavras-chave.",            bg: "bg-blue-100",   color: "text-blue-600" },
  { icon: MessageSquare,number: "02", title: "Solicite um orçamento",  desc: "Envie sua solicitação e receba propostas de prestadores qualificados.",           bg: "bg-purple-100", color: "text-purple-600" },
  { icon: CheckCircle2, number: "03", title: "Acompanhe o serviço",    desc: "Monitore cada etapa em tempo real pelo seu painel personalizado.",               bg: "bg-orange-100", color: "text-primary" },
  { icon: Star,         number: "04", title: "Avalie o profissional",  desc: "Deixe sua avaliação e ajude outros clientes a escolherem melhor.",              bg: "bg-amber-100",  color: "text-amber-500" },
];

const HowItWorks = () => (
  <section id="como-funciona" className="py-20 bg-orange-50/40">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <span className="text-primary text-sm font-semibold">Processo</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2">Como funciona</h2>
        <p className="text-gray-500 mt-3 max-w-lg">
          Quatro passos simples para encontrar e contratar o profissional perfeito.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-[70%] w-[60%] h-px bg-gray-200" />
            )}
            <div className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center mb-5`}>
              <step.icon className={`h-7 w-7 ${step.color}`} />
            </div>
            <span className="text-xs font-bold text-gray-400 tracking-widest">PASSO {step.number}</span>
            <h3 className="font-display text-lg font-semibold text-gray-900 mt-1 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
