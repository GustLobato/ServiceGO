import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users, Star } from "lucide-react";
import { motion } from "framer-motion";

const TRUST_ITEMS = [
  { icon: Zap, label: "Cadastro gratuito" },
  { icon: Shield, label: "Prestadores verificados" },
  { icon: Users, label: "+5.000 profissionais" },
];

const AVATARS = [
  { initials: "MS", bg: "from-pink-400 to-rose-500" },
  { initials: "CO", bg: "from-blue-400 to-indigo-500" },
  { initials: "AC", bg: "from-emerald-400 to-teal-500" },
  { initials: "JP", bg: "from-violet-400 to-purple-500" },
  { initials: "RS", bg: "from-amber-400 to-orange-500" },
];

const CTA = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-orange-500 to-amber-400 px-8 py-16 md:px-16 md:py-20 text-center"
      >
        {/* Decorative light radials */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(255,255,255,0.18),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.12),transparent_50%)] pointer-events-none" />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Floating decorative rings */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute top-8 right-32 w-32 h-32 rounded-full border border-white/10 pointer-events-none" />

        <div className="relative z-10">
          {/* Social proof — avatar stack */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex items-center justify-center gap-0 mb-6"
          >
            {AVATARS.map((a, i) => (
              <div
                key={a.initials}
                className={`w-9 h-9 rounded-full bg-gradient-to-br ${a.bg} border-2 border-white/80 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}
                style={{ marginLeft: i > 0 ? "-10px" : 0, zIndex: AVATARS.length - i }}
              >
                {a.initials}
              </div>
            ))}
            <div className="ml-3 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-white text-white" />
                ))}
              </div>
              <span className="text-white/80 text-sm font-medium">+12k clientes satisfeitos</span>
            </div>
          </motion.div>

          {/* Headline */}
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-2xl mx-auto">
            Pronto para encontrar o<br className="hidden md:block" /> profissional ideal?
          </h2>

          <p className="text-white/75 mt-4 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Junte-se a milhares de clientes e prestadores que já confiam no ServiceGO para conectar e crescer.
          </p>

          {/* Trust chips */}
          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-white/80 text-sm">
            {TRUST_ITEMS.map((p) => (
              <div key={p.label} className="flex items-center gap-1.5">
                <p.icon className="h-4 w-4 flex-shrink-0" />
                <span>{p.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-base px-8 h-12 gap-2 bg-white text-primary font-bold hover:bg-white/90 shadow-xl shadow-orange-900/20 hover:-translate-y-0.5 transition-all rounded-2xl"
              asChild
            >
              <Link to="/cadastro">
                Criar conta grátis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="text-base px-8 h-12 bg-transparent hover:bg-white/15 text-white font-semibold border border-white/30 hover:border-white/50 hover:-translate-y-0.5 transition-all rounded-2xl"
              asChild
            >
              <Link to="/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTA;
