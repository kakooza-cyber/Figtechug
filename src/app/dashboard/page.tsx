'use client';

import { useEffect, useState } from 'react';
import { Card, Shell, Stat } from '@/components/ui';

export default function Dashboard() {
  const [statsData, setStatsData] = useState<any>({
    walletBalance: 'UGX 0',
    pendingDeposits: '0',
    pendingWithdrawals: '0',
    activeInvestments: '0',
    completedInvestments: '0',
    referralEarnings: 'UGX 0',
  });

    useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStatsData(data);
        }
      } catch (error) {
        console.error('Failed loading stats:', error);
      }
    }
    fetchStats();
  }, []); // <-- Changed '} join [], []);' to '}, []);'


  const stats = [
    ['Wallet Balance', statsData.walletBalance],
    ['Pending Deposits', statsData.pendingDeposits],
    ['Pending Withdrawals', statsData.pendingWithdrawals],
    ['Active Investments', statsData.activeInvestments],
    ['Completed Investments', statsData.completedInvestments],
    ['Referral Earnings', statsData.referralEarnings],
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
