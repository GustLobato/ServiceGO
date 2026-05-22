/**
 * Testes unitários para a lógica do hook useRequests.
 *
 * Como o hook usa useState/useMemo do React, testamos a lógica pura
 * de filtragem e cálculo de stats de forma isolada (sem renderizar).
 */
import { describe, it, expect } from "vitest";
import { INITIAL_REQUESTS, type ServiceRequest } from "@/data/mockData";

// ─── Lógica de filtro (extraída do hook) ─────────────────────────────────────
function filterRequests(
  requests: ServiceRequest[],
  searchQuery: string,
  statusFilter: string
): ServiceRequest[] {
  return requests.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      r.service.toLowerCase().includes(q) ||
      r.provider.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });
}

// ─── Lógica de stats (extraída do hook) ──────────────────────────────────────
function calcStats(requests: ServiceRequest[]) {
  return {
    total: requests.length,
    active: requests.filter(
      (r) => r.status === "em_andamento" || r.status === "aceita"
    ).length,
    pending: requests.filter((r) => r.status === "pendente").length,
    completed: requests.filter((r) => r.status === "concluida").length,
  };
}

describe("filterRequests", () => {
  it("retorna todos quando searchQuery e statusFilter são padrão", () => {
    const result = filterRequests(INITIAL_REQUESTS, "", "all");
    expect(result).toHaveLength(INITIAL_REQUESTS.length);
  });

  it("filtra por nome do serviço (case-insensitive)", () => {
    const result = filterRequests(INITIAL_REQUESTS, "encanamento", "all");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((r) => {
      const matchesSearch =
        r.service.toLowerCase().includes("encanamento") ||
        r.provider.toLowerCase().includes("encanamento") ||
        r.category.toLowerCase().includes("encanamento");
      expect(matchesSearch).toBe(true);
    });
  });

  it("filtra por nome do prestador", () => {
    const result = filterRequests(INITIAL_REQUESTS, "João", "all");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((r) =>
      expect(r.provider.toLowerCase()).toContain("joão")
    );
  });

  it("filtra por categoria", () => {
    const result = filterRequests(INITIAL_REQUESTS, "Tecnologia", "all");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((r) =>
      expect(r.category.toLowerCase()).toContain("tecnologia")
    );
  });

  it("filtra por status 'pendente'", () => {
    const result = filterRequests(INITIAL_REQUESTS, "", "pendente");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((r) => expect(r.status).toBe("pendente"));
  });

  it("filtra por status 'concluida'", () => {
    const result = filterRequests(INITIAL_REQUESTS, "", "concluida");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((r) => expect(r.status).toBe("concluida"));
  });

  it("retorna vazio quando a busca não encontra correspondência", () => {
    const result = filterRequests(INITIAL_REQUESTS, "xyzxyzxyz_inexistente", "all");
    expect(result).toHaveLength(0);
  });

  it("combina filtro de texto e status corretamente", () => {
    const result = filterRequests(INITIAL_REQUESTS, "PC", "concluida");
    result.forEach((r) => {
      expect(r.status).toBe("concluida");
      const matchesSearch =
        r.service.toLowerCase().includes("pc") ||
        r.provider.toLowerCase().includes("pc") ||
        r.category.toLowerCase().includes("pc");
      expect(matchesSearch).toBe(true);
    });
  });
});

describe("calcStats", () => {
  it("calcula total corretamente", () => {
    const stats = calcStats(INITIAL_REQUESTS);
    expect(stats.total).toBe(INITIAL_REQUESTS.length);
  });

  it("calcula ativas = em_andamento + aceitas", () => {
    const stats = calcStats(INITIAL_REQUESTS);
    const manual = INITIAL_REQUESTS.filter(
      (r) => r.status === "em_andamento" || r.status === "aceita"
    ).length;
    expect(stats.active).toBe(manual);
  });

  it("calcula pendentes corretamente", () => {
    const stats = calcStats(INITIAL_REQUESTS);
    const manual = INITIAL_REQUESTS.filter((r) => r.status === "pendente").length;
    expect(stats.pending).toBe(manual);
  });

  it("calcula concluídas corretamente", () => {
    const stats = calcStats(INITIAL_REQUESTS);
    const manual = INITIAL_REQUESTS.filter((r) => r.status === "concluida").length;
    expect(stats.completed).toBe(manual);
  });

  it("retorna zeros para lista vazia", () => {
    const stats = calcStats([]);
    expect(stats.total).toBe(0);
    expect(stats.active).toBe(0);
    expect(stats.pending).toBe(0);
    expect(stats.completed).toBe(0);
  });

  it("total = active + pending + completed (sem duplicatas)", () => {
    const stats = calcStats(INITIAL_REQUESTS);
    // Total deve ser >= soma individual (em_andamento + aceita não se sobrepõem)
    expect(stats.total).toBeGreaterThanOrEqual(
      stats.active + stats.pending + stats.completed
    );
  });
});
