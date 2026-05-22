/**
 * Sidebar — navegação lateral do Dashboard.
 * Extracted from Dashboard.tsx para isolar responsabilidade única.
 */
import { Link } from "react-router-dom";
import {
  Home,
  Search,
  FileText,
  Star,
  User,
  LogOut,
  X,
} from "lucide-react";
import type { SidebarView } from "@/features/dashboard/types";

interface SidebarProps {
  activeView: SidebarView;
  onNavigate: (view: SidebarView) => void;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const SIDEBAR_ITEMS: { icon: typeof Home; label: string; view: SidebarView }[] =
  [
    { icon: Home, label: "Dashboard", view: "dashboard" },
    { icon: Search, label: "Buscar Serviços", view: "buscar" },
    { icon: FileText, label: "Minhas Solicitações", view: "solicitacoes" },
    { icon: Star, label: "Avaliações", view: "avaliacoes" },
    { icon: User, label: "Meu Perfil", view: "perfil" },
  ];

const Sidebar = ({
  activeView,
  onNavigate,
  open,
  onClose,
  onLogout,
}: SidebarProps) => (
  <aside
    className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 ${
      open ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">
              S
            </span>
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Service<span className="text-primary">GO</span>
          </span>
        </Link>
        <button
          className="lg:hidden"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              activeView === item.view
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Sair
        </button>
      </div>
    </div>
  </aside>
);

export default Sidebar;
