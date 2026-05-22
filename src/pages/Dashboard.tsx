/**
 * Dashboard — shell de roteamento de views.
 *
 * Responsabilidade única: orquestrar layout, sidebar e views.
 * Toda lógica de estado está no hook useRequests; cada view é um componente isolado.
 *
 * Antes: 483 linhas com tudo acoplado.
 * Depois: ~80 linhas, puro layout e composição.
 */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRequests } from "@/features/dashboard/hooks/useRequests";
import Sidebar from "@/features/dashboard/components/Sidebar";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import DashboardHome from "@/features/dashboard/DashboardHome";
import SearchView from "@/features/dashboard/SearchView";
import RequestsView from "@/features/dashboard/RequestsView";
import ReviewsView from "@/features/dashboard/ReviewsView";
import ProfileView from "@/features/dashboard/ProfileView";
import type { SidebarView } from "@/features/dashboard/types";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<SidebarView>("dashboard");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    requests,
    filteredRequests,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    createRequest,
    updateStatus,
    isLoading,
  } = useRequests();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNav = (view: SidebarView) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  const userName = user?.name ?? "Usuário";
  const userInitials = useMemo(
    () =>
      userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [userName]
  );

  const completedRequests = useMemo(
    () => requests.filter((r) => r.status === "concluida"),
    [requests]
  );

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        activeView={activeView}
        onNavigate={handleNav}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader
          userInitials={userInitials}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuOpen={() => setSidebarOpen(true)}
        />

        <div className="p-6 max-w-6xl mx-auto w-full flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span>Carregando dados...</span>
            </div>
          ) : (
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === "dashboard" && (
                <DashboardHome
                  userName={userName}
                  stats={stats}
                  recentRequests={filteredRequests}
                  onNavigate={handleNav}
                  onCreateRequest={createRequest}
                  userRole={user?.role}
                  onUpdateStatus={updateStatus}
                />
              )}

              {activeView === "buscar" && (
                <SearchView
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onNavigate={handleNav}
                />
              )}

              {activeView === "solicitacoes" && (
                <RequestsView
                  filteredRequests={filteredRequests}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  userRole={user?.role}
                  onUpdateStatus={updateStatus}
                />
              )}

              {activeView === "avaliacoes" && (
                <ReviewsView completedRequests={completedRequests} />
              )}

              {activeView === "perfil" && user && (
                <ProfileView
                  user={user}
                  userName={userName}
                  userInitials={userInitials}
                />
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
