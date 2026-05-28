import { Link } from "react-router-dom";
import { Zap, Github, Instagram, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();

  const handleLink = (label: string) => {
    toast({ title: label, description: "Página será disponibilizada em breve." });
  };

  const nav = [
    {
      title: "Plataforma",
      links: [
        { label: "Como funciona", action: () => handleLink("Como funciona") },
        { label: "Categorias", action: () => handleLink("Categorias") },
        { label: "Preços", action: () => handleLink("Preços") },
        { label: "Para prestadores", action: () => handleLink("Para prestadores") },
      ],
    },
    {
      title: "Empresa",
      links: [
        { label: "Sobre nós", action: () => handleLink("Sobre nós") },
        { label: "Blog", action: () => handleLink("Blog") },
        { label: "Carreiras", action: () => handleLink("Carreiras") },
        { label: "Contato", action: () => handleLink("Contato") },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Termos de Uso", action: () => handleLink("Termos de Uso") },
        { label: "Privacidade", action: () => handleLink("Privacidade") },
        { label: "Cookies", action: () => handleLink("Cookies") },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 py-16">
        {/* Top row */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group w-fit mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/30 group-hover:scale-105 transition-transform">
                <Zap className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Service<span className="text-primary">GO</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Conectamos clientes a prestadores verificados com transparência e segurança.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: Github, label: "GitHub", href: "https://github.com/GustLobato/ServiceGO" },
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Linkedin, label: "LinkedIn", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-muted hover:bg-muted-foreground/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {nav.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm text-foreground mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={link.action}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 ServiceGO. Todos os direitos reservados.</p>
          <p className="text-xs">
            Projeto de Extensão Universitária · Desenvolvido com React + TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
