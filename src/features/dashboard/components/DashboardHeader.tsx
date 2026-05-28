import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search } from "lucide-react";

interface DashboardHeaderProps {
  userInitials: string;
  userName?: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onMenuOpen: () => void;
}

const DashboardHeader = ({ userInitials, userName, searchQuery, onSearchChange, onMenuOpen }: DashboardHeaderProps) => (
  <header className="h-[68px] border-b border-gray-100 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0">
    <div className="flex items-center gap-4">
      <button
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        onClick={onMenuOpen}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      <div className="hidden md:flex items-center relative">
        <Search className="absolute left-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar serviços, prestadores..."
          className="pl-9 w-72 h-9 rounded-xl border-gray-200 focus:border-primary text-sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>

    <div className="flex items-center gap-3">
      <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors" aria-label="Notificações">
        <Bell className="h-5 w-5 text-gray-600" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
      </button>

      <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-white font-semibold text-sm">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        {userName && (
          <span className="text-sm font-medium text-gray-700 hidden md:block">
            Olá, {userName.split(" ")[0]}
          </span>
        )}
      </div>
    </div>
  </header>
);

export default DashboardHeader;
