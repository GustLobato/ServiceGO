import { FileText, CheckCircle2, Clock, ChevronRight } from "lucide-react";

interface Stats {
  total: number;
  active: number;
  pending: number;
  completed: number;
}

const STAT_ITEMS = [
  {
    key: "active" as const,
    label: "Solicitações ativas",
    desc: "Veja e acompanhe suas solicitações",
    icon: FileText,
    bg: "bg-orange-100",
    color: "text-primary",
  },
  {
    key: "completed" as const,
    label: "Serviços concluídos",
    desc: "Serviços finalizados com sucesso",
    icon: CheckCircle2,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    key: "pending" as const,
    label: "Orçamentos recebidos",
    desc: "Orçamentos em aberto para avaliar",
    icon: Clock,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
];

const StatsGrid = ({ stats }: { stats: Stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    {STAT_ITEMS.map(({ key, label, desc, icon: Icon, bg, color }) => (
      <div
        key={key}
        className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer group"
      >
        <div className="flex items-start justify-between">
          <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-400 transition-colors mt-1" />
        </div>
        <div className="mt-4">
          <div className="font-display text-4xl font-bold text-gray-900">{stats[key]}</div>
          <div className="font-semibold text-gray-700 mt-1">{label}</div>
          <div className="text-xs text-gray-400 mt-1 leading-snug">{desc}</div>
        </div>
      </div>
    ))}
  </div>
);

export default StatsGrid;
