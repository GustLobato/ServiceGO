/**
 * AuthPanel — painel decorativo esquerdo compartilhado entre Login e Cadastro.
 * Elimina a duplicação de ~20 linhas idênticas nos dois arquivos.
 */
interface AuthPanelProps {
  title: string;
  subtitle: string;
}

const AuthPanel = ({ title, subtitle }: AuthPanelProps) => (
  <div className="hidden lg:flex lg:w-1/2 bg-accent relative overflow-hidden items-center justify-center p-12">
    {/* Gradientes decorativos */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(25_95%_53%/0.25),transparent_60%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(25_95%_53%/0.15),transparent_50%)]" />

    <div className="relative z-10 max-w-md">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-display font-bold">S</span>
        </div>
        <span className="font-display font-bold text-2xl text-accent-foreground">
          Service<span className="text-primary">GO</span>
        </span>
      </div>

      <h2 className="font-display text-4xl font-bold text-accent-foreground leading-tight">
        {title}
      </h2>
      <p className="text-accent-foreground/60 mt-4 text-lg leading-relaxed">
        {subtitle}
      </p>
    </div>
  </div>
);

export default AuthPanel;
