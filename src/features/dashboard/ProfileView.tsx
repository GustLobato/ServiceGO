import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Pencil, Save, X, Mail, Phone, User, Briefcase, Shield,
  Calendar, Star, MapPin, BadgeCheck, Heart, Share2,
  Clock, Award, CheckCircle2, TrendingUp,
  Package, ChevronRight, Image as ImageIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth, type AuthUser } from "@/contexts/AuthContext";

// ── Types ──────────────────────────────────────────────────────
interface ProfileViewProps {
  user: AuthUser;
  userName: string;
  userInitials: string;
}

type Tab = "sobre" | "servicos" | "portfolio" | "avaliacoes";

// ── Role config ────────────────────────────────────────────────
const ROLE_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  cliente:   { label: "Cliente",       color: "text-blue-700",  bg: "bg-blue-50 border-blue-200" },
  prestador: { label: "Profissional",  color: "text-green-700", bg: "bg-green-50 border-green-200" },
  admin:     { label: "Administrador", color: "text-primary",   bg: "bg-orange-50 border-orange-200" },
};

// ── Mock data (provider sections) ─────────────────────────────
const MOCK_HIGHLIGHTS = [
  { icon: Award,        label: "8 anos de experiência", desc: "Profissional experiente",   bg: "bg-amber-50",  color: "text-amber-600" },
  { icon: Clock,        label: "Resposta em < 2h",      desc: "Atendimento rápido",        bg: "bg-blue-50",   color: "text-blue-600" },
  { icon: Shield,       label: "Garantia incluída",     desc: "30 dias nos serviços",      bg: "bg-green-50",  color: "text-green-700" },
  { icon: BadgeCheck,   label: "Conta verificada",      desc: "Perfil autenticado",        bg: "bg-orange-50", color: "text-primary" },
];

const MOCK_SERVICES = [
  {
    tier: "Básico",
    price: 150,
    desc: "Consulta e avaliação do problema",
    features: ["Diagnóstico inicial", "Orçamento detalhado", "Prazo estimado"],
    highlighted: false,
    badge: null,
  },
  {
    tier: "Completo",
    price: 350,
    desc: "Serviço completo com materiais",
    features: ["Tudo do Básico", "Materiais inclusos", "Garantia de 30 dias", "2 revisões"],
    highlighted: true,
    badge: "Mais popular",
  },
  {
    tier: "Premium",
    price: 650,
    desc: "Atendimento prioritário e garantia estendida",
    features: ["Tudo do Completo", "Prioridade 24h", "Garantia de 90 dias", "Suporte ilimitado"],
    highlighted: false,
    badge: null,
  },
];

const MOCK_PORTFOLIO = [
  { title: "Instalação elétrica residencial", gradient: "from-amber-400 to-orange-500", date: "Jan 2025" },
  { title: "Reparo de fiação interna",         gradient: "from-blue-400 to-blue-600",   date: "Dez 2024" },
  { title: "Quadro de distribuição",           gradient: "from-purple-400 to-purple-600", date: "Nov 2024" },
  { title: "Iluminação LED externa",           gradient: "from-emerald-400 to-teal-600", date: "Out 2024" },
  { title: "Tomadas e interruptores",          gradient: "from-rose-400 to-rose-600",   date: "Set 2024" },
  { title: "Sistema de câmeras CFTV",          gradient: "from-sky-400 to-sky-600",     date: "Ago 2024" },
];

const MOCK_REVIEWS = [
  { name: "Maria Santos",  initials: "MS", gradient: "from-pink-400 to-rose-500",      rating: 5, date: "Há 2 semanas", text: "Excelente profissional! Pontual, cuidadoso e resolveu tudo com rapidez. Super recomendo!" },
  { name: "João Pereira",  initials: "JP", gradient: "from-blue-400 to-indigo-500",    rating: 5, date: "Há 1 mês",    text: "Serviço de qualidade e preço justo. Trabalho feito com esmero, voltarei com certeza." },
  { name: "Ana Lima",      initials: "AL", gradient: "from-emerald-400 to-teal-500",   rating: 4, date: "Há 2 meses",  text: "Muito bom profissional, trabalho feito com cuidado. Pequeno atraso, mas resolveu bem." },
  { name: "Carlos Ramos",  initials: "CR", gradient: "from-violet-400 to-purple-500",  rating: 5, date: "Há 3 meses",  text: "Incrível! Já usei o serviço duas vezes e sempre fiquei muito satisfeito com o resultado." },
];

