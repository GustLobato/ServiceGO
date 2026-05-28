import { Link } from "react-router-dom";
import { Home, Search, FileText, Star, User, LogOut, X, HeadphonesIcon } from "lucide-react";
import type { SidebarView } from "@/features/dashboard/types";
import { LogoFull } from "@/components/Logo";

interface SidebarProps {
  activeView: SidebarView;
  onNavigate: (view: SidebarView) => void;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const ITEMS: { icon: typeof Home; label: string; view: SidebarView }[] = [
  { icon: Home,     label: "Início",              view: "dashboard" },
  { icon: Search,   label: "Buscar serviços",     view: "buscar" },
  { icon: FileText, label: "Agendamentos",         view: "solicitacoes" },
  { icon: Star,     label: "Avaliações",          view: "avaliacoes" },
  { icon: User,     label: "Meu perfil",          view: "perfil" },
];

const Sidebar = ({ activeView, onNavigate, open, onClose, onLogout }: SidebarProps) => (
  <aside
    className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 transform transition-transform duration-200 lg:translate-x-0 flex flex-col ${
      open ? "translate-x-0 shadow-2xl" : "-translate-x-full"
    }`}
  >
    {/* Logo header */}
    <div className="h-[68px] flex items-center justify-between px-5 border-b border-gray-100">
      <Link to="/" onClick={onClose}>
        <LogoFull iconSize={26} textSize="text-lg" />
      </Link>
      <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors" onClick={onClose}>
        <X className="h-5 w-5 text-gray-500" />
      </button>
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {ITEMS.map((item) => {
        const active = activeView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              active
                ? "bg-orange-50 text-primary"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-primary" : "text-gray-400"}`} />
            {item.label}
          </button>
        );
      })}
    </nav>

    {/* Help card */}
    <div className="px-3 pb-4 space-y-2">
      <div className="bg-orange-50 rounded-2xl p-4 text-center">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
          <HeadphonesIcon className="h-5 w-5 text-white" />
        </div>
        <p className="font-semibold text-sm text-gray-900">Precisa de ajuda?</p>
        <p className="text-xs text-gray-500 mt-1 mb-3">Fale com nosso suporte e tire suas dúvidas.</p>
        <button className="w-full py-2 px-4 rounded-xl border border-primary text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors">
          Entrar em contato
        </button>
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        <LogOut className="h-5 w-5 flex-shrink-0" />
        Sair da conta
      </button>
    </div>
  </aside>
);

export default Sidebar;
