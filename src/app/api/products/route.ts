import { NextRequest } from 'next/server'; import { prisma } from '@/lib/prisma'; import { currentUser, json } from '@/lib/security';
export async function GET(){return json(await prisma.investmentProduct.findMany({where:{status:'ACTIVE'},orderBy:{createdAt:'desc'}}))}
