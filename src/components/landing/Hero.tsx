import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, CheckCircle2, Star, Users, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const notifications = [
  {
    icon: CheckCircle2,
    bg: "bg-green-100",
    color: "text-green-600",
    dot: "bg-green-500",
    title: "Serviço concluído",
    sub: "Encanamento · Há 2 minutos",
  },
  {
    icon: Star,
    bg: "bg-amber-100",
    color: "text-amber-500",
    dot: "bg-amber-500",
    title: "Nova avaliação 5★",
    sub: "Carlos recebeu nova review",
  },
  {
    icon: Users,
    bg: "bg-blue-100",
    color: "text-blue-600",
    dot: "bg-blue-500",
    title: "+12 profissionais",
    sub: "Ativos na sua região hoje",
  },
];

const Hero = () => {
  const scrollToSection = () => {
    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative pt-28 pb-20 overflow-hidden bg-white">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/50 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-50/80 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-amber-50/60 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — headline + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-primary text-sm font-semibold mb-7 border border-orange-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Plataforma #1 de serviços no Brasil
            </span>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-[64px] font-bold text-gray-900 leading-[1.05] tracking-tight">
              Encontre o<br />
              profissional{" "}
              <span className="text-primary relative">
                ideal
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6 Q50 2 100 6 Q150 10 198 6" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
                </svg>
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-md">
              Conectamos você aos melhores profissionais da sua região com rapidez, segurança e transparência.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white gap-2.5 px-8 h-14 text-base font-semibold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-200 hover:-translate-y-0.5 transition-all rounded-2xl"
                asChild
              >
                <Link to="/cadastro">
                  <Search className="h-5 w-5" />
                  Encontrar profissionais
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={scrollToSection}
                className="text-gray-600 font-medium gap-2 hover:bg-gray-50 rounded-2xl h-14 px-6"
              >
                <MapPin className="h-4 w-4 text-primary" />
                Como funciona
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-11 flex items-center gap-8">
              {[
                { value: "5.000+",  label: "Profissionais" },
                { value: "50k+",    label: "Serviços realizados" },
                { value: "4.9★",    label: "Avaliação média" },
              ].map((s, i) => (
                <div key={s.label} className={i > 0 ? "border-l border-gray-200 pl-8" : ""}>
                  <div className="font-display text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — floating notification cards */}
          <div className="hidden lg:flex flex-col gap-4 items-center justify-center relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl opacity-60" />

            <div className="relative z-10 flex flex-col gap-4 p-8 w-full max-w-sm">
              {notifications.map((n, i) => (
                <motion.div
                  key={n.title}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-lg px-5 py-4"
                >
                  <div className={`w-11 h-11 rounded-xl ${n.bg} flex items-center justify-center flex-shrink-0`}>
                    <n.icon className={`h-5 w-5 ${n.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{n.sub}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${n.dot} flex-shrink-0`} />
                </motion.div>
              ))}

              {/* Featured professional card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-gradient-to-br from-primary to-orange-600 rounded-2xl p-5 text-white"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">
                    CS
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Carlos Silva</p>
                    <p className="text-xs text-white/70">Eletricista · São Paulo</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-white text-white" />
                    ))}
                    <span className="text-xs text-white/70 ml-1">5.0</span>
                  </div>
                  <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">
                    Disponível
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
