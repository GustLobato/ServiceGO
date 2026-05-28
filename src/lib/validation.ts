const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const COMMON_PASSWORDS = [
  'senha123', '12345678', 'password', 'admin123', 'qwerty123',
  '123456789', 'password1', 'iloveyou', 'abc123456', 'monkey123',
];

export const MIN_PASSWORD_LENGTH = 8;
export const MIN_NAME_LENGTH = 3;

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "E-mail é obrigatório";
  if (!EMAIL_REGEX.test(email)) return "E-mail inválido";
  return undefined;
}

export function validatePassword(
  password: string,
  label = "Senha",
  strict = false,
  email = ""
): string | undefined {
  if (!password) return `${label} é obrigatória`;
  if (password.length < MIN_PASSWORD_LENGTH)
    return `Mínimo ${MIN_PASSWORD_LENGTH} caracteres`;
  if (strict) {
    if (!/[A-Z]/.test(password)) return `${label} deve conter ao menos uma letra maiúscula`;
    if (!/[a-z]/.test(password)) return `${label} deve conter ao menos uma letra minúscula`;
    if (!/[0-9]/.test(password)) return `${label} deve conter ao menos um número`;
    if (!/[^A-Za-z0-9]/.test(password)) return `${label} deve conter ao menos um caractere especial`;
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) return "Senha muito comum, escolha uma mais segura";
    if (email && password.toLowerCase() === email.toLowerCase()) return "A senha não pode ser igual ao e-mail";
  }
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
  password: string,
  confirmPassword?: string
): ValidationErrors {
  const errors: ValidationErrors = {
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password, "Senha", true, email),
  };
  if (confirmPassword !== undefined) {
    if (!confirmPassword) {
      errors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
    }
  }
  return errors;
}

export function hasNoErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).every((v) => v === undefined);
}
