import { Search, Shield, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { LogoIcon } from "@/components/Logo";

interface AuthPanelProps {
  title: string;
  subtitle: string;
  isLogin?: boolean;
}

const features = [
  { icon: Search,    color: "bg-amber-100 text-amber-600",  title: "Encontre profissionais verificados", desc: "Avaliações reais para você escolher com segurança." },
  { icon: Shield,    color: "bg-green-100 text-green-600",  title: "Serviços para tudo que você precisa", desc: "De pequenos reparos a grandes projetos." },
  { icon: UserCheck, color: "bg-blue-100 text-blue-600",    title: "Seja um profissional de destaque", desc: "Divulgue seu trabalho e conquiste mais clientes." },
];

const AuthPanel = ({ title, subtitle, isLogin = false }: AuthPanelProps) => (
  <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white items-center justify-center p-12">
    {/* Orange blobs */}
    <div className="absolute top-0 right-0 w-80 h-80 bg-orange-100/70 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

    <div className="relative z-10 max-w-md w-full">
      {/* Logo icon illustration */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <LogoIcon size={80} />
          {/* Feature mini-cards floating */}
          <div className="absolute -right-28 top-0 bg-white rounded-xl shadow-lg border border-gray-100 px-3 py-2 flex items-center gap-2 min-w-max">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <UserCheck className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-800 leading-tight">Verificado</p>
              <p className="text-[9px] text-gray-400">Perfil confirmado</p>
            </div>
          </div>
          <div className="absolute -right-28 top-12 bg-white rounded-xl shadow-lg border border-gray-100 px-3 py-2 flex items-center gap-2 min-w-max">
            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Shield className="h-3.5 w-3.5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-800 leading-tight">Seguro</p>
              <p className="text-[9px] text-gray-400">Pagamento protegido</p>
            </div>
          </div>
          <div className="absolute -right-28 top-24 bg-white rounded-xl shadow-lg border border-gray-100 px-3 py-2 flex items-center gap-2 min-w-max">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Search className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-800 leading-tight">Avaliado</p>
              <p className="text-[9px] text-gray-400">4.9 estrelas</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="font-display text-3xl font-bold text-gray-900 leading-tight">{title}</h2>
      <p className="text-gray-500 mt-3 leading-relaxed">{subtitle}</p>

      <div className="mt-8 space-y-5">
        {features.map((f) => (
          <div key={f.title} className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center flex-shrink-0`}>
              <f.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">{f.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-gray-500">
        {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
        <Link to={isLogin ? "/cadastro" : "/login"} className="text-primary font-semibold hover:underline">
          {isLogin ? "Cadastre-se agora →" : "Entrar agora →"}
        </Link>
      </p>
    </div>
  </div>
);

export default AuthPanel;