// ── Helper ─────────────────────────────────────────────────────
function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${cls} ${s <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
const ProfileView = ({ user, userName, userInitials }: ProfileViewProps) => {
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  const [editing, setEditing]     = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("sobre");
  const [form, setForm]           = useState({ name: user.name, phone: user.phone ?? "", bio: user.bio ?? "" });

  const mutation = useMutation({
    mutationFn: (data: typeof form) => api.patch("/api/users/me", data),
    onSuccess: () => { toast({ title: "Perfil atualizado!" }); refreshUser(); setEditing(false); },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const isProvider  = user.role === "prestador";
  const roleInfo    = ROLE_LABEL[user.role] ?? ROLE_LABEL.cliente;
  const joinDate    = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const TABS: { id: Tab; label: string }[] = [
    { id: "sobre",      label: "Sobre" },
    { id: "servicos",   label: "Serviços" },
    { id: "portfolio",  label: "Portfólio" },
    { id: "avaliacoes", label: "Avaliações" },
  ];

  const heroStats = isProvider ? [
    { icon: Star, value: "4.9", label: "Avaliação" },
    { icon: CheckCircle2, value: "128", label: "Serviços" },
    { icon: TrendingUp, value: "98%", label: "Satisfação" },
  ] : [
    { icon: Star, value: "—", label: "Avaliação" },
    { icon: Shield, value: "Sim", label: "Verificado" },
    { icon: Calendar, value: joinDate, label: "Membro desde" },
  ];

  const soon = () => toast({ title: "Em breve", description: "Funcionalidade disponível em breve." });

  // ── Hero card ───────────────────────────────────────────────
  const HeroCard = (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Cover */}
      <div className="h-36 bg-gradient-to-br from-primary via-orange-500 to-amber-400 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "20px 20px" }}
        />
      </div>

      {/* Body */}
      <div className="px-4 pb-5 sm:px-6 sm:pb-6">
        {/* Avatar row */}
        <div className="flex flex-col gap-4 -mt-12 mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-orange-600 border-4 border-white shadow-xl flex items-center justify-center">
              <span className="font-display font-bold text-white text-2xl tracking-tight">{userInitials}</span>
            </div>
            {isProvider && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </div>

          {/* Action buttons */}
          {!editing ? (
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
              {isProvider && (
                <button onClick={soon} className="w-9 h-9 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-colors">
                  <Heart className="h-4 w-4 text-gray-500" />
                </button>
              )}
              <button onClick={soon} className="w-9 h-9 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-colors">
                <Share2 className="h-4 w-4 text-gray-500" />
              </button>
              <Button size="sm" variant="outline" className="flex-1 gap-1.5 rounded-xl border-gray-200 hover:border-primary hover:text-primary sm:flex-none" onClick={() => setEditing(true)}>
                <Pencil className="h-3.5 w-3.5" /> Editar perfil
              </Button>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone ?? "", bio: user.bio ?? "" }); }}>
                <X className="h-3.5 w-3.5" /> Cancelar
              </Button>
              <Button size="sm" className="gap-1.5 rounded-xl" disabled={mutation.isPending} onClick={() => mutation.mutate(form)}>
                <Save className="h-3.5 w-3.5" />
                {mutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}
        </div>

        {/* Name + badges */}
        <h2 className="font-display text-2xl font-bold text-gray-900 leading-tight break-words">{userName}</h2>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleInfo.bg} ${roleInfo.color}`}>
            {user.role === "prestador" ? <Briefcase className="h-3 w-3" /> : <User className="h-3 w-3" />}
            {roleInfo.label}
          </span>
          {isProvider && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
              <BadgeCheck className="h-3 w-3" /> Verificado
            </span>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <Mail className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" /> <span className="break-all">{user.email}</span>
          </span>
          {isProvider && (
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5 text-gray-400" /> São Paulo, SP
            </span>
          )}
        </div>

        {/* Provider star rating */}
        {isProvider && (
          <div className="flex items-center gap-2 mt-3">
            <StarRow rating={5} size="md" />
            <span className="font-bold text-gray-900 text-sm">4.9</span>
            <span className="text-sm text-gray-400">(47 avaliações)</span>
          </div>
        )}

        {/* Stats divider */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
          {heroStats.map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="font-display font-bold text-gray-900 text-sm leading-tight">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Edit form (shared between client + provider "Sobre" tab) ─
  const EditFormCard = (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-display font-semibold text-gray-900 mb-5 flex items-center gap-2 text-sm">
        <User className="h-4 w-4 text-primary" /> Informações pessoais
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="p-name" className="text-xs font-medium text-gray-600">Nome completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input id="p-name" value={editing ? form.name : userName} readOnly={!editing}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={`pl-9 h-10 rounded-xl border-gray-200 text-sm ${editing ? "focus:border-primary" : "bg-gray-50 text-gray-600"}`} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-phone" className="text-xs font-medium text-gray-600">Telefone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input id="p-phone" value={editing ? form.phone : (user.phone ?? "")} readOnly={!editing}
                placeholder={editing ? "(00) 00000-0000" : "Não informado"}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className={`pl-9 h-10 rounded-xl border-gray-200 text-sm ${editing ? "focus:border-primary" : "bg-gray-50 text-gray-600"}`} />
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-email" className="text-xs font-medium text-gray-600">E-mail <span className="text-gray-400 font-normal">(não editável)</span></Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input id="p-email" value={user.email} readOnly className="pl-9 h-10 rounded-xl border-gray-200 bg-gray-50 text-gray-500 text-sm" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-bio" className="text-xs font-medium text-gray-600">
            {isProvider ? "Sobre você / Serviços oferecidos" : "Bio"}
          </Label>
          <Textarea id="p-bio" value={editing ? form.bio : (user.bio ?? "")} readOnly={!editing} rows={4}
            placeholder={editing ? (isProvider ? "Fale sobre sua experiência e os serviços que você oferece..." : "Fale um pouco sobre você...") : "Nenhuma bio cadastrada"}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            className={`rounded-xl border-gray-200 resize-none text-sm ${editing ? "focus:border-primary" : "bg-gray-50 text-gray-600"}`} />
        </div>
        {editing && (
          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end">
            <Button variant="outline" className="rounded-xl text-sm" onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone ?? "", bio: user.bio ?? "" }); }}>Cancelar</Button>
            <Button className="rounded-xl text-sm gap-2" disabled={mutation.isPending} onClick={() => mutation.mutate(form)}>
              <Save className="h-4 w-4" />{mutation.isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // ── Security card ───────────────────────────────────────────
  const SecurityCard = (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
        <Shield className="h-4 w-4 text-primary" /> Segurança
      </h3>
      {[
        { title: "Senha",                     sub: "Altere sua senha regularmente para manter a conta segura" },
        { title: "Verificação em dois fatores", sub: "Adicione uma camada extra de proteção" },
      ].map((item, i) => (
        <div key={item.title} className={`flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between ${i < 1 ? "border-b border-gray-50" : ""}`}>
          <div>
            <p className="text-sm font-medium text-gray-900">{item.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
          </div>
          <Button variant="outline" size="sm" className="w-full rounded-xl text-xs shrink-0 sm:w-auto" disabled>Em breve</Button>
        </div>
      ))}
    </div>
  );

  // ── Provider sidebar ────────────────────────────────────────
  const ProviderSidebar = (
    <div className="space-y-4">
      {/* Availability */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h4 className="font-display font-semibold text-gray-900 text-sm mb-4">Status</h4>
        <div className="space-y-3">
          {[
            { icon: CheckCircle2, label: "Disponibilidade", value: "Disponível agora", valueColor: "text-green-600" },
            { icon: Clock,        label: "Tempo de resposta", value: "< 2 horas",       valueColor: "text-gray-900" },
            { icon: BadgeCheck,   label: "Verificação",       value: "Conta verificada", valueColor: "text-primary" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <item.icon className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
              <span className={`text-xs font-semibold ${item.valueColor}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h4 className="font-display font-semibold text-gray-900 text-sm mb-4">Estatísticas</h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
          {[
            { label: "Avaliações",  value: "47",  sub: "recebidas",    bg: "bg-amber-50",  color: "text-amber-700" },
            { label: "Nota média",  value: "4.9", sub: "de 5.0",       bg: "bg-green-50",  color: "text-green-700" },
            { label: "Satisfação",  value: "98%", sub: "de satisfação", bg: "bg-blue-50",   color: "text-blue-700" },
            { label: "Concluídos",  value: "128", sub: "serviços",     bg: "bg-purple-50", color: "text-purple-700" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
              <p className={`font-display font-bold text-lg leading-none ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-primary to-orange-600 rounded-2xl p-5 text-white">
        <h4 className="font-display font-bold text-base mb-1">Solicitar orçamento</h4>
        <p className="text-white/75 text-xs leading-relaxed mb-4">
          Entre em contato e receba uma proposta personalizada para o seu projeto.
        </p>
        <Button
          className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl shadow-none text-sm"
          onClick={soon}
        >
          Solicitar agora
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  // ── Tab content ─────────────────────────────────────────────

  // Sobre
  const SobreTab = (
    <div className="space-y-5">
      {/* Bio card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-display font-semibold text-gray-900 mb-3 text-sm">Sobre o profissional</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {user.bio || "Profissional dedicado e experiente, comprometido com a qualidade do serviço e a satisfação dos clientes. Atende com pontualidade, transparência e atenção aos detalhes em cada projeto."}
        </p>
      </div>

      {/* Highlights grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MOCK_HIGHLIGHTS.map((h) => (
          <div key={h.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl ${h.bg} flex items-center justify-center flex-shrink-0`}>
              <h.icon className={`h-4 w-4 ${h.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{h.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{h.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile sidebar stats */}
      <div className="lg:hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h4 className="font-display font-semibold text-gray-900 text-sm mb-3">Estatísticas</h4>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Avaliações", value: "47",  color: "text-amber-600" },
            { label: "Nota",       value: "4.9", color: "text-green-700" },
            { label: "Satisfação", value: "98%", color: "text-blue-700" },
            { label: "Serviços",   value: "128", color: "text-purple-700" },
          ].map((s) => (
            <div key={s.label} className="text-center bg-gray-50 rounded-xl p-2.5">
              <p className={`font-display font-bold text-base ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4 rounded-xl text-sm" onClick={soon}>Solicitar orçamento</Button>
      </div>

      {/* Edit form */}
      {EditFormCard}
    </div>
  );

  // Serviços
  const ServicosTab = (
    <div className="grid sm:grid-cols-3 gap-4">
      {MOCK_SERVICES.map((svc) => (
        <div
          key={svc.tier}
          className={`relative bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
            svc.highlighted ? "border-primary shadow-md shadow-orange-100" : "border-gray-100"
          }`}
        >
          {svc.highlighted && (
            <div className="h-1 bg-gradient-to-r from-primary to-orange-400" />
          )}
          {svc.badge && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 rounded-full bg-orange-50 text-primary text-[10px] font-bold border border-orange-100">
                {svc.badge}
              </span>
            </div>
          )}
          <div className="p-5 flex flex-col flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${svc.highlighted ? "bg-orange-50" : "bg-gray-50"}`}>
              <Package className={`h-5 w-5 ${svc.highlighted ? "text-primary" : "text-gray-500"}`} />
            </div>
            <p className="font-display font-bold text-gray-900 text-base">{svc.tier}</p>
            <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">{svc.desc}</p>
            <ul className="space-y-2 flex-1">
              {svc.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle2 className={`h-3.5 w-3.5 flex-shrink-0 ${svc.highlighted ? "text-primary" : "text-green-600"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t border-gray-50">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mb-1">A partir de</p>
              <p className={`font-display font-bold text-xl leading-none ${svc.highlighted ? "text-primary" : "text-gray-900"}`}>
                R$ {svc.price.toLocaleString("pt-BR")},00
              </p>
              <Button className={`w-full mt-3 rounded-xl text-sm ${svc.highlighted ? "" : "bg-gray-900 hover:bg-gray-800"}`} onClick={soon}>
                Contratar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Portfólio
  const PortfolioTab = (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {MOCK_PORTFOLIO.map((item) => (
          <div
            key={item.title}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <p className="text-white font-semibold text-xs text-center leading-tight">{item.title}</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/50 to-transparent">
              <p className="text-white/70 text-[10px]">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 mt-5">
        Portfólio com fotos reais disponível em breve
      </p>
    </div>
  );

  // Avaliações
  const AvaliacoesTab = (
    <div className="space-y-4">
      {/* Aggregate */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="text-center">
          <p className="font-display font-bold text-5xl text-gray-900 leading-none">4.9</p>
          <StarRow rating={5} size="md" />
          <p className="text-xs text-gray-400 mt-1.5">47 avaliações</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const pct = star === 5 ? 85 : star === 4 ? 10 : star === 3 ? 3 : star === 2 ? 1 : 1;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4 text-right">{star}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-8">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review cards */}
      {MOCK_REVIEWS.map((r) => (
        <div key={r.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {r.initials}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm text-gray-900">{r.name}</p>
                  <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-xs text-gray-400">{r.date}</p>
              </div>
            </div>
            <StarRow rating={r.rating} />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">"{r.text}"</p>
        </div>
      ))}
    </div>
  );

  // ── Render ──────────────────────────────────────────────────
  return (
    <div>
      {HeroCard}

      {isProvider ? (
        /* Provider: tabs + sidebar */
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Tab bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 grid grid-cols-2 gap-1 mb-5 sm:grid-cols-4">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "sobre"      && SobreTab}
            {activeTab === "servicos"   && ServicosTab}
            {activeTab === "portfolio"  && PortfolioTab}
            {activeTab === "avaliacoes" && AvaliacoesTab}
          </div>

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-4">
            {ProviderSidebar}
          </aside>
        </div>
      ) : (
        /* Client: simple info + security */
        <div className="mt-6 max-w-2xl space-y-5">
          {EditFormCard}
          {SecurityCard}
        </div>
      )}
    </div>
  );
};

export default ProfileView;
