import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Se não estiver na home, navega para a home com anchor
      window.location.href = "/#" + id;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">S</span>
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Service<span className="text-primary">GO</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo("como-funciona")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Como Funciona
          </button>
          <button onClick={() => scrollTo("servicos")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Serviços
          </button>
          <button onClick={() => scrollTo("avaliacoes")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Avaliações
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link to="/cadastro">Criar Conta</Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              <button onClick={() => scrollTo("como-funciona")} className="text-sm text-muted-foreground text-left">
                Como Funciona
              </button>
              <button onClick={() => scrollTo("servicos")} className="text-sm text-muted-foreground text-left">
                Serviços
              </button>
              <button onClick={() => scrollTo("avaliacoes")} className="text-sm text-muted-foreground text-left">
                Avaliações
              </button>
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" asChild className="flex-1">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link to="/cadastro">Criar Conta</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
