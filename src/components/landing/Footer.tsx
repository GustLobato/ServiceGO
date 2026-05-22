import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();

  const handleLink = (label: string) => {
    toast({ title: label, description: "Página será disponibilizada em breve." });
  };

  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xs">S</span>
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              Service<span className="text-primary">GO</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <button onClick={() => handleLink("Termos de Uso")} className="hover:text-foreground transition-colors">Termos de Uso</button>
            <button onClick={() => handleLink("Privacidade")} className="hover:text-foreground transition-colors">Privacidade</button>
            <button onClick={() => handleLink("Contato")} className="hover:text-foreground transition-colors">Contato</button>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2026 ServiceGO. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
