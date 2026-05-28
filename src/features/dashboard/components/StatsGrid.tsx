import { FileText, CheckCircle2, Clock, Users, TrendingUp } from "lucide-react";
import { DashboardCard } from "@/components/ui/dashboard-card";

interface Stats {
  total: number;
  active: number;
  pending: number;
  completed: number;
}

const CLIENT_STATS = [
  {
    key: "active" as const,
    label: "Solicitações ativas",
    description: "Em aberto ou em andamento",
    icon: FileText,
    iconBg: "bg-orange-100",
    iconColor: "text-primary",
    badge: "+2 esta semana",
    badgeBg: "bg-orange-50",
    badgeColor: "text-primary",
  },
  {
    key: "completed" as const,
    label: "Serviços concluídos",
    description: "Finalizados com sucesso",
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    badge: "Atualizado hoje",
    badgeBg: "bg-green-50",
    badgeColor: "text-green-700",
  },
  {
    key: "pending" as const,
    label: "Orçamentos recebidos",
    description: "Aguardando resposta",
    icon: Clock,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    badge: "Revisar agora",
    badgeBg: "bg-purple-50",
    badgeColor: "text-purple-700",
  },
];

const PROVIDER_STATS = [
  {
    key: "pending" as const,
    label: "Novos leads",
    description: "Solicitações aguardando aceite",
    icon: Users,
    iconBg: "bg-orange-100",
    iconColor: "text-primary",
    badge: "Responda rápido",
    badgeBg: "bg-orange-50",
    badgeColor: "text-primary",
  },
  {
    key: "active" as const,
    label: "Em andamento",
    description: "Serviços em execução",
    icon: TrendingUp,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "Atualizado hoje",
    badgeBg: "bg-blue-50",
    badgeColor: "text-blue-700",
  },
  {
    key: "completed" as const,
    label: "Concluídos",
    description: "Serviços finalizados",
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    badge: "Histórico completo",
    badgeBg: "bg-green-50",
    badgeColor: "text-green-700",
  },
];

const StatsGrid = ({
  stats,
  userRole,
  onNavigate,
}: {
  stats: Stats;
  userRole?: "cliente" | "prestador" | "admin";
  onNavigate?: (view: string) => void;
}) => {
  const items = userRole === "prestador" ? PROVIDER_STATS : CLIENT_STATS;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {items.map(({ key, label, description, icon, iconBg, iconColor, badge, badgeBg, badgeColor }) => (
        <DashboardCard
          key={key}
          icon={icon}
          iconBg={iconBg}
          iconColor={iconColor}
          value={stats[key]}
          label={label}
          description={description}
          badge={badge}
          badgeBg={badgeBg}
          badgeColor={badgeColor}
          onClick={onNavigate ? () => onNavigate(key === "active" ? "solicitacoes" : key === "completed" ? "avaliacoes" : "solicitacoes") : undefined}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
