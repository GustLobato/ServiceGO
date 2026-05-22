import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/error.middleware.js';
import type { CreateReviewInput } from './reviews.schema.js';

export async function createReview(clientId: string, input: CreateReviewInput) {
  // Verifica que o request existe, pertence ao cliente e está concluído
  const request = await prisma.request.findUnique({
    where: { id: input.requestId },
    include: { review: true },
  });

  if (!request) throw new AppError(404, 'Solicitação não encontrada');
  if (request.clientId !== clientId) throw new AppError(403, 'Sem permissão');
  if (request.status !== 'completed') throw new AppError(400, 'Só é possível avaliar serviços concluídos');
  if (request.review) throw new AppError(400, 'Você já avaliou este serviço');

  const review = await prisma.review.create({
    data: {
      clientId,
      listingId: request.listingId,
      requestId: input.requestId,
      rating: input.rating,
      comment: input.comment,
    },
  });

  // Recalcula rating médio do listing
  const agg = await prisma.review.aggregate({
    where: { listingId: request.listingId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.listing.update({
    where: { id: request.listingId },
    data: {
      rating: agg._avg.rating ?? 0,
      reviewCount: agg._count.rating,
    },
  });

  return review;
}

export async function getListingReviews(listingId: string) {
  return prisma.review.findMany({
    where: { listingId },
    orderBy: { createdAt: 'desc' },
    include: {
      client: { select: { id: true, name: true, avatarUrl: true } },
    },
  });
}
