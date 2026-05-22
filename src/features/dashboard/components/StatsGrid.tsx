/**
 * StatsGrid — grade de cards de estatísticas do Dashboard.
 */
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

interface Stats {
  total: number;
  active: number;
  pending: number;
  completed: number;
}

interface StatsGridProps {
  stats: Stats;
}

const STAT_ITEMS = [
  { key: "total" as const, label: "Total", icon: FileText, color: "text-foreground" },
  { key: "active" as const, label: "Ativas", icon: ArrowUpRight, color: "text-primary" },
  { key: "pending" as const, label: "Pendentes", icon: Clock, color: "text-primary" },
  { key: "completed" as const, label: "Concluídas", icon: CheckCircle2, color: "text-primary" },
];

const StatsGrid = ({ stats }: StatsGridProps) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {STAT_ITEMS.map(({ key, label, icon: Icon, color }) => (
      <Card key={label}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{label}</span>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <div className="font-display text-3xl font-bold text-foreground">
            {stats[key]}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default StatsGrid;
