import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { json, phoneSchema, signToken } from '@/lib/security';

const schema = z.object({
  phone: phoneSchema,
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const user = await prisma.user.findUnique({ where: { phone: body.phone } });

  if (!user || !await bcrypt.compare(body.password, user.passwordHash)) {
    return json({ error: 'Invalid credentials' }, 401);
  }

  const token = await signToken({ sub: user.id, role: user.role });
  const response = json({ token, user: { id: user.id, phone: user.phone, role: user.role } });
  response.cookies.set('token', token, { httpOnly: true, maxAge: body.rememberMe === false ? undefined : 60 * 60 * 24 * 7, path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  return response;
}
