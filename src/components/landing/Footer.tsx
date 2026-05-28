import { Link } from "react-router-dom";
import { Github, Instagram, Linkedin } from "lucide-react";
import { LogoFull } from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();
  const soon = (label: string) => toast({ title: label, description: "Disponível em breve." });

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/"><LogoFull iconSize={28} textSize="text-lg" /></Link>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Conectamos clientes a prestadores verificados com transparência e segurança.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: Github, href: "https://github.com/GustLobato/ServiceGO" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors">
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Plataforma", links: ["Como funciona", "Categorias", "Para prestadores", "Preços"] },
            { title: "Empresa", links: ["Sobre nós", "Blog", "Carreiras", "Contato"] },
            { title: "Legal", links: ["Termos de Uso", "Privacidade", "Cookies"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm text-gray-900 mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <button onClick={() => soon(l)} className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-left">{l}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© 2026 ServiceGO. Todos os direitos reservados.</p>
          <p className="text-xs">Projeto de Extensão Universitária · React + TypeScript</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
