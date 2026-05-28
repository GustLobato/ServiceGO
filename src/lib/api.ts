// ---------------------------------------------------------------------------
// api.ts — Centralised HTTP client for the ServiceGO REST API
// ---------------------------------------------------------------------------
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// ---- Token helpers --------------------------------------------------------
const TOKEN_KEY = "servicego_token";

// sessionStorage is cleared when the tab closes, reducing persistent XSS exposure
export const getToken = (): string | null => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => sessionStorage.setItem(TOKEN_KEY, t);
export const removeToken = () => sessionStorage.removeItem(TOKEN_KEY);

// ---- Role / Status mapping  PT ↔ EN --------------------------------------
const ROLE_TO_PT: Record<string, string> = { client: "cliente", provider: "prestador" };
const ROLE_TO_EN: Record<string, string> = { cliente: "client", prestador: "provider" };

const STATUS_TO_PT: Record<string, string> = {
  pending: "pendente",
  accepted: "aceita",
  in_progress: "em_andamento",
  completed: "concluida",
  cancelled: "cancelada",
};
const STATUS_TO_EN: Record<string, string> = {
  pendente: "pending",
  aceita: "accepted",
  em_andamento: "in_progress",
  concluida: "completed",
  cancelada: "cancelled",
};

export const roleToPt = (r: string) => ROLE_TO_PT[r] ?? r;
export const roleToEn = (r: string) => ROLE_TO_EN[r] ?? r;
export const statusToPt = (s: string) => STATUS_TO_PT[s] ?? s;
export const statusToEn = (s: string) => STATUS_TO_EN[s] ?? s;

// ---- Generic fetch wrapper ------------------------------------------------
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  opts: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> ?? {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...opts, headers });

  if (res.status === 204) return undefined as unknown as T;

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    throw new ApiError(res.status, body.error ?? "Erro desconhecido");
  }

  return body as T;
}

// ---- Convenience methods --------------------------------------------------
export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
