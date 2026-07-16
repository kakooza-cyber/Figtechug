import { NextRequest } from 'next/server'; import { prisma } from '@/lib/prisma'; import { currentUser, json } from '@/lib/security';
export async function GET(req:NextRequest){const user=await currentUser(req); if(!user)return json({error:'Unauthorized'},401); return json(await prisma.notification.findMany({where:{OR:[{userId:user.sub},{userId:null}]},orderBy:{createdAt:'desc'}}))}
