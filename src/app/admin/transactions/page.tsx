import { AdminDepositActions } from '@/components/admin-deposit-actions';
import { Card, Shell } from '@/components/ui';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function money(value: { toString(): string }) {
  const amount = Number(value.toString());
  if (!Number.isFinite(amount)) return `UGX ${value.toString()}`;
  return new Intl.NumberFormat('en-UG', { currency: 'UGX', maximumFractionDigits: 0, style: 'currency' }).format(amount);
}

export default async function AdminTransactions() {
  const deposits = await prisma.deposit.findMany({
    include: { user: { select: { phone: true } } },
    orderBy: { createdAt: 'asc' },
    where: { status: 'PENDING' },
  });

  return (
    <Shell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-[#23c483]">Admin approvals</p>
          <h1 className="mt-2 text-4xl font-black">Pending deposits</h1>
          <p className="mt-3 text-slate-300">Approving a deposit credits the investor wallet in the same database transaction that marks the deposit approved.</p>
        </div>

        <Card className="overflow-hidden">
          {deposits.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead className="text-slate-300">
                  <tr className="border-b border-white/10">
                    <th className="py-3 pr-4">Investor</th>
                    <th className="py-3 pr-4">Amount</th>
                    <th className="py-3 pr-4">Sender</th>
                    <th className="py-3 pr-4">Network</th>
                    <th className="py-3 pr-4">Reference</th>
                    <th className="py-3 pr-4">Submitted</th>
                    <th className="py-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit) => (
                    <tr className="border-b border-white/5 align-top" key={deposit.id}>
                      <td className="py-4 pr-4 font-semibold">{deposit.user.phone}</td>
                      <td className="py-4 pr-4 font-bold text-[#d7a83f]">{money(deposit.amount)}</td>
                      <td className="py-4 pr-4">{deposit.senderPhone}</td>
                      <td className="py-4 pr-4">{deposit.network}</td>
                      <td className="py-4 pr-4 font-mono text-xs">{deposit.transactionId}</td>
                      <td className="py-4 pr-4">{deposit.createdAt.toLocaleString('en-UG')}</td>
                      <td className="py-4 pr-4"><AdminDepositActions depositId={deposit.id} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4">
              <h2 className="text-2xl font-bold">No pending deposits</h2>
              <p className="mt-3 text-slate-300">Manual deposit requests submitted by investors will appear here for approval.</p>
            </div>
          )}
        </Card>
      </div>
    </Shell>
  );
}
