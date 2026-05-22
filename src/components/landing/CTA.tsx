import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-accent p-12 md:p-20 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(25_95%_53%/0.2),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(25_95%_53%/0.1),transparent_50%)]" />

          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-accent-foreground leading-tight">
              Pronto para encontrar o<br />profissional ideal?
            </h2>
            <p className="text-accent-foreground/70 mt-4 text-lg max-w-xl mx-auto">
              Junte-se a milhares de clientes e prestadores que já confiam no ServiceGO.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base px-8 h-12 gap-2" asChild>
                <Link to="/cadastro">
                  Criar Conta Grátis <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10 hover:text-accent-foreground"
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
};

export default CTA;
