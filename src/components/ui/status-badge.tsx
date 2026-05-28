import { cn } from "@/lib/utils";

export type RequestStatus =
  | "pendente"
  | "aceita"
  | "agendado"
  | "em_andamento"
  | "concluida"
  | "cancelada";

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; dot: string; text: string; bg: string }
> = {
  pendente:     { label: "Aguardando",   dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
  aceita:       { label: "Aceito",       dot: "bg-sky-400",   text: "text-sky-700",   bg: "bg-sky-50" },
  agendado:     { label: "Agendado",     dot: "bg-primary",   text: "text-orange-700", bg: "bg-orange-50" },
  em_andamento: { label: "Em andamento", dot: "bg-blue-500",  text: "text-blue-800",  bg: "bg-blue-50" },
  concluida:    { label: "Concluído",    dot: "bg-green-500", text: "text-green-700", bg: "bg-green-50" },
  cancelada:    { label: "Cancelado",    dot: "bg-red-400",   text: "text-red-700",   bg: "bg-red-50" },
};

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pendente;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
        cfg.bg,
        cfg.text,
        className,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cfg.dot)} />
      {cfg.label}
    </span>
  );
};

export { StatusBadge, STATUS_CONFIG };
