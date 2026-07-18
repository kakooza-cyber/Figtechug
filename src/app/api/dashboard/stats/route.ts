import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust this to match where your prisma client is initialized

export async function GET(request: Request) {
  try {
    // For production, extract your authenticated user's ID here from your active auth system (e.g., Supabase cookies)
    // For now, we fetch a fallback record to prevent crashing during build setup
    const firstUser = await prisma.user.findFirst({
      include: { wallet: true }
    }) as any;

    if (!firstUser) {
      return NextResponse.json({
        walletBalance: 'UGX 0',
        pendingDeposits: '0',
        pendingWithdrawals: '0',
        activeInvestments: '0',
        completedInvestments: '0',
        referralEarnings: 'UGX 0',
      });
    }

    const userId = firstUser.id;

    // Fetch precise balance mapping fields from your schema
    const wallet = firstUser.wallet;
    const walletBalance = wallet ? `UGX ${Number(wallet.available || 0).toLocaleString()}` : 'UGX 0';

    const pendingDeposits = await prisma.deposit.count({
      where: { userId, status: 'PENDING' },
    }) as any;

    const pendingWithdrawals = await prisma.withdrawal.count({
      where: { userId, status: 'PENDING' },
    }) as any;

    const activeInvestments = await prisma.investment.count({
      where: { userId, status: 'ACTIVE' },
    }) as any;

    const completedInvestments = await prisma.investment.count({
      where: { userId, status: 'COMPLETED' },
    }) as any;

    const rewards = await prisma.referralReward.findMany({
      where: { userId, status: 'APPROVED' },
    }) as any[];
    
    const totalRewards = rewards.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const referralEarnings = `UGX ${totalRewards.toLocaleString()}`;

    return NextResponse.json({
      walletBalance,
      pendingDeposits: String(pendingDeposits),
      pendingWithdrawals: String(pendingWithdrawals),
      activeInvestments: String(activeInvestments),
      completedInvestments: String(completedInvestments),
      referralEarnings,
    });
  } catch (error) {
    console.error('Database stats error:', error);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
