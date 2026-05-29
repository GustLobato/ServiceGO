import { Search, UserCheck, CalendarCheck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { type ComponentType } from "react";
import { type LucideProps } from "lucide-react";

interface Step {
  icon: ComponentType<LucideProps>;
  num: string;
  title: string;
  desc: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  numColor: string;
}

const STEPS: Step[] = [
  {
    icon: Search,
    num: "01",
    title: "Busque o serviço",
    desc: "Pesquise profissionais por categoria ou localização e encontre exatamente o que você precisa em segundos.",
    gradient: "from-blue-500 to-blue-700",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    numColor: "text-blue-600",
  },
  {
    icon: UserCheck,
    num: "02",
    title: "Escolha o profissional",
    desc: "Compare avaliações, veja perfis detalhados e selecione o profissional ideal para o seu serviço com segurança.",
    gradient: "from-purple-500 to-purple-700",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    numColor: "text-purple-600",
  },
  {
    icon: CalendarCheck,
    num: "03",
    title: "Agende com segurança",
    desc: "Contrate com confiança, acompanhe o andamento em tempo real e avalie após a conclusão do serviço.",
    gradient: "from-primary to-orange-600",
    iconBg: "bg-orange-50",
    iconColor: "text-primary",
    numColor: "text-primary",
  },
];

const HowItWorks = () => (
  <section id="como-funciona" className="py-16 sm:py-24 relative overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50/40 to-white pointer-events-none" />
    {/* Decorative blob */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-50/60 rounded-full blur-[100px] pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
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
        <p className="text-gray-500 mt-3 max-w-md mx-auto text-base">
          Em apenas três passos simples você encontra e contrata o profissional perfeito.
        </p>
      </motion.div>

      {/* Steps grid */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-10 relative">

        {/* Desktop connecting line */}
        <div className="hidden md:block absolute top-[52px] left-[18%] right-[18%] h-px pointer-events-none">
          <div className="w-full border-t-2 border-dashed border-gray-200" />
        </div>

        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.14, duration: 0.5 }}
            className="relative"
          >
            {/* Desktop connector arrows */}
            {i < STEPS.length - 1 && (
              <div className="hidden md:flex absolute -right-5 lg:-right-7 top-[44px] z-10">
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </div>
            )}

            {/* Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-7 h-full flex flex-col">

              {/* Step circle + number */}
              <div className="flex items-start gap-4 mb-5">
                <div className="relative flex-shrink-0">
                  {/* Gradient circle */}
                  <div className={`w-[52px] h-[52px] rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-md`}>
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  {/* Number badge */}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                    <span className={`text-[10px] font-bold ${step.numColor}`}>{step.num}</span>
                  </span>
                </div>

                {/* Step label */}
                <div className="pt-2">
                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-gray-400">
                    Passo {step.num}
                  </p>
                </div>
              </div>

              {/* Content */}
              <h3 className="font-display text-lg font-bold text-gray-900 mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">
                {step.desc}
              </p>

              {/* Bottom accent line */}
              <div className={`mt-6 h-1 w-12 rounded-full bg-gradient-to-r ${step.gradient} opacity-60`} />
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  </section>
);

export default HowItWorks;
