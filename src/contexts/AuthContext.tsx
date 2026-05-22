import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { hashPassword, verifyPassword } from "@/lib/crypto";

export type UserRole = "cliente" | "prestador";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/** Estrutura interna com hash da senha — nunca exposta fora deste arquivo */
interface StoredUser extends AuthUser {
  passwordHash: string;
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
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY_SESSION = "servicego_user";
const STORAGE_KEY_USERS = "servicego_users";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_SESSION);
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
      } catch {
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Simula latência de API
    await new Promise((r) => setTimeout(r, 800));

    const users: StoredUser[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY_USERS) || "[]"
    );

    const found = users.find((u) => u.email === email);

    // ✅ Verifica existência e senha — não cria usuário fantasma
    if (!found) {
      throw new Error("E-mail não encontrado. Verifique ou crie uma conta.");
    }

    const passwordOk = await verifyPassword(password, found.passwordHash);
    if (!passwordOk) {
      throw new Error("Senha incorreta. Tente novamente.");
    }

    // Expõe apenas campos públicos na sessão
    const authUser: AuthUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    };

    setUser(authUser);
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(authUser));
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<void> => {
    await new Promise((r) => setTimeout(r, 800));

    const users: StoredUser[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY_USERS) || "[]"
    );

    if (users.some((u) => u.email === email)) {
      throw new Error("E-mail já cadastrado.");
    }

    // ✅ Armazena hash SHA-256, nunca a senha em plaintext
    const passwordHash = await hashPassword(password);

    const newStoredUser: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      role,
      passwordHash,
    };

    users.push(newStoredUser);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

    const authUser: AuthUser = {
      id: newStoredUser.id,
      name,
      email,
      role,
    };

    setUser(authUser);
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_SESSION);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
