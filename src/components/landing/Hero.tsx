import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Star, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

const floatingCards = [
  {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    title: "Serviço concluído",
    sub: "Encanamento • agora mesmo",
  },
  {
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-50",
    title: "Nova avaliação 5★",
    sub: "Carlos P. • Elétrica",
  },
  {
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-50",
    title: "+12 profissionais",
    sub: "cadastrados hoje",
  },
];

const stats = [
  { icon: Users, value: "5.000+", label: "Profissionais", color: "text-primary" },
  { icon: TrendingUp, value: "50.000+", label: "Serviços realizados", color: "text-emerald-500" },
  { icon: Star, value: "4.9", label: "Avaliação média", color: "text-amber-500" },
];

const Hero = () => {
  const scrollToSection = () => {
    const el = document.getElementById("como-funciona");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-60 right-0 w-[500px] h-[500px] bg-amber-400/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/6 rounded-full blur-[80px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Plataforma #1 em serviços profissionais
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05]"
          >
            Encontre o profissional{" "}
            <span className="relative inline-block">
              <span className="text-primary">ideal</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M1 5.5 C50 1.5, 100 7.5, 199 3.5"
                  stroke="hsl(25 95% 53%)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>
            </span>{" "}
            para qualquer serviço
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Conectamos você a prestadores verificados, com transparência,{" "}
            avaliações reais e acompanhamento em tempo real.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="text-base px-8 h-12 gap-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
              asChild
            >
              <Link to="/cadastro">
                Começar Gratuitamente <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 h-12 gap-2 hover:-translate-y-0.5 transition-all"
              onClick={scrollToSection}
            >
              Ver como funciona
            </Button>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-4 text-xs text-muted-foreground"
          >
            Grátis para começar · Sem cartão de crédito · Cancele quando quiser
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <stat.icon className={`h-5 w-5 ${stat.color} mx-auto mb-1.5 opacity-70`} />
                <div className={`font-display text-2xl md:text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1 leading-tight">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating activity cards */}
        <div className="relative max-w-5xl mx-auto mt-16 hidden md:block">
          <div className="flex justify-between items-start px-8">
            {floatingCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}
                className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
                  <card.icon className={`h-4.5 w-4.5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{card.title}</p>
                  <p className="text-xs text-muted-foreground">{card.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
