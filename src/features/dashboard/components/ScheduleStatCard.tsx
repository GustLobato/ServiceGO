import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleStatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  detail: string;
  tone?: "orange" | "amber" | "green" | "slate";
}

const TONE_CLASSES: Record<NonNullable<ScheduleStatCardProps["tone"]>, string> = {
  orange: "from-orange-50 to-white text-primary ring-orange-100",
  amber: "from-amber-50 to-white text-amber-600 ring-amber-100",
  green: "from-emerald-50 to-white text-emerald-600 ring-emerald-100",
  slate: "from-slate-50 to-white text-slate-600 ring-slate-100",
};

const ScheduleStatCard = ({
  icon: Icon,
  label,
  value,
  detail,
  tone = "orange",
}: ScheduleStatCardProps) => (
  <div className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-gray-200/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-100/60">
    <div className="flex items-start justify-between gap-3">
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ring-1",
          TONE_CLASSES[tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="font-display text-3xl font-bold leading-none text-gray-900 tabular-nums">
        {value}
      </span>
    </div>
    <p className="mt-4 text-sm font-semibold text-gray-900">{label}</p>
    <p className="mt-1 text-xs leading-relaxed text-gray-500">{detail}</p>
  </div>
);

export default ScheduleStatCard;
