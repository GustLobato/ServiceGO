import { type LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  value: number | string;
  label: string;
  description?: string;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
  onClick?: () => void;
  className?: string;
}

const DashboardCard = ({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  description,
  badge,
  badgeBg = "bg-gray-100",
  badgeColor = "text-gray-500",
  onClick,
  className,
}: DashboardCardProps) => (
  <div
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onClick={onClick}
    onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    className={cn(
      "bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-200",
      onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 group" : "",
      className,
    )}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconBg)}>
        <Icon className={cn("h-6 w-6", iconColor)} />
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", badgeBg, badgeColor)}>
            {badge}
          </span>
        )}
        {onClick && (
          <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
        )}
      </div>
    </div>
    <div className="font-display text-4xl font-bold text-gray-900 leading-none mb-1.5">
      {value}
    </div>
    <div className="font-semibold text-gray-700 text-sm">{label}</div>
    {description && (
      <div className="text-xs text-gray-400 mt-1 leading-snug">{description}</div>
    )}
  </div>
);

export { DashboardCard };
