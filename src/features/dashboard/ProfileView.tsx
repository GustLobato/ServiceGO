/**
 * ProfileView — view de perfil do usuário (modo leitura por enquanto).
 */
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthUser } from "@/contexts/AuthContext";

interface ProfileViewProps {
  user: AuthUser;
  userName: string;
  userInitials: string;
}

const ProfileView = ({ user, userName, userInitials }: ProfileViewProps) => (
  <>
    <h1 className="font-display text-2xl font-bold text-foreground mb-6">
      Meu Perfil
    </h1>
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
            <Input id="profile-name" value={userName} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">E-mail</Label>
            <Input id="profile-email" value={user.email} readOnly />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Edição de perfil será habilitada em breve.
        </p>
      </CardContent>
    </Card>
  </>
);

export default ProfileView;
