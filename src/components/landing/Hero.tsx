import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MapPin, CheckCircle2, Star, Users } from "lucide-react";
import { motion } from "framer-motion";

const notifications = [
  {
    icon: CheckCircle2,
    bg: "bg-green-100",
    color: "text-green-600",
    dot: "bg-green-500",
    title: "Serviço concluído",
    sub: "Há 2 minutos",
  },
  {
    icon: Star,
    bg: "bg-amber-100",
    color: "text-amber-500",
    dot: "bg-amber-500",
    title: "Nova avaliação 5★",
    sub: "Há 5 minutos",
  },
  {
    icon: Users,
    bg: "bg-blue-100",
    color: "text-blue-600",
    dot: "bg-blue-500",
    title: "+12 profissionais",
    sub: "Ativos na sua região",
  },
];

const Hero = () => {
  const scrollToSection = () => {
    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative pt-28 pb-16 overflow-hidden bg-white">
      {/* Orange blobs */}
      <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-orange-100/60 rounded-full blur-[100px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[320px] h-[320px] bg-orange-50 rounded-full blur-[80px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-primary text-sm font-semibold mb-6 border border-orange-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Plataforma #1 em serviços
              </span>

              <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-900 leading-[1.05] tracking-tight">
                Encontre o<br />profissional <span className="text-primary">ideal</span>
              </h1>

              <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-lg">
                Encontre rapidamente profissionais confiáveis para qualquer serviço perto de você.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white gap-2 px-8 h-13 text-base shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-200 transition-all"
                  asChild
                >
                  <Link to="/cadastro">
                    <Search className="h-5 w-5" />
                    Encontrar profissionais
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={scrollToSection}
                  className="text-primary font-medium gap-2 hover:bg-orange-50"
                >
                  <MapPin className="h-4 w-4" />
                  Como funciona
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-10 flex items-center gap-8">
                {[
                  { value: "5.000+", label: "Profissionais" },
                  { value: "50k+", label: "Serviços realizados" },
                  { value: "4.9★", label: "Avaliação média" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-2xl font-bold text-gray-900">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: floating notification cards */}
          <div className="hidden lg:flex flex-col gap-4 items-end">
            {notifications.map((n, i) => (
              <motion.div
                key={n.title}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-lg px-5 py-4 w-72"
              >
                <div className={`w-12 h-12 rounded-2xl ${n.bg} flex items-center justify-center flex-shrink-0`}>
                  <n.icon className={`h-5 w-5 ${n.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.sub}</p>
                </div>
                <span className={`w-2 h-2 rounded-full ${n.dot} flex-shrink-0`} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
