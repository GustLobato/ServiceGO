import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge, type RequestStatus as BadgeStatus } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  type LucideIcon,
  MapPin,
  MessageCircle,
  Phone,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  WalletCards,
} from "lucide-react";
import type { RequestStatus, ServiceRequest } from "@/data/mockData";

interface RequestDetailsViewProps {
  request: ServiceRequest;
  userRole?: "cliente" | "prestador" | "admin";
  onBack: () => void;
  onUpdateStatus?: (id: string, status: string) => void;
}

const TIMELINE_STEPS = [
  { label: "Solicitação enviada", icon: FileText },
  { label: "Profissional aceitou", icon: BadgeCheck },
  { label: "Agendado", icon: CalendarCheck },
  { label: "Serviço concluído", icon: CheckCircle2 },
];

const STATUS_PROGRESS: Record<RequestStatus, number> = {
  pendente: 0,
  aceita: 1,
  em_andamento: 2,
  concluida: 3,
  cancelada: 0,
};

function requestCode(id: string) {
  return `SG-${id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase() || "000000"}`;
}

function formatMoney(value?: number) {
  if (typeof value !== "number") return "A combinar";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDateTime(value?: string) {
  if (!value) return "A definir";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function detailStatus(request: ServiceRequest): BadgeStatus {
  if (request.status === "aceita" && request.scheduledAt) return "agendado";
  return request.status as BadgeStatus;
}

function progressIndex(request: ServiceRequest) {
  if (request.status === "aceita" && request.scheduledAt) return 2;
  return STATUS_PROGRESS[request.status] ?? 0;
}

function buildHistory(request: ServiceRequest) {
  const progress = progressIndex(request);
  const items = [
    {
      title: "Solicitação enviada",
      description: "Seu pedido foi registrado e enviado ao profissional.",
      date: request.date,
      tone: "orange",
    },
  ];

  if (progress >= 1) {
    items.push({
      title: "Profissional aceitou",
      description: `${request.provider} confirmou disponibilidade para o serviço.`,
      date: request.updatedAt ? formatDateTime(request.updatedAt) : request.date,
      tone: "blue",
    });
  }

  if (progress >= 2) {
    items.push({
      title: "Serviço agendado",
      description: "O atendimento já tem previsão definida na agenda.",
      date: formatDateTime(request.scheduledAt),
      tone: "orange",
    });
  }

  if (request.status === "em_andamento") {
    items.push({
      title: "Serviço em andamento",
      description: "O profissional está acompanhando a execução do atendimento.",
      date: request.updatedAt ? formatDateTime(request.updatedAt) : "Agora",
      tone: "blue",
    });
  }

  if (request.status === "concluida") {
    items.push({
      title: "Serviço concluído",
      description: "Atendimento finalizado. Você já pode revisar a experiência.",
      date: request.updatedAt ? formatDateTime(request.updatedAt) : request.date,
      tone: "green",
    });
  }

  if (request.status === "cancelada") {
    items.push({
      title: "Solicitação cancelada",
      description: "Essa solicitação foi encerrada e não seguirá para atendimento.",
      date: request.updatedAt ? formatDateTime(request.updatedAt) : request.date,
      tone: "red",
    });
  }

  return items;
}

const toneClasses: Record<string, string> = {
  orange: "bg-orange-50 text-primary ring-orange-100",
  blue: "bg-sky-50 text-sky-600 ring-sky-100",
  green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  red: "bg-red-50 text-red-500 ring-red-100",
};

const RequestDetailsView = ({
  request,
  userRole,
  onBack,
  onUpdateStatus,
}: RequestDetailsViewProps) => {
  const { toast } = useToast();
  const code = requestCode(request.id);
  const displayStatus = detailStatus(request);
  const progress = progressIndex(request);
  const serviceValue = request.price;
  const feeValue = typeof serviceValue === "number" ? 0 : undefined;
  const totalValue = typeof serviceValue === "number" ? serviceValue + (feeValue ?? 0) : undefined;
  const canCancel = userRole === "cliente" && request.status === "pendente" && onUpdateStatus;
  const history = buildHistory(request);
  const rating = request.providerRating ?? 4.9;
  const reviews = request.providerReviewCount ?? 24;

  const handleContact = () => {
    toast({
      title: "Contato pelo ServiceGO",
      description: "O chat com o profissional será disponibilizado em breve.",
    });
  };

  return (
    <div className="relative overflow-hidden pb-8">
      <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-orange-100/70 blur-3xl" />
      <div className="pointer-events-none absolute left-10 top-64 h-48 w-48 rounded-full bg-amber-100/60 blur-3xl" />

      <div className="relative space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-0.5 hover:text-primary hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <section className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-5 shadow-[0_24px_80px_-48px_rgba(249,115,22,0.75)] sm:p-7">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-orange-50 via-orange-50/60 to-transparent" />
          <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-2xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="sg-accent-line mb-3">Acompanhamento do serviço</div>
              <h1 className="font-display text-3xl font-bold text-gray-950 sm:text-4xl">
                Detalhes da solicitação
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
                Veja o andamento, informações do profissional, observações e valores do atendimento em um só lugar.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <StatusBadge status={displayStatus} className="px-3.5 py-2" />
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3.5 py-2 text-xs font-bold text-gray-600 ring-1 ring-gray-100">
                  <ReceiptText className="h-4 w-4 text-primary" />
                  Código {code}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white/85 p-4 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Resumo</p>
              <p className="mt-2 font-display text-2xl font-bold text-gray-950">{request.service}</p>
              <p className="mt-1 text-sm font-medium text-primary">{request.category || "Serviço"}</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main className="space-y-6">
            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm shadow-gray-200/70 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Resumo do serviço</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-gray-950">{request.service}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
                    {request.description || "Nenhuma observação adicional foi enviada para esta solicitação."}
                  </p>
                </div>
                <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-primary ring-1 ring-orange-100">
                  {request.category || "Categoria"}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm shadow-gray-200/70 sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Progresso</p>
                  <h2 className="mt-1 font-display text-xl font-bold text-gray-950">Linha do tempo do atendimento</h2>
                </div>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                {TIMELINE_STEPS.map((step, index) => {
                  const StepIcon = step.icon;
                  const complete = request.status !== "cancelada" && index <= progress;
                  const current = request.status !== "cancelada" && index === progress && request.status !== "concluida";

                  return (
                    <div key={step.label} className="relative">
                      {index < TIMELINE_STEPS.length - 1 && (
                        <div className="absolute left-6 top-6 hidden h-0.5 w-[calc(100%+1rem)] bg-gray-100 md:block">
                          <div
                            className={cn("h-full rounded-full transition-all", complete ? "bg-primary" : "bg-transparent")}
                          />
                        </div>
                      )}
                      <div className="relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div
                          className={cn(
                            "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ring-1",
                            complete ? "bg-orange-50 text-primary ring-orange-100" : "bg-gray-50 text-gray-300 ring-gray-100",
                            current && "shadow-md shadow-orange-100",
                          )}
                        >
                          <StepIcon className="h-5 w-5" />
                        </div>
                        <p className={cn("text-sm font-bold", complete ? "text-gray-950" : "text-gray-400")}>
                          {step.label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-gray-400">
                          {complete ? "Etapa registrada" : "Aguardando próxima atualização"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={CalendarCheck}
                title="Data"
                value={request.scheduledAt ? formatDateTime(request.scheduledAt) : request.date}
                description={request.scheduledAt ? "Horário previsto do atendimento" : "Criada em"}
                tone="orange"
              />
              <InfoCard
                icon={MapPin}
                title="Endereço"
                value={request.address || "Endereço a confirmar"}
                description="Local de execução do serviço"
                tone="blue"
              />
              <InfoCard
                icon={FileText}
                title="Observações"
                value={request.description || "Sem observações"}
                description="Mensagem enviada na solicitação"
                tone="slate"
              />
              <InfoCard
                icon={WalletCards}
                title="Valores"
                value={formatMoney(totalValue)}
                description="Total estimado do atendimento"
                tone="green"
              />
            </section>

            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm shadow-gray-200/70 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Atualizações</p>
                  <h2 className="mt-1 font-display text-xl font-bold text-gray-950">Histórico de atualizações</h2>
                </div>
                <Clock3 className="h-5 w-5 text-primary" />
              </div>

              <div className="space-y-4">
                {history.map((item) => (
                  <div key={`${item.title}-${item.date}`} className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                    <div
                      className={cn(
                        "mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ring-1",
                        toneClasses[item.tone],
                      )}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-950">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.description}</p>
                      <p className="mt-2 text-xs font-semibold text-gray-400">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm shadow-gray-200/70 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary ring-1 ring-orange-100">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Resumo de valores</p>
                  <h2 className="font-display text-xl font-bold text-gray-950">Pagamento seguro</h2>
                </div>
              </div>

              <div className="space-y-3">
                <ValueRow label="Serviço" value={formatMoney(serviceValue)} />
                <ValueRow label="Taxa" value={formatMoney(feeValue)} />
                <div className="border-t border-gray-100 pt-3">
                  <ValueRow label="Total" value={formatMoney(totalValue)} strong />
                </div>
              </div>

              <div className="mt-5 flex gap-3 rounded-2xl bg-orange-50 p-4 text-sm text-orange-700 ring-1 ring-orange-100">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <p className="leading-relaxed">
                  Pagamento seguro pelo ServiceGO. O valor final pode ser confirmado pelo profissional antes da conclusão.
                </p>
              </div>
            </section>
          </main>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_18px_60px_-42px_rgba(15,23,42,0.45)]">
              <div className="relative bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 text-center">
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
                <Avatar className="mx-auto h-24 w-24 ring-8 ring-white shadow-xl shadow-orange-100">
                  <AvatarImage src={request.providerAvatarUrl} alt={request.provider} />
                  <AvatarFallback className="bg-primary text-2xl font-bold text-white">
                    {request.providerInitials}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 font-display text-2xl font-bold text-gray-950">{request.provider}</h2>
                <p className="mt-1 text-sm font-semibold text-primary">{request.category || "Profissional ServiceGO"}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-gray-800 shadow-sm ring-1 ring-orange-100">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {rating.toFixed(1)} <span className="text-xs font-medium text-gray-400">({reviews})</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-y border-gray-100 p-4">
                <Metric label="Serviços" value={`${Math.max(reviews, 12)}+`} />
                <Metric label="Resposta" value="1h" />
                <Metric label="Perfil" value="OK" />
              </div>

              <div className="space-y-2 p-4">
                <Button className="w-full justify-center" onClick={handleContact}>
                  <MessageCircle className="h-4 w-4" />
                  Falar com profissional
                </Button>

                {request.providerPhone && (
                  <Button variant="outline" className="w-full justify-center border-orange-100 text-primary hover:bg-orange-50" asChild>
                    <a href={`tel:${request.providerPhone}`}>
                      <Phone className="h-4 w-4" />
                      Ligar para profissional
                    </a>
                  </Button>
                )}

                {canCancel && (
                  <Button
                    variant="outline"
                    className="w-full justify-center border-red-200 text-red-500 shadow-none hover:bg-red-50"
                    onClick={() => onUpdateStatus(request.id, "cancelled")}
                  >
                    <Ban className="h-4 w-4" />
                    Cancelar solicitação
                  </Button>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-orange-100 bg-orange-50/70 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-950">Profissional responsável</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    Todas as atualizações deste atendimento ficam registradas no histórico da solicitação.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  tone: "orange" | "blue" | "green" | "slate";
}

const infoTone: Record<InfoCardProps["tone"], string> = {
  orange: "bg-orange-50 text-primary ring-orange-100",
  blue: "bg-sky-50 text-sky-600 ring-sky-100",
  green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  slate: "bg-slate-50 text-slate-600 ring-slate-100",
};

const InfoCard = ({ icon: Icon, title, value, description, tone }: InfoCardProps) => (
  <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm shadow-gray-200/60">
    <div className={cn("mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ring-1", infoTone[tone])}>
      <Icon className="h-5 w-5" />
    </div>
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</p>
    <p className="mt-2 text-base font-bold leading-snug text-gray-950">{value}</p>
    <p className="mt-1 text-sm leading-relaxed text-gray-500">{description}</p>
  </div>
);

const ValueRow = ({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) => (
  <div className="flex items-center justify-between gap-4">
    <span className={cn("text-sm", strong ? "font-bold text-gray-950" : "font-medium text-gray-500")}>{label}</span>
    <span className={cn("text-sm", strong ? "font-display text-xl font-bold text-gray-950" : "font-semibold text-gray-700")}>
      {value}
    </span>
  </div>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl bg-gray-50 px-2 py-3 text-center">
    <p className="font-display text-lg font-bold text-gray-950">{value}</p>
    <p className="mt-0.5 text-[11px] font-medium text-gray-400">{label}</p>
  </div>
);

export default RequestDetailsView;
