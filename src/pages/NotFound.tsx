import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-6">
    <div className="text-center space-y-6 max-w-md">
      <div className="text-9xl font-bold text-primary/20 select-none">404</div>
      <h1 className="text-2xl font-bold text-foreground">Página não encontrada</h1>
      <p className="text-muted-foreground leading-relaxed">
        A página que você está procurando não existe, foi movida ou o endereço está incorreto.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Página anterior
        </Button>
      </div>
    </div>
  </div>
);

export default NotFound;
