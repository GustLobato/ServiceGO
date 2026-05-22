/**
 * Utilitário de hash de senha usando Web Crypto API (SHA-256)
 * Substitui armazenamento em plaintext no localStorage.
 *
 * NOTA: Para produção, o hash deve ser feito no servidor com bcrypt/argon2.
 * Este módulo é adequado apenas para ambientes de mock/demo.
 */

const SALT = "servicego_salt_v1_2026";

/**
 * Gera um hash SHA-256 da senha concatenada com o salt.
 * Retorna a representação hexadecimal.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + SALT);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Verifica se a senha corresponde ao hash armazenado.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === storedHash;
}
