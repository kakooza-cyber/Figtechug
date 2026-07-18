import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { currentUser, json } from '@/lib/security';

const schema = z.object({ action: z.enum(['APPROVE', 'REJECT']) });

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  const user = await currentUser(req);
  if (user?.role !== 'ADMIN') return json({ error: 'Forbidden' }, 403);

  const { id } = await context.params;
  const { action } = schema.parse(await req.json());

  const deposit = await prisma.$transaction(async (tx) => {
    const pending = await tx.deposit.findUnique({ where: { id } });
    if (!pending) throw new Error('DEPOSIT_NOT_FOUND');
    if (pending.status !== 'PENDING') throw new Error('DEPOSIT_ALREADY_REVIEWED');

    const updated = await tx.deposit.update({
      data: { reviewedAt: new Date(), status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' },
      where: { id },
    });

    if (action === 'APPROVE') {
      const wallet = await tx.wallet.upsert({
        create: { available: pending.amount, userId: pending.userId },
        update: { available: { increment: pending.amount } },
        where: { userId: pending.userId },
      });

      await tx.walletTransaction.create({
        data: {
          amount: pending.amount,
          metadata: { depositId: pending.id, transactionId: pending.transactionId },
          reference: pending.id,
          status: 'APPROVED',
          type: 'DEPOSIT_APPROVAL',
          walletId: wallet.id,
        },
      });
    }

    return updated;
  });

  return json(deposit);
}
