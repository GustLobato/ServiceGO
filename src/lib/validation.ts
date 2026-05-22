/**
 * Funções de validação reutilizáveis
 * Centralizadas aqui para garantir consistência entre Login e Cadastro
 */

/** Regex de e-mail RFC 5322 simplificado — mais robusto que \S+@\S+\.\S+ */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

/** Comprimento mínimo de senha — DEVE ser o mesmo em login e cadastro */
export const MIN_PASSWORD_LENGTH = 8;
export const MIN_NAME_LENGTH = 3;

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "E-mail é obrigatório";
  if (!EMAIL_REGEX.test(email)) return "E-mail inválido";
  return undefined;
}

export function validatePassword(
  password: string,
  label = "Senha"
): string | undefined {
  if (!password) return `${label} é obrigatória`;
  if (password.length < MIN_PASSWORD_LENGTH)
    return `Mínimo ${MIN_PASSWORD_LENGTH} caracteres`;
  return undefined;
}

export function validateName(name: string): string | undefined {
  if (!name.trim()) return "Nome é obrigatório";
  if (name.trim().length < MIN_NAME_LENGTH)
    return `Mínimo ${MIN_NAME_LENGTH} caracteres`;
  return undefined;
}

export function validateLoginForm(
  email: string,
  password: string
): ValidationErrors {
  return {
    email: validateEmail(email),
    password: validatePassword(password),
  };
}

export function validateSignupForm(
  name: string,
  email: string,
  password: string
): ValidationErrors {
  return {
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password),
  };
}

/** Retorna true se o objeto não tiver nenhum erro definido */
export function hasNoErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).every((v) => v === undefined);
}
