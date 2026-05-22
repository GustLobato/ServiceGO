import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/error.middleware.js';
import type { UpdateProfileInput } from './users.schema.js';

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      _count: { select: { listings: true, requests: true } },
    },
  });
  if (!user) throw new AppError(404, 'Usuário não encontrado');
  return user;
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: input,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
  return user;
}
