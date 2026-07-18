import { Card, Shell, Stat } from '@/components/ui';
import { prisma } from '@/lib/prisma'; // Adjust this import path to match where your prisma client is initialized
import { getServerSession } from 'next-auth'; // Adjust if you use a different auth package like Supabase auth
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path based on your setup

export default async function Dashboard() {
  let walletBalance = 'UGX 0';
  let pendingDeposits = '0';
  let pendingWithdrawals = '0';
  let activeInvestments = '0';
  let completedInvestments = '0';
  let referralEarnings = 'UGX 0';

  try {
    // 1. Get the current logged-in user's session
    const session = await getServerSession(authOptions) as any;
    const userId = session?.user?.id;

    if (userId) {
      // 2. Fetch the wallet details (Available balance mapped from schema)
      const wallet = await prisma.wallet.findUnique({
        where: { userId },
      }) as any;

      if (wallet) {
        // Formatting Decimal to a readable currency string
        const availableAmount = Number(wallet.available || 0).toLocaleString();
        walletBalance = `UGX ${availableAmount}`;
      }

      // 3. Count Pending Deposits
      const depositCount = await prisma.deposit.count({
        where: { userId, status: 'PENDING' },
      }) as any;
      pendingDeposits = String(depositCount);

      // 4. Count Pending Withdrawals
      const withdrawalCount = await prisma.withdrawal.count({
        where: { userId, status: 'PENDING' },
      }) as any;
      pendingWithdrawals = String(withdrawalCount);

      // 5. Count Active Investments
      const activeInvCount = await prisma.investment.count({
        where: { userId, status: 'ACTIVE' },
      }) as any;
      activeInvestments = String(activeInvCount);

      // 6. Count Completed Investments
      const completedInvCount = await prisma.investment.count({
        where: { userId, status: 'COMPLETED' },
      }) as any;
      completedInvestments = String(completedInvCount);

      // 7. Calculate Referral Earnings
      const rewards = await prisma.referralReward.findMany({
        where: { userId, status: 'APPROVED' },
      }) as any[];
      
      const totalRewards = rewards.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      referralEarnings = `UGX ${totalRewards.toLocaleString()}`;
    }
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }

  const stats = [
    ['Wallet Balance', walletBalance],
    ['Pending Deposits', pendingDeposits],
    ['Pending Withdrawals', pendingWithdrawals],
    ['Active Investments', activeInvestments],
    ['Completed Investments', completedInvestments],
    ['Referral Earnings', referralEarnings],
  ];

  return (
    <Shell>
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-4xl font-black">Investor Dashboard</h1>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(([label, value]) => (
            <Stat key={label} label={label} value={value} />
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="text-2xl font-bold">Transaction History</h2>
            <p className="mt-3 text-slate-300">
              Deposits, withdrawals, investment debits, returns, and referral rewards appear here.
            </p>
          </Card>
          <Card>
            <h2 className="text-2xl font-bold">AI Assistant</h2>
            <p className="mt-3 text-slate-300">
              Ask account, navigation, investment education, FAQ, and support questions.
            </p>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
