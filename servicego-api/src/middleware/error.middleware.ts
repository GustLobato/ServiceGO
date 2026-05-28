import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Erro de validação Zod
  if (err instanceof ZodError) {
    res.status(422).json({
      error: 'Dados inválidos',
      details: err.flatten().fieldErrors,
    });
    return;
  }

  // Erro de negócio (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Erro genérico
  const message =
    env.NODE_ENV === 'production'
      ? 'Erro interno do servidor'
      : err instanceof Error
        ? err.message
        : String(err);

  console.error('[Error]', err);
  res.status(500).json({ error: message });
}
