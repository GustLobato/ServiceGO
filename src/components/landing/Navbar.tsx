import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoFull } from "@/components/Logo";

const NAV_LINKS = [
  { label: "Como funciona", id: "como-funciona" },
  { label: "Categorias", id: "servicos" },
  { label: "Avaliações", id: "avaliacoes" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.href = "/#" + id;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-sm border-b border-gray-100" : "border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <LogoFull iconSize={30} textSize="text-xl" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-700 font-medium" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white gap-2 px-5 shadow-sm shadow-orange-200"
            asChild
          >
            <Link to="/cadastro">
              <UserPlus className="h-4 w-4" />
              Cadastrar
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 text-left py-1 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild className="flex-1 gap-2 bg-primary hover:bg-primary/90">
                  <Link to="/cadastro">
                    <UserPlus className="h-4 w-4" /> Cadastrar
                  </Link>
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
