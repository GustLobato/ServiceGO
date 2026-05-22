import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Limpa dados existentes
  await prisma.review.deleteMany();
  await prisma.request.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Cria usuários
  const [client, provider] = await Promise.all([
    prisma.user.create({
      data: {
        name: 'João Silva',
        email: 'joao@example.com',
        password: await bcrypt.hash('senha123', 12),
        role: 'client',
        phone: '(11) 99999-1111',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Maria Santos',
        email: 'maria@example.com',
        password: await bcrypt.hash('senha123', 12),
        role: 'provider',
        phone: '(11) 99999-2222',
        bio: 'Especialista em limpeza residencial com 5 anos de experiência.',
      },
    }),
  ]);

  // Cria listings
  const listing = await prisma.listing.create({
    data: {
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

  // Cria request
  const request = await prisma.request.create({
    data: {
      clientId: client.id,
      listingId: listing.id,
      message: 'Preciso de limpeza para sábado de manhã.',
      status: 'completed',
      price: 150,
    },
  });

  // Cria review
  const review = await prisma.review.create({
    data: {
      clientId: client.id,
      listingId: listing.id,
      requestId: request.id,
      rating: 5,
      comment: 'Serviço excelente! Muito caprichoso.',
    },
  });

  // Atualiza rating do listing
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
