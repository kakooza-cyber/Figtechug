import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});
async function main() {
  const admin = await prisma.user.upsert({ where: { phone: '+256700000000' }, update: {}, create: { phone: '+256700000000', passwordHash: await bcrypt.hash('AdminPass123!', 12), role: 'ADMIN', referralCode: 'ADMIN001', wallet: { create: {} } } });
  await prisma.setting.upsert({ where: { key: 'platform' }, update: {}, create: { key: 'platform', value: { name: 'Figtechug', minimumWithdrawal: 10000, maintenanceMode: false, supportPhone: '+256700000000' } } });
  await prisma.paymentNumber.upsert({ where: { id: 'seed-momo' }, update: {}, create: { id: 'seed-momo', network: 'MTN MoMo', phone: '+256700000001', instructions: 'Send funds then submit your transaction ID for approval.' } });
  await prisma.investmentProduct.create({ data: { name: 'Balanced Growth', description: 'Configurable short-term investment product for demonstration.', minInvestment: 50000, maxInvestment: 5000000, durationDays: 90, returnMethod: { type: 'percentage', rate: 12 }, riskDisclosure: 'All investments carry risk. Returns are configured by administrators.', status: 'ACTIVE' } });
  console.log(`Seeded admin ${admin.phone}`);
}
main().finally(() => prisma.$disconnect());
