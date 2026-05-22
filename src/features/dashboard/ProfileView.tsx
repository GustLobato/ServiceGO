/**
 * ProfileView — view de perfil do usuário com edição via API.
 */
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth, type AuthUser } from "@/contexts/AuthContext";

interface ProfileViewProps {
  user: AuthUser;
  userName: string;
  userInitials: string;
}

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

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Meu Perfil
        </h1>
        {!editing ? (
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" /> Editar
          </Button>
        ) : (
          <Button
            size="sm"
            className="gap-1"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(form)}
          >
            <Save className="h-4 w-4" /> Salvar
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                {userName}
              </h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              <Badge variant="outline" className="mt-1 capitalize">
                {user.role}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Nome</Label>
              <Input
                id="profile-name"
                value={editing ? form.name : userName}
                readOnly={!editing}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">E-mail</Label>
              <Input id="profile-email" value={user.email} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-phone">Telefone</Label>
              <Input
                id="profile-phone"
                value={editing ? form.phone : (user.phone ?? "")}
                readOnly={!editing}
                placeholder="(00) 00000-0000"
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="profile-bio">Bio</Label>
            <Textarea
              id="profile-bio"
              value={editing ? form.bio : (user.bio ?? "")}
              readOnly={!editing}
              placeholder="Fale um pouco sobre você..."
              rows={3}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileView;
