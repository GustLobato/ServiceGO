import { z } from 'zod';

const COMMON_PASSWORDS = [
  'senha123', '12345678', 'password', 'admin123', 'qwerty123',
  '123456789', 'password1', 'iloveyou', 'abc123456', 'monkey123',
];

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter ao menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter ao menos um número')
    .regex(/[^A-Za-z0-9]/, 'A senha deve conter ao menos um caractere especial')
    .refine(
      (p) => !COMMON_PASSWORDS.includes(p.toLowerCase()),
      'Senha muito comum, escolha uma mais segura'
    ),
  role: z.enum(['client', 'provider']).default('client'),
  phone: z.string().optional(),
}).refine(
  (data) => data.password.toLowerCase() !== data.email.toLowerCase(),
  { message: 'A senha não pode ser igual ao e-mail', path: ['password'] }
);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
