import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/error.middleware.js';
import type { CreateRequestInput, UpdateRequestStatusInput } from './requests.schema.js';

export async function createRequest(clientId: string, input: CreateRequestInput) {
  const listing = await prisma.listing.findUnique({ where: { id: input.listingId } });
  if (!listing || !listing.isActive) throw new AppError(404, 'Serviço não encontrado ou inativo');
  if (listing.providerId === clientId) throw new AppError(400, 'Não pode solicitar o próprio serviço');

  return prisma.request.create({
    data: {
      clientId,
      listingId: input.listingId,
      message: input.message,
      scheduledAt: input.scheduledAt,
      price: listing.price,
    },
    include: { listing: { select: { title: true, price: true } } },
  });
}

export async function getMyRequests(userId: string, role: string) {
  if (role === 'client') {
    return prisma.request.findMany({
      where: { clientId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            category: true,
            price: true,
            location: true,
            imageUrl: true,
            rating: true,
            reviewCount: true,
            provider: { select: { name: true, phone: true, avatarUrl: true } },
          },
        },
      },
    });
  }

  // provider vê as requests dos seus listings
  return prisma.request.findMany({
    where: { listing: { providerId: userId } },
    orderBy: { createdAt: 'desc' },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          category: true,
          price: true,
          location: true,
          rating: true,
          reviewCount: true,
          provider: { select: { name: true, phone: true, avatarUrl: true } },
        },
      },
      client: { select: { id: true, name: true, phone: true, avatarUrl: true } },
    },
  });
}

export async function updateRequestStatus(
  requestId: string,
  userId: string,
  role: string,
  input: UpdateRequestStatusInput,
) {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { listing: true },
  });
  if (!request) throw new AppError(404, 'Solicitação não encontrada');

  const isProvider = role === 'provider' && request.listing.providerId === userId;
  const isClient = role === 'client' && request.clientId === userId;

  if (!isProvider && !isClient) throw new AppError(403, 'Sem permissão');

  // Clients can only cancel
  if (isClient && input.status !== 'cancelled') {
    throw new AppError(400, 'Clientes só podem cancelar solicitações');
  }

  return prisma.request.update({ where: { id: requestId }, data: { status: input.status } });
}
