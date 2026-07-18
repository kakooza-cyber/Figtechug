import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { json, phoneSchema, signToken } from '@/lib/security';
import { referralCode } from '@/lib/domain';

const WELCOME_BONUS_UGX = 7000;

const schema = z.object({
  phone: phoneSchema,
  password: z.string().min(8),
  confirmPassword: z.string().optional(),
  referralCode: z.string().optional(),
}).refine((data) => !data.confirmPassword || data.password === data.confirmPassword, { message: 'Passwords must match' });

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const ref = body.referralCode ? await prisma.user.findUnique({ where: { referralCode: body.referralCode } }) : null;
  const user = await prisma.user.create({
    data: {
      phone: body.phone,
      passwordHash: await bcrypt.hash(body.password, 12),
      referralCode: referralCode(),
      referredById: ref?.id,
      wallet: {
        create: {
          available: WELCOME_BONUS_UGX,
          transactions: {
            create: {
              amount: WELCOME_BONUS_UGX,
              metadata: { reason: 'New user welcome bonus' },
              reference: 'WELCOME_BONUS',
              status: 'APPROVED',
              type: 'WELCOME_BONUS',
            },
          },
        },
      },
    },
  });
  const token = await signToken({ sub: user.id, role: user.role });
  const response = json({ token, user: { id: user.id, phone: user.phone, referralCode: user.referralCode, role: user.role } }, 201);
  response.cookies.set('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  return response;
}
