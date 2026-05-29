import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Eye, Lock, MapPin, Database, UserCheck, Mail, ArrowLeft, Cookie } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  const handleManageCookies = () => {
    window.dispatchEvent(new Event("show-cookie-banner"));
  };

  return (
    <PublicLayout>
      <div className="bg-gray-50 min-h-screen pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Back button */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Voltar para a Home
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-primary mx-auto mb-4 border border-orange-100/40">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Política de Privacidade
            </h1>
            <p className="text-sm text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
              Esta política detalha como coletamos, tratamos, protegemos e compartilhamos seus dados no ServiceGO em total conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              Última atualização: 28 de maio de 2026
            </p>
          </motion.div>

          {/* Content sections */}
          <div className="space-y-6">
            
            {/* Section 1: Intro Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 sm:p-8"
            >
              <h3 className="font-display font-bold text-gray-900 text-lg flex items-center gap-2.5 mb-4">
                <UserCheck className="h-5 w-5 text-primary" />
                1. Compromisso com a Transparência
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                O ServiceGO é uma plataforma de marketplace que conecta prestadores de serviços a clientes no Brasil. Para que a plataforma funcione de maneira rápida e segura, precisamos coletar alguns dados pessoais. Acreditamos na transparência absoluta e no controle total do titular sobre seus próprios dados.
              </p>
            </motion.div>

            {/* Section 2: What we collect */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 sm:p-8"
            >
              <h3 className="font-display font-bold text-gray-900 text-lg flex items-center gap-2.5 mb-4">
                <Database className="h-5 w-5 text-primary" />
                2. Quais dados coletamos e para que finalidade
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Coletamos apenas os dados essenciais para prestar nossos serviços de contratação e conexão, seguindo o princípio da minimização de dados da LGPD:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">Dados de Cadastro</p>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Nome completo, e-mail, telefone (opcional) e senha. Usados exclusivamente para identificação do perfil, login, comunicação sobre os serviços e segurança da conta.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">Dados de Endereço</p>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Endereço inserido manualmente pelo cliente ao criar uma solicitação. O endereço completo **nunca** é exibido publicamente. Ele só é fornecido ao prestador após a confirmação e agendamento formal do serviço.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 3: Geolocation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 sm:p-8"
            >
              <h3 className="font-display font-bold text-gray-900 text-lg flex items-center gap-2.5 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                3. Uso do Sistema de Localização (Geolocalização)
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Para facilitar a busca de eletricistas, encanadores, pintores e outros profissionais de forma ágil, implementamos geolocalização. Suas regras de privacidade são rígidas:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2.5 text-sm text-gray-600">
                <li>
                  <strong>Consentimento prévio:</strong> O ServiceGO **nunca** solicita sua geolocalização automaticamente ao abrir o site. A permissão do navegador só é requisitada se você clicar deliberadamente no botão <em>"Usar minha localização"</em>.
                </li>
                <li>
                  <strong>Localização Aproximada vs Precisa:</strong> Usamos sua geolocalização exata para calcular a distância e encontrar os prestadores ideais. No entanto, sua latitude/longitude exata e seu endereço completo nunca são expostos. Apenas um raio de distância aproximada (ex: <em>"2,4 km de você"</em>) é gerado para fins de busca.
                </li>
                <li>
                  <strong>Uso Opcional:</strong> A geolocalização não é obrigatória. Se você negar a permissão, o site funcionará perfeitamente e você poderá buscar profissionais informando sua cidade ou endereço de forma manual.
                </li>
              </ul>
            </motion.div>

            {/* Section 4: Sharing */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 sm:p-8"
            >
              <h3 className="font-display font-bold text-gray-900 text-lg flex items-center gap-2.5 mb-4">
                <Eye className="h-5 w-5 text-primary" />
                4. Compartilhamento de Dados
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                O ServiceGO é um marketplace de conexão. Seus dados cadastrais **nunca são vendidos nem compartilhados para marketing de terceiros**. Os dados são compartilhados estritamente nos seguintes cenários:
              </p>
              <ol className="list-decimal pl-5 mt-3 space-y-2.5 text-sm text-gray-600">
                <li>
                  <strong>Entre Clientes e Prestadores:</strong> Quando um cliente envia uma solicitação de serviço, o prestador vê a descrição, categoria e região aproximada. Apenas quando a solicitação é confirmada, o telefone e o endereço completo são revelados para que o profissional possa ir até o local realizar o atendimento.
                </li>
                <li>
                  <strong>Obrigação Legal:</strong> Em conformidade com o Marco Civil da Internet (Lei nº 12.965/14), mantemos logs técnicos de acesso à aplicação por no mínimo 6 meses sob sigilo absoluto, que podem ser revelados apenas mediante ordem judicial formal.
                </li>
              </ol>
            </motion.div>

            {/* Section 5: Cookies Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl border border-gray-150 shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-6 sm:p-8 border-l-4 border-l-primary"
            >
              <h3 className="font-display font-bold text-gray-900 text-lg flex items-center gap-2.5 mb-3">
                <Cookie className="h-5 w-5 text-primary" />
                5. Gerenciamento de Cookies
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Nós respeitamos suas preferências. Cookies não essenciais de análise e marketing só rodam após sua confirmação explícita. Você pode alterar seu consentimento e gerenciar os cookies salvos em seu navegador a qualquer momento.
              </p>
              <Button
                variant="outline"
                className="mt-4 rounded-xl text-xs font-semibold gap-1.5 border-gray-200"
                onClick={handleManageCookies}
              >
                Gerenciar preferências de cookies
              </Button>
            </motion.div>

            {/* Section 6: Rights and Contact */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 sm:p-8"
            >
              <h3 className="font-display font-bold text-gray-900 text-lg flex items-center gap-2.5 mb-4">
                <Lock className="h-5 w-5 text-primary" />
                6. Seus Direitos (Titular dos Dados) e Contato
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Como titular de dados pessoais sob a LGPD, você tem direito a confirmar o tratamento, acessar seus dados, corrigir erros, revogar o consentimento fornecido anteriormente e solicitar a exclusão de sua conta.
              </p>
              <div className="mt-5 p-4 rounded-2xl bg-orange-50/50 border border-orange-100/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    Encarregado de Proteção de Dados (DPO)
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Para qualquer dúvida, reclamação ou solicitação de exclusão de dados pessoais:
                  </p>
                </div>
                <a
                  href="mailto:privacidade@servicego.online"
                  className="text-xs font-bold text-primary hover:underline bg-white px-3 py-2 rounded-xl border border-gray-200 text-center"
                >
                  privacidade@servicego.online
                </a>
              </div>
            </motion.div>

          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
            Este site é um projeto acadêmico de Extensão Universitária.<br />
            Embora simulado para fins educacionais, seus padrões técnicos seguem com rigor a LGPD (Lei nº 13.709/18).
          </p>

        </div>
      </div>
    </PublicLayout>
  );
};

export default Privacy;
