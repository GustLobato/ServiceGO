import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X, Mail, Phone, User, Briefcase, Shield, Calendar, Star } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth, type AuthUser } from "@/contexts/AuthContext";

interface ProfileViewProps {
  user: AuthUser;
  userName: string;
  userInitials: string;
}

const ROLE_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  cliente:   { label: "Cliente",       color: "text-blue-700",   bg: "bg-blue-50 border-blue-200" },
  prestador: { label: "Profissional",  color: "text-green-700",  bg: "bg-green-50 border-green-200" },
  admin:     { label: "Administrador", color: "text-primary",    bg: "bg-orange-50 border-orange-200" },
};

const ProfileView = ({ user, userName, userInitials }: ProfileViewProps) => {
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone ?? "",
    bio: user.bio ?? "",
  });

  const mutation = useMutation({
    mutationFn: (data: typeof form) => api.patch("/api/users/me", data),
    onSuccess: () => {
      toast({ title: "Perfil atualizado!" });
      refreshUser();
      setEditing(false);
    },
    onError: (e: Error) => {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    },
  });

  const roleInfo = ROLE_LABEL[user.role] ?? ROLE_LABEL.cliente;
  const joinDate = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div className="max-w-3xl">
      {/* Profile hero card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        {/* Cover gradient */}
        <div className="h-32 bg-gradient-to-br from-primary via-orange-500 to-amber-400 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        {/* Avatar + info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-5">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center">
              <span className="font-display font-bold text-2xl text-primary">{userInitials}</span>
            </div>
            {!editing ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-xl border-gray-200 hover:border-primary hover:text-primary transition-colors"
                onClick={() => setEditing(true)}
              >
                <Pencil className="h-4 w-4" /> Editar perfil
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-xl"
                  onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone ?? "", bio: user.bio ?? "" }); }}
                >
                  <X className="h-4 w-4" /> Cancelar
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 rounded-xl bg-primary hover:bg-primary/90"
                  disabled={mutation.isPending}
                  onClick={() => mutation.mutate(form)}
                >
                  <Save className="h-4 w-4" /> Salvar
                </Button>
              </div>
            )}
          </div>

          <h2 className="font-display text-2xl font-bold text-gray-900">{userName}</h2>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Mail className="h-3.5 w-3.5" /> {user.email}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleInfo.bg} ${roleInfo.color}`}>
              {user.role === "prestador" ? <Briefcase className="h-3 w-3" /> : <User className="h-3 w-3" />}
              {roleInfo.label}
            </span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-100">
            {[
              { icon: Star,     label: "Avaliação",      value: "5.0",   sub: "média geral" },
              { icon: Shield,   label: "Verificado",     value: "Sim",   sub: "conta verificada" },
              { icon: Calendar, label: "Membro desde",   value: joinDate, sub: "na plataforma" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="font-display font-bold text-gray-900 text-sm leading-snug">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-display font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Informações pessoais
        </h3>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name" className="text-sm font-medium text-gray-700">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="profile-name"
                  value={editing ? form.name : userName}
                  readOnly={!editing}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className={`pl-9 h-11 rounded-xl border-gray-200 ${editing ? "focus:border-primary" : "bg-gray-50 text-gray-600"}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-phone" className="text-sm font-medium text-gray-700">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="profile-phone"
                  value={editing ? form.phone : (user.phone ?? "")}
                  readOnly={!editing}
                  placeholder={editing ? "(00) 00000-0000" : "Não informado"}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className={`pl-9 h-11 rounded-xl border-gray-200 ${editing ? "focus:border-primary" : "bg-gray-50 text-gray-600"}`}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-email" className="text-sm font-medium text-gray-700">E-mail <span className="text-gray-400 font-normal">(não editável)</span></Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="profile-email"
                value={user.email}
                readOnly
                className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-bio" className="text-sm font-medium text-gray-700">
              {user.role === "prestador" ? "Sobre você / Serviços oferecidos" : "Bio"}
            </Label>
            <Textarea
              id="profile-bio"
              value={editing ? form.bio : (user.bio ?? "")}
              readOnly={!editing}
              placeholder={
                editing
                  ? user.role === "prestador"
                    ? "Fale sobre sua experiência e serviços que você oferece..."
                    : "Fale um pouco sobre você..."
                  : "Nenhuma bio cadastrada"
              }
              rows={4}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              className={`rounded-xl border-gray-200 resize-none ${editing ? "focus:border-primary" : "bg-gray-50 text-gray-600"}`}
            />
          </div>

          {editing && (
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone ?? "", bio: user.bio ?? "" }); }}
              >
                Cancelar
              </Button>
              <Button
                className="rounded-xl bg-primary hover:bg-primary/90 gap-2"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate(form)}
              >
                <Save className="h-4 w-4" />
                {mutation.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Security card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-5">
        <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Segurança
        </h3>
        <div className="flex items-center justify-between py-3 border-b border-gray-50">
          <div>
            <p className="text-sm font-medium text-gray-900">Senha</p>
            <p className="text-xs text-gray-500 mt-0.5">Altere sua senha regularmente para manter a conta segura</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl text-xs" disabled>
            Em breve
          </Button>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">Verificação em dois fatores</p>
            <p className="text-xs text-gray-500 mt-0.5">Adicione uma camada extra de proteção</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl text-xs" disabled>
            Em breve
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
