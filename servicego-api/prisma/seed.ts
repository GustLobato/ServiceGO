import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPassword = await bcrypt.hash('ServiceGO@2026', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@servicego.com.br' },
    update: {},
    create: {
      name: 'Gustavo Gabriel',
      email: 'admin@servicego.com.br',
      password: adminPassword,
      role: 'admin',
    },
  });

  console.log('✅ Seed concluído!');
  console.log(`   👤 Admin: ${admin.email} (role: ${admin.role})`);
  console.log('   ⚠️  Altere a senha do admin após o primeiro acesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
