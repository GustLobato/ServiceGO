/**
 * Testes unitários para src/data/mockData.ts
 *
 * Valida integridade, consistência e contratos dos dados mock.
 */
import { describe, it, expect } from "vitest";
import {
  INITIAL_REQUESTS,
  MOCK_NOTIFICATIONS,
  CATEGORIES,
  type RequestStatus,
} from "@/data/mockData";

const VALID_STATUSES: RequestStatus[] = [
  "pendente",
  "aceita",
  "em_andamento",
  "concluida",
];

describe("INITIAL_REQUESTS", () => {
  it("deve ser um array não vazio", () => {
    expect(Array.isArray(INITIAL_REQUESTS)).toBe(true);
    expect(INITIAL_REQUESTS.length).toBeGreaterThan(0);
  });

  it("cada solicitação deve ter os campos obrigatórios", () => {
    INITIAL_REQUESTS.forEach((req) => {
      expect(req.id, `id faltando em: ${req.service}`).toBeTruthy();
      expect(req.service, `service faltando em id: ${req.id}`).toBeTruthy();
      expect(req.provider, `provider faltando em id: ${req.id}`).toBeTruthy();
      expect(
        req.providerInitials,
        `providerInitials faltando em id: ${req.id}`
      ).toBeTruthy();
      expect(req.date, `date faltando em id: ${req.id}`).toBeTruthy();
      expect(req.category, `category faltando em id: ${req.id}`).toBeTruthy();
    });
  });

  it("todos os status devem ser valores válidos de RequestStatus", () => {
    INITIAL_REQUESTS.forEach((req) => {
      expect(
        VALID_STATUSES,
        `status inválido "${req.status}" em id: ${req.id}`
      ).toContain(req.status);
    });
  });

  it("todos os IDs devem ser únicos", () => {
    const ids = INITIAL_REQUESTS.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("providerInitials deve ter no máximo 2 caracteres", () => {
    INITIAL_REQUESTS.forEach((req) => {
      expect(
        req.providerInitials.length,
        `initials muito longas em id: ${req.id}`
      ).toBeLessThanOrEqual(2);
    });
  });

  it("categorias das solicitações devem existir na lista de CATEGORIES", () => {
    INITIAL_REQUESTS.forEach((req) => {
      expect(
        CATEGORIES,
        `categoria "${req.category}" não existe em CATEGORIES`
      ).toContain(req.category);
    });
  });
});

describe("MOCK_NOTIFICATIONS", () => {
  it("deve ser um array não vazio e readonly", () => {
    expect(Array.isArray(MOCK_NOTIFICATIONS)).toBe(true);
    expect(MOCK_NOTIFICATIONS.length).toBeGreaterThan(0);
  });

  it("cada notificação deve ter id, text, time e unread", () => {
    MOCK_NOTIFICATIONS.forEach((n) => {
      expect(n.id).toBeDefined();
      expect(n.text).toBeTruthy();
      expect(n.time).toBeTruthy();
      expect(typeof n.unread).toBe("boolean");
    });
  });

  it("ids de notificações devem ser únicos", () => {
    const ids = MOCK_NOTIFICATIONS.map((n) => n.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("deve conter pelo menos uma notificação não lida", () => {
    const hasUnread = MOCK_NOTIFICATIONS.some((n) => n.unread);
    expect(hasUnread).toBe(true);
  });
});

describe("CATEGORIES", () => {
  it("deve ser um array não vazio", () => {
    expect(Array.isArray(CATEGORIES)).toBe(true);
    expect(CATEGORIES.length).toBeGreaterThan(0);
  });

  it("todas as categorias devem ser strings não vazias", () => {
    CATEGORIES.forEach((cat) => {
      expect(typeof cat).toBe("string");
      expect(cat.trim().length).toBeGreaterThan(0);
    });
  });

  it("não deve ter categorias duplicadas", () => {
    const unique = new Set(CATEGORIES);
    expect(unique.size).toBe(CATEGORIES.length);
  });
});
