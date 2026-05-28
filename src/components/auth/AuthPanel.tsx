import { Star, Wrench, Zap } from "lucide-react";
import { type ComponentType } from "react";
import { type LucideProps } from "lucide-react";
import { Link } from "react-router-dom";
import { LogoIcon } from "@/components/Logo";

interface AuthPanelProps {
  title: string;
  subtitle: string;
  isLogin?: boolean;
}

interface Benefit {
  icon: ComponentType<LucideProps>;
  title: string;
  desc: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: Star,
    title: "Profissionais avaliados",
    desc: "Avaliações reais de clientes verificados",
  },
  {
    icon: Wrench,
    title: "Serviços para tudo",
    desc: "De pequenos reparos a grandes projetos",
  },
  {
    icon: Zap,
    title: "Rápido e prático",
    desc: "Contrate o profissional ideal em minutos",
  },
];

const STATS = [
  { value: "+5k",  label: "Profissionais" },
  { value: "+12k", label: "Clientes" },
  { value: "4.9★", label: "Média geral" },
];

const AuthPanel = ({ title, subtitle, isLogin = false }: AuthPanelProps) => (
  <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-orange-500 to-amber-400 items-center justify-center p-12">

    {/* Radial light overlays */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.18),transparent_55%)] pointer-events-none" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.12),transparent_50%)] pointer-events-none" />

    {/* Dot grid */}
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.06]"
      style={{
        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />

    {/* Decorative rings */}
    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/10 pointer-events-none" />
    <div className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
    <div className="absolute top-10 right-36 w-36 h-36 rounded-full border border-white/10 pointer-events-none" />

    <div className="relative z-10 max-w-md w-full">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0">
          <LogoIcon size={28} />
        </div>
        <span className="font-display font-bold text-white text-xl tracking-tight">ServiceGO</span>
      </div>

      {/* Headline */}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
        {title}
      </h2>
      <p className="text-white/75 mt-3 leading-relaxed text-[15px]">{subtitle}</p>

      {/* Benefit cards */}
      <div className="mt-8 space-y-3">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 px-4 py-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center flex-shrink-0">
              <b.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm text-white leading-tight">{b.title}</p>
              <p className="text-xs text-white/65 mt-0.5">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-8 flex items-center gap-8 pt-6 border-t border-white/20">
        {STATS.map((s) => (
          <div key={s.label}>
            <p className="font-bold text-white text-xl leading-none">{s.value}</p>
            <p className="text-white/55 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Switch link */}
      <p className="mt-8 text-sm text-white/70">
        {isLogin ? "Ainda não tem conta? " : "Já tem uma conta? "}
        <Link
          to={isLogin ? "/cadastro" : "/login"}
          className="text-white font-semibold hover:underline"
        >
          {isLogin ? "Cadastre-se agora →" : "Entrar agora →"}
        </Link>
      </p>
    </div>
  </div>
);

export default AuthPanel;
