import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AuthPanel from "@/components/auth/AuthPanel";
import { LogoFull } from "@/components/Logo";
import { validateLoginForm, hasNoErrors, type ValidationErrors } from "@/lib/validation";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  if (user) return null;

  const clearError = (field: keyof ValidationErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(email, password);
    setErrors(validationErrors);
    if (!hasNoErrors(validationErrors)) return;

    setLoading(true);
    try {
      await login(email, password);
      toast({ title: "Login realizado!", description: "Redirecionando..." });
      navigate("/dashboard");
    } catch {
      toast({ title: "Erro no login", description: "E-mail ou senha inválidos.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <AuthPanel
        title="Bem-vindo de volta"
        subtitle="Acesse sua conta e gerencie seus serviços de forma simples e eficiente."
        isLogin
      />

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo top of form */}
          <div className="flex justify-center mb-8">
            <LogoFull iconSize={28} textSize="text-xl" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
            <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Entrar na sua conta</h1>
            <p className="text-sm text-gray-500 mb-7">Digite seu e-mail e senha para acessar</p>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* E-mail */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                    className={`pl-10 h-11 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 ${errors.email ? "border-red-400" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() => toast({ title: "Em breve", description: "Funcionalidade de recuperação de senha será implementada." })}
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                    className={`pl-10 pr-10 h-11 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 ${errors.password ? "border-red-400" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-md shadow-orange-200 rounded-xl"
                disabled={loading}
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Entrando...</> : "Entrar"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Ainda não tem conta?{" "}
              <Link to="/cadastro" className="text-primary font-semibold hover:underline">Cadastre-se</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
