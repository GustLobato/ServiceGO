/**
 * Testes unitários para src/lib/validation.ts
 *
 * Cobre: validateEmail, validatePassword, validateName,
 *        validateLoginForm, validateSignupForm, hasNoErrors
 */
import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateLoginForm,
  validateSignupForm,
  hasNoErrors,
  MIN_PASSWORD_LENGTH,
  MIN_NAME_LENGTH,
} from "@/lib/validation";

// ─── validateEmail ────────────────────────────────────────────────────────────
describe("validateEmail", () => {
  it("retorna erro quando e-mail está vazio", () => {
    expect(validateEmail("")).toBe("E-mail é obrigatório");
  });

  it("retorna erro quando e-mail está em branco (espaços)", () => {
    expect(validateEmail("   ")).toBe("E-mail é obrigatório");
  });

  it("retorna erro para e-mails inválidos", () => {
    const invalids = [
      "naotem@",
      "@dominio.com",
      "sem-arroba.com",
      "duplo@@email.com",
      "comespaco @email.com",
      "a@b",          // sem TLD
      "a@b.c1",       // TLD numérico não permitido pela regex
    ];
    invalids.forEach((email) => {
      expect(validateEmail(email), `deveria rejeitar: "${email}"`).toBe(
        "E-mail inválido"
      );
    });
  });

  it("não retorna erro para e-mails válidos", () => {
    const valids = [
      "usuario@email.com",
      "user.name+tag@dominio.com.br",
      "test_email@sub.dominio.org",
      "a@b.io",
    ];
    valids.forEach((email) => {
      expect(validateEmail(email), `deveria aceitar: "${email}"`).toBeUndefined();
    });
  });
});

// ─── validatePassword ─────────────────────────────────────────────────────────
describe("validatePassword", () => {
  it("retorna erro quando senha está vazia", () => {
    expect(validatePassword("")).toBe("Senha é obrigatória");
  });

  it(`retorna erro quando senha tem menos de ${MIN_PASSWORD_LENGTH} caracteres`, () => {
    const short = "a".repeat(MIN_PASSWORD_LENGTH - 1);
    expect(validatePassword(short)).toBe(
      `Mínimo ${MIN_PASSWORD_LENGTH} caracteres`
    );
  });

  it("não retorna erro para senha com comprimento exato mínimo", () => {
    const exact = "a".repeat(MIN_PASSWORD_LENGTH);
    expect(validatePassword(exact)).toBeUndefined();
  });

  it("não retorna erro para senha longa", () => {
    expect(validatePassword("minhasenhasupersegura123!")).toBeUndefined();
  });

  it("usa rótulo customizado na mensagem de erro", () => {
    expect(validatePassword("", "Confirmar senha")).toBe(
      "Confirmar senha é obrigatória"
    );
  });
});

// ─── validateName ─────────────────────────────────────────────────────────────
describe("validateName", () => {
  it("retorna erro quando nome está vazio", () => {
    expect(validateName("")).toBe("Nome é obrigatório");
  });

  it("retorna erro quando nome é só espaços", () => {
    expect(validateName("   ")).toBe("Nome é obrigatório");
  });

  it(`retorna erro quando nome tem menos de ${MIN_NAME_LENGTH} caracteres`, () => {
    expect(validateName("Jo")).toBe(`Mínimo ${MIN_NAME_LENGTH} caracteres`);
  });

  it("não retorna erro para nome válido", () => {
    expect(validateName("João")).toBeUndefined();
    expect(validateName("Maria Fernanda")).toBeUndefined();
  });
});

// ─── validateLoginForm ────────────────────────────────────────────────────────
describe("validateLoginForm", () => {
  it("retorna erros para formulário vazio", () => {
    const errors = validateLoginForm("", "");
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it("retorna objeto sem erros para formulário válido", () => {
    const errors = validateLoginForm("user@email.com", "minhasenha123");
    expect(errors.email).toBeUndefined();
    expect(errors.password).toBeUndefined();
  });

  it("retorna apenas erro de email para senha válida com email inválido", () => {
    const errors = validateLoginForm("invalido", "senha12345");
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeUndefined();
  });
});

// ─── validateSignupForm ───────────────────────────────────────────────────────
describe("validateSignupForm", () => {
  it("retorna erros para formulário completamente vazio", () => {
    const errors = validateSignupForm("", "", "");
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it("não retorna erros para formulário totalmente válido", () => {
    const errors = validateSignupForm(
      "João Silva",
      "joao@email.com",
      "Senha12345!"
    );
    expect(errors.name).toBeUndefined();
    expect(errors.email).toBeUndefined();
    expect(errors.password).toBeUndefined();
  });
});

// ─── hasNoErrors ──────────────────────────────────────────────────────────────
describe("hasNoErrors", () => {
  it("retorna true quando todos os valores são undefined", () => {
    expect(hasNoErrors({ name: undefined, email: undefined, password: undefined })).toBe(true);
  });

  it("retorna true para objeto vazio", () => {
    expect(hasNoErrors({})).toBe(true);
  });

  it("retorna false quando há pelo menos um erro", () => {
    expect(hasNoErrors({ email: "E-mail inválido" })).toBe(false);
  });

  it("retorna false quando há múltiplos erros", () => {
    expect(
      hasNoErrors({ name: "Nome obrigatório", email: "E-mail inválido" })
    ).toBe(false);
  });
});
