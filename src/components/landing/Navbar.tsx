import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UserPlus, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoFull } from "@/components/Logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Como funciona", id: "como-funciona" },
  { label: "Categorias", id: "servicos" },
  { label: "Avaliações", id: "avaliacoes" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
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
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4">
      {/* Main floating navbar */}
      <nav
        className={cn(
          "max-w-6xl mx-auto flex items-center justify-between h-[60px] px-4 sm:px-6 rounded-2xl border transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md border-gray-200/70 shadow-lg shadow-gray-200/60"
            : "bg-white/88 backdrop-blur-sm border-white/70 shadow-md shadow-gray-100/50"
        )}
      >
        {/* Logo */}
        <Link to="/" className="hover:opacity-85 transition-opacity flex-shrink-0">
          <LogoFull iconSize={28} textSize="text-lg" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <LogIn className="h-3.5 w-3.5" />
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-primary hover:bg-orange-600 px-5 py-2 rounded-xl shadow-sm shadow-orange-200 hover:shadow-md hover:shadow-orange-200 transition-all duration-150"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Cadastrar
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen
            ? <X className="h-5 w-5 text-gray-700" />
            : <Menu className="h-5 w-5 text-gray-700" />
          }
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="max-w-6xl mx-auto mt-2 bg-white/97 backdrop-blur-md rounded-2xl border border-gray-100 shadow-xl p-5 md:hidden"
          >
            {/* Nav links */}
            <div className="flex flex-col gap-1 mb-4">
              {NAV_LINKS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-left px-4 py-2.5 rounded-xl transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 py-2.5 rounded-xl transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Entrar
              </Link>
              <Link
                to="/cadastro"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-orange-600 py-2.5 rounded-xl shadow-sm shadow-orange-200 transition-all"
              >
                <UserPlus className="h-4 w-4" />
                Criar conta grátis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
