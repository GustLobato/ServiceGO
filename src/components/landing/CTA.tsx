import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import { motion } from "framer-motion";

const CTA = () => (
  <section className="py-20 bg-orange-50/40">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-orange-500 to-amber-400 p-14 md:p-20 text-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />

        <div className="relative z-10">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">
            Pronto para encontrar o<br />profissional ideal?
          </h2>
          <p className="text-white/75 mt-4 text-lg max-w-xl mx-auto">
            Junte-se a milhares de clientes e prestadores que já confiam no ServiceGO.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-5 text-white/80 text-sm">
            {[{ icon: Zap, label: "Cadastro gratuito" }, { icon: Shield, label: "Prestadores verificados" }, { icon: Users, label: "+5.000 profissionais" }].map((p) => (
              <div key={p.label} className="flex items-center gap-2">
                <p.icon className="h-4 w-4" /> {p.label}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8 h-12 gap-2 bg-white text-primary hover:bg-white/90 shadow-xl hover:-translate-y-0.5 transition-all" asChild>
              <Link to="/cadastro">Criar Conta Grátis <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button size="lg" className="text-base px-8 h-12 bg-white/15 hover:bg-white/25 text-white border border-white/30 hover:-translate-y-0.5 transition-all" asChild>
              <Link to="/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTA;
