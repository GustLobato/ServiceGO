import { FileText, CheckCircle2, Clock, Users, TrendingUp } from "lucide-react";

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
    desc: "Em aberto ou em andamento",
    icon: FileText,
    bg: "bg-orange-100",
    color: "text-primary",
    trend: "+2 esta semana",
  },
  {
    key: "completed" as const,
    label: "Serviços concluídos",
    desc: "Finalizados com sucesso",
    icon: CheckCircle2,
    bg: "bg-green-100",
    color: "text-green-600",
    trend: "Atualizado hoje",
  },
  {
    key: "pending" as const,
    label: "Orçamentos recebidos",
    desc: "Aguardando resposta",
    icon: Clock,
    bg: "bg-purple-100",
    color: "text-purple-600",
    trend: "Revisar agora",
  },
];

const PROVIDER_STATS = [
  {
    key: "pending" as const,
    label: "Novos leads",
    desc: "Solicitações aguardando aceite",
    icon: Users,
    bg: "bg-orange-100",
    color: "text-primary",
    trend: "Responda rápido",
  },
  {
    key: "active" as const,
    label: "Em andamento",
    desc: "Serviços em execução",
    icon: TrendingUp,
    bg: "bg-blue-100",
    color: "text-blue-600",
    trend: "Atualizado hoje",
  },
  {
    key: "completed" as const,
    label: "Concluídos",
    desc: "Serviços finalizados",
    icon: CheckCircle2,
    bg: "bg-green-100",
    color: "text-green-600",
    trend: "Histórico completo",
  },
];

const StatsGrid = ({
  stats,
  userRole,
}: {
  stats: Stats;
  userRole?: "cliente" | "prestador" | "admin";
}) => {
  const items = userRole === "prestador" ? PROVIDER_STATS : CLIENT_STATS;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {items.map(({ key, label, desc, icon: Icon, bg, color, trend }) => (
        <div
          key={key}
          className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${bg} ${color}`}>
              {trend}
            </span>
          </div>
          <div className="font-display text-4xl font-bold text-gray-900 mb-1">{stats[key]}</div>
          <div className="font-semibold text-gray-700 text-sm">{label}</div>
          <div className="text-xs text-gray-400 mt-1">{desc}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
