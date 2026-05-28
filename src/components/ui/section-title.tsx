import { cn } from "@/lib/utils";

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionTitle = ({
  badge,
  title,
  subtitle,
  centered = false,
  className,
}: SectionTitleProps) => (
  <div className={cn(centered ? "text-center" : "", className)}>
    {badge && (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-primary text-sm font-semibold mb-3",
          centered ? "justify-center" : "",
        )}
      >
        <span className="w-4 h-0.5 bg-primary rounded" />
        {badge}
        {centered && <span className="w-4 h-0.5 bg-primary rounded" />}
      </span>
    )}
    <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p
        className={cn(
          "text-gray-500 mt-3 text-base leading-relaxed",
          centered ? "max-w-xl mx-auto" : "max-w-xl",
        )}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export { SectionTitle };
