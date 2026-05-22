/**
 * DashboardHeader — barra superior do Dashboard.
 * Contém busca, notificações e avatar do usuário.
 */
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Menu } from "lucide-react";

interface DashboardHeaderProps {
  userInitials: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onMenuOpen: () => void;
}

const DashboardHeader = ({
  userInitials,
  searchQuery,
  onSearchChange,
  onMenuOpen,
}: DashboardHeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden"
          onClick={onMenuOpen}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden md:block">
          <Input
            placeholder="Buscar serviços, prestadores..."
            className="w-72 h-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            {userInitials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default DashboardHeader;
