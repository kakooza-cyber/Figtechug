import { NextRequest } from 'next/server';
import { z } from 'zod';
import { money } from '@/lib/domain';
import { prisma } from '@/lib/prisma';
import { currentUser, json } from '@/lib/security';

const schema = z.object({
  amount: money,
  senderPhone: z.string().min(2).max(80),
  transactionId: z.string().min(3).max(120),
  network: z.string().min(2).max(40),
  screenshotUrl: z.string().url().optional().or(z.literal('')),
});

export async function GET(req: NextRequest) {
  const user = await currentUser(req);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  return json(await prisma.deposit.findMany({ where: { userId: user.sub }, orderBy: { createdAt: 'desc' } }));
}

export async function POST(req: NextRequest) {
  const user = await currentUser(req);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const body = schema.parse(await req.json());
  const deposit = await prisma.deposit.create({
    data: {
      userId: user.sub,
      amount: body.amount,
      senderPhone: body.senderPhone,
      transactionId: body.transactionId,
      network: body.network,
      screenshotUrl: body.screenshotUrl || undefined,
    },
  });

  return json(deposit, 201);
}
