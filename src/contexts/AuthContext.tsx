import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api, getToken, setToken, removeToken, roleToPt } from "@/lib/api";

export type UserRole = "cliente" | "prestador";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

/** Maps the API user object to our frontend AuthUser */
function mapUser(u: Record<string, unknown>): AuthUser {
  return {
    id: u.id as string,
    name: u.name as string,
    email: u.email as string,
    role: roleToPt(u.role as string) as UserRole,
    phone: (u.phone as string) ?? undefined,
    bio: (u.bio as string) ?? undefined,
    avatarUrl: (u.avatarUrl as string) ?? undefined,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh user data from API
  const refreshUser = async (): Promise<void> => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const data = await api.get<Record<string, unknown>>("/api/auth/me");
      setUser(mapUser(data));
    } catch {
      removeToken();
      setUser(null);
    }
  };

  // Rehydrate session — validate stored JWT via /api/auth/me
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    refreshUser().finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const data = await api.post<{ user: Record<string, unknown>; token: string }>(
      "/api/auth/login",
      { email, password },
    );
    setToken(data.token);
    setUser(mapUser(data.user));
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ): Promise<void> => {
    const roleEn = role === "prestador" ? "provider" : "client";
    const data = await api.post<{ user: Record<string, unknown>; token: string }>(
      "/api/auth/register",
      { name, email, password, role: roleEn },
    );
    setToken(data.token);
    setUser(mapUser(data.user));
  };

  const logout = () => {
    setUser(null);
    removeToken();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
