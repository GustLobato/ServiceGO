import { useState, useEffect } from "react";
import { Shield, Settings, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface CookiePreferences {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    preferences: true,
    analytics: false,
    marketing: false,
  });

  const { toast } = useToast();

  useEffect(() => {
    // Check if consent already exists
    const storedConsent = localStorage.getItem("servicego_cookie_consent");
    if (!storedConsent) {
      // Show banner after a brief delay for smoother initial load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      try {
        setPreferences(JSON.parse(storedConsent));
      } catch (e) {
        console.error("Error parsing cookie consent", e);
      }
    }
  }, []);

  // Listen to custom DOM event to open preferences from Footer/Privacy Page
  useEffect(() => {
    const handleOpenBanner = () => {
      setIsVisible(true);
      setShowConfig(true);
    };

    window.addEventListener("show-cookie-banner", handleOpenBanner);
    return () => window.removeEventListener("show-cookie-banner", handleOpenBanner);
  }, []);

  const saveConsent = (updatedPrefs: CookiePreferences) => {
    localStorage.setItem("servicego_cookie_consent", JSON.stringify(updatedPrefs));
    setPreferences(updatedPrefs);
    setIsVisible(false);
    setShowConfig(false);
    toast({
      title: "Preferências salvas!",
      description: "Suas preferências de privacidade e cookies foram salvas com sucesso.",
    });
  };

  const handleAcceptAll = () => {
    const allAccept: CookiePreferences = {
      essential: true,
      preferences: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(allAccept);
  };

  const handleRejectAll = () => {
    const allReject: CookiePreferences = {
      essential: true,
      preferences: false,
      analytics: false,
      marketing: false,
    };
    saveConsent(allReject);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-3xl border border-gray-150 shadow-[0_20px_50px_rgba(0,0,0,0.15)] pointer-events-auto overflow-hidden flex flex-col"
        >
          {/* Main content or Config Panel */}
          {!showConfig ? (
            <div className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary flex-shrink-0 mt-0.5 md:mt-0">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Sua privacidade é nossa prioridade</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1">
                    Usamos cookies para melhorar sua experiência, manter o site seguro e entender o uso da plataforma.
                    Você pode aceitar todos, rejeitar os não essenciais ou configurar suas preferências de acordo com a LGPD.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 md:justify-end">
                <button
                  onClick={() => setShowConfig(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-colors"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Configurar
                </button>
                <button
                  onClick={handleRejectAll}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-colors"
                >
                  Recusar Opcionais
                </button>
                <Button
                  onClick={handleAcceptAll}
                  size="sm"
                  className="flex-1 md:flex-none h-[38px] px-5 rounded-xl text-xs font-bold shadow-sm shadow-orange-200"
                >
                  Aceitar Todos
                </Button>
              </div>
            </div>
          ) : (
            /* Advanced Cookie Configuration modal within the banner */
            <div className="p-5 sm:p-7 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <Shield className="h-5 w-5 text-primary" />
                  <h4 className="text-sm font-bold text-gray-900">Definições de Privacidade</h4>
                </div>
                <button
                  onClick={() => setShowConfig(false)}
                  className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Preferences List */}
              <div className="py-4 space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {/* 1. Essential */}
                <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      Cookies Essenciais
                      <span className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 text-[8px] font-bold uppercase tracking-wider">Obrigatório</span>
                    </h5>
                    <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                      Necessários para a segurança básica, autenticação de conta, suporte a login e gerenciamento de sessões de contratação. Não podem ser desativados.
                    </p>
                  </div>
                  <div className="w-9 h-5 rounded-full bg-primary relative flex items-center shrink-0">
                    <div className="absolute right-0.5 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                  </div>
                </div>

                {/* 2. Preferences */}
                <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-white border border-gray-100">
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">Cookies de Preferência</h5>
                    <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                      Lembram suas configurações e escolhas na plataforma, como sua cidade de busca preferida e configurações regionais personalizadas.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, preferences: !p.preferences }))}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center shrink-0 ${preferences.preferences ? "bg-primary" : "bg-gray-200"}`}
                  >
                    <div className={`absolute w-4 h-4 rounded-full bg-white shadow transition-transform ${preferences.preferences ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                  </button>
                </div>

                {/* 3. Analytics */}
                <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-white border border-gray-100">
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">Cookies de Análise</h5>
                    <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                      Ajudam a nossa equipe de extensão universitária a mensurar as visitas, entender o tráfego de usuários e identificar quais áreas do marketplace precisam de melhorias de performance.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center shrink-0 ${preferences.analytics ? "bg-primary" : "bg-gray-200"}`}
                  >
                    <div className={`absolute w-4 h-4 rounded-full bg-white shadow transition-transform ${preferences.analytics ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                  </button>
                </div>

                {/* 4. Marketing */}
                <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-white border border-gray-100">
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">Cookies de Marketing</h5>
                    <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                      Utilizados para acompanhar o retorno de campanhas de divulgação externa e exibir recomendações focadas no seu perfil de contratação.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center shrink-0 ${preferences.marketing ? "bg-primary" : "bg-gray-200"}`}
                  >
                    <div className={`absolute w-4 h-4 rounded-full bg-white shadow transition-transform ${preferences.marketing ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                <a
                  href="/privacy"
                  className="text-xs font-semibold text-primary hover:underline"
                  onClick={(e) => {
                    // Let router handle unless we just close banner
                  }}
                >
                  Ler Política de Privacidade
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-colors"
                  >
                    Aceitar Todos
                  </button>
                  <Button
                    onClick={handleSavePreferences}
                    size="sm"
                    className="h-[36px] px-5 rounded-xl text-xs font-bold"
                  >
                    Salvar Preferências
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CookieBanner;
