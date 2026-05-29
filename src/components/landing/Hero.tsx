import { type ComponentType, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Star, Users, MapPin, Zap, type LucideProps } from "lucide-react";
import { motion } from "framer-motion";
import LiveTrackerMap from "./LiveTrackerMap";

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
    position: "top-8 left-[calc(50%+80px)]",
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
    position: "top-[58%] left-[calc(50%+130px)]",
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
    position: "bottom-8 right-[calc(50%+120px)]",
  },
];

const STATS = [
  { value: "5.000+", label: "Profissionais" },
  { value: "50k+",   label: "Serviços realizados" },
  { value: "4.9★",   label: "Avaliação média" },
];

const Hero = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada por seu navegador.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsLocating(false);
      },
      (error) => {
        console.error("Erro de geolocalização:", error);
        setIsLocating(false);
        alert("Não foi possível obter sua localização. Por favor, verifique suas permissões.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
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
              onClick={handleUseLocation}
              disabled={isLocating}
              className="w-full sm:w-auto gap-2 h-14 px-6 rounded-2xl text-gray-600 border-gray-200 hover:bg-gray-50 font-medium"
            >
              <MapPin className={`h-4 w-4 text-primary ${isLocating ? "animate-spin" : ""}`} />
              {isLocating ? "Localizando..." : "Usar minha localização"}
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

          {/* Activity cards — below stats */}
          <div className="mt-8 flex flex-wrap gap-3">
            {ACTIVITY_CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.12, ease: "easeOut" }}
                className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3"
              >
                <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 whitespace-nowrap">{card.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 whitespace-nowrap">{card.sub}</p>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full ${card.dot} flex-shrink-0`} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Right: Live interactive tracking map (desktop) ── */}
        <div className="hidden lg:block relative w-full max-w-[500px] justify-self-center">
          <LiveTrackerMap userLocation={userLocation} isLocating={isLocating} />
        </div>

      </div>
    </div>
  </section>
  );
};

export default Hero;
