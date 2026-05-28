import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
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
  const [remember, setRemember] = useState(false);
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
      toast({
        title: "E-mail ou senha inválidos",
        description: "Verifique seus dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <AuthPanel
        title="Bem-vindo de volta"
        subtitle="Acesse sua conta e gerencie seus serviços de forma simples e eficiente."
        isLogin
      />

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-gray-50 relative overflow-hidden">
        {/* Subtle blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-50 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md relative z-10 py-6 sm:py-0"
        >
          {/* Logo — visible on mobile (panel hidden) and desktop above card */}
          <div className="flex justify-center mb-6 sm:mb-7">
            <LogoFull iconSize={30} textSize="text-xl" />
          </div>

          {/* Login card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/60 p-5 sm:p-8">

            {/* Card header */}
            <div className="mb-7">
              <h1 className="font-display text-2xl font-bold text-gray-900 leading-tight">
                Entrar na sua conta
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                Digite seu e-mail e senha para acessar
              </p>
            </div>

            <form onSubmit={handleLogin} noValidate className="space-y-5">

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
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                    {errors.email}
                  </p>
                )}
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
                    placeholder="••••••••"
                    value={password}
                    autoComplete="current-password"
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
                {errors.password && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={(checked) => setRemember(checked === true)}
                    className="rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer select-none"
                  >
                    Lembrar de mim
                  </label>
                </div>
                <button
                  type="button"
                  className="text-xs text-primary font-medium hover:underline"
                  onClick={() =>
                    toast({
                      title: "Em breve",
                      description: "Recuperação de senha será implementada em breve.",
                    })
                  }
                >
                  Esqueci minha senha
                </button>
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
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400">ou</span>
              </div>
            </div>

            {/* Signup link */}
            <p className="text-center text-sm text-gray-500">
              Ainda não tem conta?{" "}
              <Link to="/cadastro" className="text-primary font-semibold hover:underline">
                Cadastre-se grátis
              </Link>
            </p>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-5">
            Ao entrar, você concorda com nossos{" "}
            <button className="underline hover:text-gray-600 transition-colors">Termos de uso</button>
            {" "}e{" "}
            <button className="underline hover:text-gray-600 transition-colors">Privacidade</button>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
