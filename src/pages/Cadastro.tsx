import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type ComponentType } from "react";
import { type LucideProps } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye, EyeOff, Loader2, User, Briefcase, Mail,
  Lock, Phone, Check, ArrowRight, X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import AuthPanel from "@/components/auth/AuthPanel";
import { LogoFull } from "@/components/Logo";
import { validateSignupForm, hasNoErrors, type ValidationErrors } from "@/lib/validation";

// ---------- Password strength ----------

const CRITERIA = [
  { label: "Mínimo 8 caracteres",   test: (p: string) => p.length >= 8 },
  { label: "Letra maiúscula",        test: (p: string) => /[A-Z]/.test(p) },
  { label: "Letra minúscula",        test: (p: string) => /[a-z]/.test(p) },
  { label: "Número",                 test: (p: string) => /[0-9]/.test(p) },
  { label: "Caractere especial",     test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const WEAK_PASSWORDS = [
  "senha123", "12345678", "password", "admin123",
  "qwerty123", "123456789", "password1", "iloveyou",
  "abc123456", "monkey123",
];

interface StrengthResult {
  bars: number;
  label: string;
  barColor: string;
  labelColor: string;
}

function getStrength(password: string): StrengthResult {
  if (!password) return { bars: 0, label: "", barColor: "", labelColor: "" };
  const isCommon = WEAK_PASSWORDS.includes(password.toLowerCase());
  const score = isCommon ? 1 : CRITERIA.filter((c) => c.test(password)).length;
  if (score <= 1) return { bars: 1, label: "Muito fraca", barColor: "bg-red-500",   labelColor: "text-red-600" };
  if (score === 2) return { bars: 2, label: "Fraca",      barColor: "bg-orange-400", labelColor: "text-orange-500" };
  if (score === 3) return { bars: 3, label: "Boa",        barColor: "bg-yellow-400", labelColor: "text-yellow-600" };
  return              { bars: 4, label: "Forte",      barColor: "bg-green-500",  labelColor: "text-green-600" };
}

function PasswordStrength({ password }: { password: string }) {
  const s = getStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2.5 space-y-2.5">
      {/* Strength bars */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                bar <= s.bars ? s.barColor : "bg-gray-100"
              }`}
            />
          ))}
        </div>
        <span className={`text-[11px] font-semibold min-w-[68px] text-right tabular-nums ${s.labelColor}`}>
          {s.label}
        </span>
      </div>

      {/* Criteria grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {CRITERIA.map((c) => {
          const met = c.test(password);
          return (
            <div key={c.label} className="flex items-center gap-1.5">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                met ? "bg-green-100" : "bg-gray-100"
              }`}>
                {met
                  ? <Check className="h-2.5 w-2.5 text-green-600" />
                  : <X className="h-2 w-2 text-gray-400" />
                }
              </div>
              <span className={`text-[11px] transition-colors duration-200 ${
                met ? "text-green-700 font-medium" : "text-gray-500"
              }`}>
                {c.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Role options ----------

interface RoleOption {
  value: UserRole;
  icon: ComponentType<LucideProps>;
  label: string;
  desc: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "cliente",
    icon: User,
    label: "Cliente",
    desc: "Quero contratar profissionais",
  },
  {
    value: "prestador",
    icon: Briefcase,
    label: "Profissional",
    desc: "Quero oferecer meus serviços",
  },
];

// ---------- Error message ----------

function FieldError({ message }: { message: string | undefined }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1">
      <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0 inline-block" />
      {message}
    </p>
  );
}

// ---------- Main component ----------

const Cadastro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState<UserRole>("cliente");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup, user } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  if (user) return null;

  const clearError = (field: keyof ValidationErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast({
        title: "Aceite os termos",
        description: "Você precisa aceitar os termos de uso para continuar.",
        variant: "destructive",
      });
      return;
    }

    const validationErrors = validateSignupForm(name, email, password, confirmPassword);
    setErrors(validationErrors);
    if (!hasNoErrors(validationErrors)) return;

    setLoading(true);
    try {
      await signup(name.trim(), email, password, role);
      toast({ title: "Conta criada!", description: "Redirecionando para o painel..." });
      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      toast({ title: "Erro no cadastro", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const panelSubtitle =
    role === "prestador"
      ? "Cadastre-se e comece a receber clientes qualificados hoje mesmo."
      : "Encontre profissionais de confiança perto de você, de forma simples e segura.";

  const passwordsMatch = confirmPassword.length > 0 && confirmPassword === password;

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <AuthPanel title="Junte-se ao ServiceGO" subtitle={panelSubtitle} />

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 relative overflow-hidden overflow-y-auto">
        {/* Subtle blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-50 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-lg relative z-10 py-8"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <LogoFull iconSize={30} textSize="text-xl" />
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/60 p-8">

            {/* Header */}
            <div className="mb-7">
              <h1 className="font-display text-2xl font-bold text-gray-900 leading-tight">
                Criar sua conta
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                Preencha os dados para começar gratuitamente
              </p>
            </div>

            <form onSubmit={handleSignup} noValidate className="space-y-5">

              {/* Nome */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nome completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={name}
                    autoComplete="name"
                    onChange={(e) => { setName(e.target.value); clearError("name"); }}
                    className={`pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary transition-colors ${
                      errors.name ? "border-red-400 bg-red-50/30 focus:border-red-400" : ""
                    }`}
                  />
                </div>
                <FieldError message={errors.name} />
              </div>

              {/* E-mail */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                    className={`pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary transition-colors ${
                      errors.email ? "border-red-400 bg-red-50/30 focus:border-red-400" : ""
                    }`}
                  />
                </div>
                <FieldError message={errors.email} />
              </div>

              {/* Telefone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Telefone
                  <span className="ml-1 text-gray-400 font-normal">(opcional)</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    autoComplete="tel"
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                    className={`pl-10 pr-11 h-11 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary transition-colors ${
                      errors.password ? "border-red-400 bg-red-50/30 focus:border-red-400" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Show error OR strength indicator */}
                {errors.password
                  ? <FieldError message={errors.password} />
                  : <PasswordStrength password={password} />
                }
              </div>

              {/* Confirmar senha */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="text-sm font-medium text-gray-700">
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repita sua senha"
                    value={confirmPassword}
                    autoComplete="new-password"
                    onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword"); }}
                    className={`pl-10 pr-11 h-11 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary transition-colors ${
                      errors.confirmPassword
                        ? "border-red-400 bg-red-50/30 focus:border-red-400"
                        : passwordsMatch
                        ? "border-green-400 bg-green-50/20 focus:border-green-400"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword ? (
                  <FieldError message={errors.confirmPassword} />
                ) : passwordsMatch ? (
                  <p className="text-xs text-green-600 flex items-center gap-1.5 mt-1">
                    <Check className="h-3 w-3" />
                    Senhas coincidem
                  </p>
                ) : null}
              </div>

              {/* Tipo de conta */}
              <div className="space-y-2.5">
                <Label className="text-sm font-medium text-gray-700">
                  Tipo de conta
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLE_OPTIONS.map((opt) => {
                    const active = role === opt.value;
                    const RoleIcon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRole(opt.value)}
                        className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-150 ${
                          active
                            ? "border-primary bg-orange-50/70 shadow-sm"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        {/* Active checkmark */}
                        {active && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}

                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                          active ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                        }`}>
                          <RoleIcon className="h-5 w-5" />
                        </div>

                        <p className={`font-semibold text-sm ${active ? "text-gray-900" : "text-gray-700"}`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                          {opt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Termos */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 accent-primary w-4 h-4 cursor-pointer flex-shrink-0"
                />
                <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                  Li e aceito os{" "}
                  <button
                    type="button"
                    className="text-primary underline font-medium hover:text-primary/80"
                    onClick={() =>
                      toast({ title: "Em breve", description: "Termos de uso disponíveis em breve." })
                    }
                  >
                    Termos de uso
                  </button>
                  {" "}e a{" "}
                  <button
                    type="button"
                    className="text-primary underline font-medium hover:text-primary/80"
                    onClick={() =>
                      toast({ title: "Em breve", description: "Política de privacidade disponível em breve." })
                    }
                  >
                    Política de privacidade
                  </button>
                  {" "}da ServiceGO.
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-orange-200/60 rounded-xl gap-2 hover:-translate-y-0.5 transition-all mt-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    Criar conta grátis
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400">ou</span>
              </div>
            </div>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Entrar agora →
              </Link>
            </p>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-5">
            Seus dados estão protegidos e nunca serão compartilhados.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Cadastro;
