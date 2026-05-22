import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database (idempotent)...');

  const hashedPassword = await bcrypt.hash('senha123', 12);

  // Upsert users (keyed on unique email)
  const client = await prisma.user.upsert({
    where: { email: 'joao@example.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'joao@example.com',
      password: hashedPassword,
      role: 'client',
      phone: '(11) 99999-1111',
    },
  });

  const provider = await prisma.user.upsert({
    where: { email: 'maria@example.com' },
    update: {},
    create: {
      name: 'Maria Santos',
      email: 'maria@example.com',
      password: hashedPassword,
      role: 'provider',
      phone: '(11) 99999-2222',
      bio: 'Especialista em limpeza residencial com 5 anos de experiência.',
    },
  });

  // Upsert listing — use a deterministic ID so we can upsert
  const LISTING_ID = 'seed-listing-001';
  const listing = await prisma.listing.upsert({
    where: { id: LISTING_ID },
    update: {},
    create: {
      id: LISTING_ID,
      title: 'Limpeza Residencial Completa',
      description:
        'Serviço completo de limpeza para sua casa. Inclui todos os cômodos, organização e produto de limpeza incluso.',
      category: 'Limpeza',
      price: 150,
      priceType: 'fixed',
      location: 'São Paulo, SP',
      providerId: provider.id,
    },
  });

  // Upsert request
  const REQUEST_ID = 'seed-request-001';
  const request = await prisma.request.upsert({
    where: { id: REQUEST_ID },
    update: {},
    create: {
      id: REQUEST_ID,
      clientId: client.id,
      listingId: listing.id,
      message: 'Preciso de limpeza para sábado de manhã.',
      status: 'completed',
      price: 150,
    },
  });

  // Upsert review (requestId is @unique, so we can use it)
  const REVIEW_ID = 'seed-review-001';
  const review = await prisma.review.upsert({
    where: { id: REVIEW_ID },
    update: {},
    create: {
      id: REVIEW_ID,
      clientId: client.id,
      listingId: listing.id,
      requestId: request.id,
      rating: 5,
      comment: 'Serviço excelente! Muito caprichoso.',
    },
  });

  // Update listing rating
  await prisma.listing.update({
    where: { id: listing.id },
    data: { rating: 5, reviewCount: 1 },
  });

  console.log('✅ Seed concluído!');
  console.log(`   👤 Client: ${client.email} / senha123`);
  console.log(`   👤 Provider: ${provider.email} / senha123`);
  console.log(`   📦 Listing: ${listing.title}`);
  console.log(`   📋 Request: ${request.id}`);
  console.log(`   ⭐ Review: ${review.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
