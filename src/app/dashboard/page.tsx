import { DepositForm } from '@/components/deposit-form';
import { ProductCard } from '@/components/product-card';
import { Card, Shell, Stat } from '@/components/ui';
import { activeProducts } from '@/lib/products';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const stats = [
  ['Wallet Balance', 'UGX 0'],
  ['Pending Deposits', '0'],
  ['Pending Withdrawals', '0'],
  ['Active Investments', '0'],
  ['Completed Investments', '0'],
  ['Referral Earnings', 'UGX 0'],
];

async function activePaymentDestination() {
  const paymentNumber = await prisma.paymentNumber.findFirst({
    orderBy: { id: 'asc' },
    where: { active: true },
  });

  return paymentNumber ? {
    instructions: paymentNumber.instructions,
    network: paymentNumber.network,
    phone: paymentNumber.phone,
  } : null;
}

export default async function Dashboard() {
  const [products, destination] = await Promise.all([activeProducts(), activePaymentDestination()]);

  return (
    <Shell>
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-4xl font-black">Investor Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(([label, value]) => <Stat key={label} label={label} value={value} />)}
        </div>

        <section className="mt-8">
          <Card>
            <div className="mb-5">
              <p className="text-[#23c483]">Recharge / Deposit</p>
              <h2 className="mt-2 text-3xl font-black">Manual deposit request</h2>
              <p className="mt-3 text-slate-300">Send funds to the configured payment destination, then submit your transfer details for admin approval.</p>
            </div>
            <DepositForm destination={destination} />
          </Card>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[#23c483]">Available products</p>
              <h2 className="mt-2 text-3xl font-black">Invest from your dashboard</h2>
            </div>
          </div>
          {products.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <Card>
              <h3 className="text-2xl font-bold">No active products yet</h3>
              <p className="mt-3 text-slate-300">When an admin publishes investment products, they will be shown here.</p>
            </Card>
          )}
        </section>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card><h2 className="text-2xl font-bold">Transaction History</h2><p className="mt-3 text-slate-300">Deposits, withdrawals, investment debits, returns, and referral rewards appear here.</p></Card>
          <Card><h2 className="text-2xl font-bold">AI Assistant</h2><p className="mt-3 text-slate-300">Ask account, navigation, investment education, FAQ, and support questions.</p></Card>
        </div>
      </div>
    </Shell>
  );
}
