import { type ComponentType } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Star, Users, MapPin, Zap, type LucideProps } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityCard {
  id: string;
  icon: ComponentType<LucideProps>;
  iconBg: string;
  iconColor: string;
  dot: string;
  title: string;
  sub: string;
  initial: { opacity: number; x: number };
  delay: number;
  position: string;
}

const ACTIVITY_CARDS: ActivityCard[] = [
  {
    id: "concluido",
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    dot: "bg-green-500",
    title: "Serviço concluído",
    sub: "Encanamento · 2min atrás",
    initial: { opacity: 0, x: 24 },
    delay: 0.55,
    position: "top-8 right-0",
  },
  {
    id: "avaliacao",
    icon: Star,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
    dot: "bg-amber-400",
    title: "Nova avaliação 5★",
    sub: "Carlos recebeu nova review",
    initial: { opacity: 0, x: 24 },
    delay: 0.72,
    position: "top-[58%] right-0",
  },
  {
    id: "profissionais",
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    dot: "bg-blue-500",
    title: "+12 profissionais",
    sub: "Ativos na sua região hoje",
    initial: { opacity: 0, x: -24 },
    delay: 0.88,
    position: "bottom-8 left-0",
  },
];

const STATS = [
  { value: "5.000+", label: "Profissionais" },
  { value: "50k+",   label: "Serviços realizados" },
  { value: "4.9★",   label: "Avaliação média" },
];

const Hero = () => (
  <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 sm:pt-28 sm:pb-16 overflow-hidden bg-white">
    {/* Background ambient blobs */}
    <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-orange-100/40 rounded-full blur-[150px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-50/70 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
    <div className="absolute top-1/2 left-[45%] w-[350px] h-[350px] bg-amber-50/50 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
      <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

        {/* ── Left: copy + CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Live badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-primary text-sm font-semibold mb-7 border border-orange-100"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Plataforma #1 de serviços no Brasil
          </motion.span>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[64px] xl:text-7xl font-bold text-gray-900 leading-[1.05] tracking-tight">
            Encontre o<br />
            profissional{" "}
            <span className="text-primary relative inline-block">
              ideal
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 200 10"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 7 Q50 3 100 7 Q150 11 198 7"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.45"
                />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-gray-500 leading-relaxed max-w-lg">
            Conectamos você aos melhores profissionais da sua região com rapidez, segurança e transparência total.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="w-full sm:w-auto gap-2 px-8 h-14 text-base rounded-2xl shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-200 hover:-translate-y-0.5 transition-all"
              asChild
            >
              <Link to="/cadastro">
                Encontrar profissionais
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto gap-2 h-14 px-6 rounded-2xl text-gray-600 border-gray-200 hover:bg-gray-50 font-medium"
            >
              <MapPin className="h-4 w-4 text-primary" />
              Usar minha localização
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-11 grid grid-cols-1 gap-3 min-[360px]:grid-cols-3 sm:flex sm:flex-wrap sm:items-center sm:gap-y-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-gray-100 min-[360px]:text-center sm:rounded-none sm:bg-transparent sm:p-0 sm:text-left sm:shadow-none sm:ring-0 ${i > 0 ? "sm:border-l sm:border-gray-200 sm:pl-8" : ""} ${i < STATS.length - 1 ? "sm:pr-8" : ""}`}
              >
                <div className="font-display text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Mobile activity cards */}
          <div className="lg:hidden mt-10 flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
            {ACTIVITY_CARDS.map((card) => (
              <div
                key={card.id}
                className="flex-shrink-0 flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3"
              >
                <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 whitespace-nowrap">{card.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 whitespace-nowrap">{card.sub}</p>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full ${card.dot} flex-shrink-0`} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Right: floating card composition (desktop) ── */}
        <div className="hidden lg:block relative h-[540px]">
          {/* Glow behind cards */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-orange-100 to-amber-50 rounded-full blur-2xl opacity-70 pointer-events-none" />

          {/* Central provider card */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100/60 p-6 z-10"
          >
            {/* Avatar */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-200 mb-4">
                CS
              </div>
              <h3 className="font-display font-bold text-gray-900 text-base leading-tight">Carlos Silva</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" />
                Eletricista · São Paulo
              </p>
            </div>

            {/* Stars */}
            <div className="flex items-center justify-center gap-0.5 mt-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm font-bold text-gray-900 ml-2">4.9</span>
            </div>

            {/* Stat chips */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="font-bold text-gray-900 text-sm">128</div>
                <div className="text-[11px] text-gray-500">Serviços</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <div className="font-bold text-primary text-sm flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Livre
                </div>
                <div className="text-[11px] text-gray-500">Disponível</div>
              </div>
            </div>

            {/* Hire CTA */}
            <button className="w-full mt-4 bg-primary hover:bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-xl shadow-sm shadow-orange-200 transition-colors">
              Contratar agora
            </button>
          </motion.div>

          {/* Floating notification cards */}
          {ACTIVITY_CARDS.map((card) => (
            <motion.div
              key={card.id}
              initial={card.initial}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: card.delay, ease: "easeOut" }}
              className={`absolute ${card.position} flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg px-4 py-3 z-20 max-w-[210px]`}
            >
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                <card.icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 leading-tight">{card.title}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{card.sub}</p>
              </div>
              <span className={`w-1.5 h-1.5 rounded-full ${card.dot} flex-shrink-0 ml-auto`} />
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  </section>
);

export default Hero;
