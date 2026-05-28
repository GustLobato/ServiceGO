import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import { motion } from "framer-motion";

const perks = [
  { icon: Zap, label: "Cadastro em 2 minutos" },
  { icon: Shield, label: "Prestadores verificados" },
  { icon: Users, label: "Comunidade ativa" },
];

const CTA = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-500 to-amber-500" />
          {/* Overlay patterns */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Floating blobs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

          <div className="relative z-10 p-12 md:p-20 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-semibold mb-6">
                Comece agora — é grátis
              </span>

              <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">
                Pronto para encontrar o<br />
                <span className="text-white/90">profissional ideal?</span>
              </h2>

              <p className="text-white/70 mt-5 text-lg max-w-xl mx-auto">
                Junte-se a milhares de clientes e prestadores que já confiam no ServiceGO.
              </p>

              {/* Perks */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {perks.map((p) => (
                  <div key={p.label} className="flex items-center gap-2 text-white/80 text-sm">
                    <p.icon className="h-4 w-4" />
                    {p.label}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-base px-8 h-12 gap-2 bg-white text-primary hover:bg-white/90 shadow-xl hover:-translate-y-0.5 transition-all"
                  asChild
                >
                  <Link to="/cadastro">
                    Criar Conta Grátis <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  className="text-base px-8 h-12 bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm hover:-translate-y-0.5 transition-all"
                  asChild
                >
                  <Link to="/login">Já tenho conta</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
