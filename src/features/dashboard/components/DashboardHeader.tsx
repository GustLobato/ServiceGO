/**
 * DashboardHeader — barra superior do Dashboard.
 * Contém busca, notificações e avatar do usuário.
 */
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import { MOCK_NOTIFICATIONS } from "@/data/mockData";

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const hasUnread = MOCK_NOTIFICATIONS.some((n) => n.unread);

  return (
    <>
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
            className="relative"
            onClick={() => setNotificationsOpen(true)}
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            )}
          </Button>

          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Notifications Sheet */}
      <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notificações</SheetTitle>
            <SheetDescription>Suas notificações recentes</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {MOCK_NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-lg border ${
                  n.unread
                    ? "bg-primary/5 border-primary/20"
                    : "border-border"
                }`}
              >
                <p className="text-sm text-foreground">{n.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default DashboardHeader;
