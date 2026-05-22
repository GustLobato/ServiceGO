import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/error.middleware.js';
import type { CreateListingInput, UpdateListingInput, ListingQuery } from './listings.schema.js';

export async function getListings(query: ListingQuery) {
  const { category, search, minPrice, maxPrice, page, limit } = query;
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
    ...(category && { category }),
    ...(search && {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
      ],
    }),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        }
      : {}),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        provider: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return { listings, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function getListingById(id: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      provider: { select: { id: true, name: true, avatarUrl: true, bio: true } },
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { client: { select: { id: true, name: true, avatarUrl: true } } },
      },
    },
  });
  if (!listing) throw new AppError(404, 'Serviço não encontrado');
  return listing;
}

export async function createListing(providerId: string, input: CreateListingInput) {
  return prisma.listing.create({
    data: { ...input, providerId },
  });
}

export async function updateListing(id: string, providerId: string, input: UpdateListingInput) {
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) throw new AppError(404, 'Serviço não encontrado');
  if (listing.providerId !== providerId) throw new AppError(403, 'Sem permissão');

  return prisma.listing.update({ where: { id }, data: input });
}

export async function deleteListing(id: string, providerId: string) {
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) throw new AppError(404, 'Serviço não encontrado');
  if (listing.providerId !== providerId) throw new AppError(403, 'Sem permissão');

  await prisma.listing.delete({ where: { id } });
}

export async function getMyListings(providerId: string) {
  return prisma.listing.findMany({
    where: { providerId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { requests: true, reviews: true } } },
  });
}
