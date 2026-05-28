import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, User, Briefcase, Mail, Lock, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import AuthPanel from "@/components/auth/AuthPanel";
import { LogoFull } from "@/components/Logo";
import { validateSignupForm, hasNoErrors, type ValidationErrors } from "@/lib/validation";

const Cadastro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("cliente");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

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
    role === "cliente"
      ? "Junte-se à ServiceGO e encontre ou ofereça serviços com confiança."
      : "Crie sua conta e comece a receber clientes hoje mesmo.";

  return (
    <div className="min-h-screen bg-white flex">
      <AuthPanel title="Crie sua conta" subtitle={panelSubtitle} />

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg relative z-10 py-8"
        >
          <div className="flex justify-center mb-6">
            <LogoFull iconSize={28} textSize="text-xl" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
            <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Criar sua conta</h1>
            <p className="text-sm text-gray-500 mb-7">Preencha os dados para começar</p>

            <form onSubmit={handleSignup} className="space-y-5">
              {/* Nome + Email row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Digite seu nome completo"
                      value={name}
                      autoComplete="name"
                      onChange={(e) => { setName(e.target.value); clearError("name"); }}
                      className={`pl-9 h-11 rounded-xl border-gray-200 focus:border-primary ${errors.name ? "border-red-400" : ""}`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      autoComplete="email"
                      onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                      className={`pl-9 h-11 rounded-xl border-gray-200 focus:border-primary ${errors.email ? "border-red-400" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>

              {/* Telefone */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Telefone <span className="text-gray-400 font-normal">(opcional)</span></Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="(11) 99999-9999" className="pl-9 h-11 rounded-xl border-gray-200 focus:border-primary" />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                    className={`pl-9 pr-10 h-11 rounded-xl border-gray-200 focus:border-primary ${errors.password ? "border-red-400" : ""}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Confirmar senha */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repita sua senha"
                    value={confirmPassword}
                    autoComplete="new-password"
                    onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword"); }}
                    className={`pl-9 pr-10 h-11 rounded-xl border-gray-200 focus:border-primary ${errors.confirmPassword ? "border-red-400" : ""}`}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              {/* Tipo de conta */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Tipo de conta</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "cliente" as UserRole,   icon: User,      label: "Cliente",       desc: "Quero contratar serviços para minha casa ou empresa." },
                    { value: "prestador" as UserRole, icon: Briefcase, label: "Profissional",  desc: "Quero oferecer meus serviços e conquistar clientes." },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRole(opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        role === opt.value
                          ? "border-primary bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === opt.value ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                          <opt.icon className="h-5 w-5" />
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${role === opt.value ? "border-primary" : "border-gray-300"}`}>
                          {role === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                      </div>
                      <p className="font-semibold text-sm text-gray-900">{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-snug">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input type="checkbox" id="terms" required className="mt-0.5 accent-primary w-4 h-4 rounded" />
                <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                  Eu aceito os{" "}
                  <button type="button" className="text-primary underline">Termos de uso</button>
                  {" "}e a{" "}
                  <button type="button" className="text-primary underline">Política de privacidade</button>
                  {" "}da ServiceGO.
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-md shadow-orange-200 rounded-xl"
                disabled={loading}
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Criando conta...</> : "Criar conta"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">Entrar agora →</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cadastro;
