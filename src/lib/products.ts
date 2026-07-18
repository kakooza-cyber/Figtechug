import { prisma } from '@/lib/prisma';
import type { ProductCardProduct } from '@/components/product-card';

export async function activeProducts(): Promise<ProductCardProduct[]> {
  const products = await prisma.investmentProduct.findMany({
    orderBy: { createdAt: 'desc' },
    where: { status: 'ACTIVE' },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    minInvestment: product.minInvestment.toString(),
    maxInvestment: product.maxInvestment.toString(),
    durationDays: product.durationDays,
    riskDisclosure: product.riskDisclosure,
  }));
}
