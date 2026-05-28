import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  icon: Icon,
  iconBg = "bg-gray-100",
  iconColor = "text-gray-400",
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
    <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center mb-5", iconBg)}>
      <Icon className={cn("h-9 w-9", iconColor)} />
    </div>
    <h3 className="font-display font-semibold text-gray-900 text-lg mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">{description}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export { EmptyState };
