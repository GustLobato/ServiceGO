import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, Users, AlertTriangle, ShieldCheck, Mail, ArrowLeft, RefreshCw } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";

const Terms = () => {
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
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Termos de Uso do ServiceGO
            </h1>
            <p className="text-sm text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
              Bem-vindo ao ServiceGO. Leia atentamente estes Termos de Uso antes de acessar ou se cadastrar em nossa plataforma de conexão para serviços.
            </p>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              Última atualização: 28 de maio de 2026
            </p>
          </motion.div>

          {/* Content sections */}
          <div className="space-y-6">
            
            {/* Section 1: What is ServiceGO */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 sm:p-8"
            >
              <h3 className="font-display font-bold text-gray-900 text-lg flex items-center gap-2.5 mb-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                1. Natureza do Serviço da Plataforma
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                O <strong>ServiceGO</strong> é um marketplace de serviços digitais intermediado por software. Nossa plataforma funciona estritamente como um <strong>canal de conexão e aproximação</strong> entre prestadores de serviços autônomos (profissionais) e tomadores de serviços (clientes). 
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                <strong>Importante:</strong> O ServiceGO **não emprega**, **não representa** e **não é responsável** pelo comportamento, cumprimento do cronograma, fornecimento de materiais ou garantia do serviço executado pelo profissional contratado. O contrato é firmado de forma direta e exclusiva entre o profissional e o cliente.
              </p>
            </motion.div>

            {/* Section 2: Registration rules */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 sm:p-8"
            >
              <h3 className="font-display font-bold text-gray-900 text-lg flex items-center gap-2.5 mb-4">
                <Users className="h-5 w-5 text-primary" />
                2. Requisitos e Regras para Cadastro
              </h3>
              <ul className="list-disc pl-5 space-y-2.5 text-sm text-gray-600">
                <li>
                  <strong>Capacidade Legal:</strong> Para se cadastrar e efetuar contratações, você deve ter no mínimo 18 anos ou ser plenamente capaz perante a lei brasileira.
                </li>
                <li>
                  <strong>Veracidade das Informações:</strong> O usuário compromete-se a fornecer informações cadastrais verídicas, completas e atualizadas. Contas criadas com nomes falsos, e-mails temporários ou telefones inexistentes estão sujeitas à suspensão sem aviso prévio.
                </li>
                <li>
                  <strong>Segurança da Senha:</strong> Você é o único responsável pela guarda e confidencialidade da sua senha. Qualquer ação realizada logada em seu perfil será atribuída a você.
                </li>
              </ul>
            </motion.div>

            {/* Section 3: Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 sm:p-8"
            >
              <h3 className="font-display font-bold text-gray-900 text-lg flex items-center gap-2.5 mb-4">
                <AlertTriangle className="h-5 w-5 text-primary" />
                3. Responsabilidades das Partes
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-orange-50/30 border border-orange-100/50">
                  <p className="text-xs font-bold text-primary uppercase tracking-wide">Compromissões do Cliente</p>
                  <ul className="list-disc pl-4 mt-2 space-y-1 text-xs text-gray-600">
                    <li>Fornecer a descrição correta e honesta do problema a ser resolvido.</li>
                    <li>Fornecer local seguro e acesso para que o profissional possa trabalhar.</li>
                    <li>Efetuar o pagamento do valor combinado diretamente ao profissional após a conclusão do serviço.</li>
                    <li>Fornecer avaliações justas, fundamentadas e livres de preconceito ou termos ofensivos.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-green-50/30 border border-green-150/50">
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wide">Compromissões do Profissional (Prestador)</p>
                  <ul className="list-disc pl-4 mt-2 space-y-1 text-xs text-gray-600">
                    <li>Prestar informações claras sobre seu escopo de atuação e formação técnica.</li>
                    <li>Efetuar orçamentos transparentes, justos e detalhados.</li>
                    <li>Executar o serviço de acordo com as boas práticas de segurança técnica e legislação local.</li>
                    <li>Manter postura ética, educada e pontualidade nos atendimentos agendados.</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Section 4: Conducts & Penalties */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 sm:p-8"
            >
              <h3 className="font-display font-bold text-gray-900 text-lg flex items-center gap-2.5 mb-4">
                <AlertTriangle className="h-5 w-5 text-primary" />
                4. Condutas Proibidas e Suspensão de Conta
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Para manter a segurança e a integridade da comunidade, as seguintes condutas são estritamente proibidas e resultarão no **bloqueio ou exclusão imediata** da conta:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2.5 text-sm text-gray-600">
                <li>Utilizar a plataforma para divulgação de atos ilícitos, serviços ilegais ou de natureza erótica/violenta.</li>
                <li>Agredir física ou verbalmente qualquer usuário (cliente ou prestador) contatado pela plataforma.</li>
                <li>Cobrar valores abusivos fora do acordado previamente ou aplicar golpes financeiros.</li>
                <li>Manipular avaliações de prestadores através de perfis falsos ou combinados.</li>
              </ul>
            </motion.div>

            {/* Section 5: Terms Update */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 sm:p-8"
            >
              <h3 className="font-display font-bold text-gray-900 text-lg flex items-center gap-2.5 mb-4">
                <RefreshCw className="h-5 w-5 text-primary" />
                5. Alterações nos Termos e Resolução de Conflitos
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                O ServiceGO reserva-se o direito de atualizar estes termos periodicamente para se adequar a novas funcionalidades ou diretrizes legais. Recomendamos que você visite esta página com regularidade.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                Qualquer conflito judicial relacionado a estes termos será regido pelas leis vigentes na República Federativa do Brasil, elegendo-se o foro da comarca da capital do estado de São Paulo como competente.
              </p>
            </motion.div>

            {/* Section 6: Contact */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 sm:p-8"
            >
              <h3 className="font-display font-bold text-gray-900 text-lg flex items-center gap-2.5 mb-4">
                <Mail className="h-5 w-5 text-primary" />
                6. Dúvidas e Contato Legal
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Caso tenha dúvidas sobre estes termos de uso, direitos de propriedade intelectual ou conflito entre usuários, entre em contato com nossa equipe de suporte e moderação legal:
              </p>
              <div className="mt-5 p-4 rounded-2xl bg-orange-50/50 border border-orange-100/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Suporte Técnico e Legal ServiceGO</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Equipe de mediação e conformidade institucional:
                  </p>
                </div>
                <a
                  href="mailto:suporte@servicego.com.br"
                  className="text-xs font-bold text-primary hover:underline bg-white px-3 py-2 rounded-xl border border-gray-200 text-center"
                >
                  suporte@servicego.com.br
                </a>
              </div>
            </motion.div>

          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
            Este site é um protótipo acadêmico para fins didáticos de Extensão Universitária.<br />
            Embora as funcionalidades de contratação sejam simuladas, suas diretrizes de conduta seguem as normas do Código de Defesa do Consumidor (CDC) e do Marco Civil da Internet.
          </p>

        </div>
      </div>
    </PublicLayout>
  );
};

export default Terms;
