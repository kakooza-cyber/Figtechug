import Link from 'next/link';
import { Card, Shell } from '@/components/ui';

const modules = [
  ['User Management', 'Review investor accounts and profiles.', '/admin'],
  ['Investment Products', 'Create and publish products.', '/admin'],
  ['Deposit Management', 'Approve or reject pending manual deposits.', '/admin/transactions'],
  ['Withdrawal Management', 'Review withdrawal requests.', '/admin'],
  ['Wallet Management', 'Audit wallet balances and transactions.', '/admin'],
  ['Referral Management', 'Configure referral rewards.', '/admin'],
  ['Announcements', 'Publish platform updates.', '/admin'],
  ['Support Tickets', 'Respond to investor support requests.', '/admin'],
  ['Reports', 'Export operational reports.', '/admin'],
  ['Analytics', 'Review platform metrics.', '/admin'],
  ['Settings', 'Configure payment numbers and platform values.', '/admin'],
];

export default function Admin() {
  return (
    <Shell>
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-4xl font-black">Admin Panel</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map(([title, description, href]) => (
            <Link href={href} key={title}>
              <Card className="h-full transition hover:border-[#d7a83f]">
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="mt-2 text-sm text-slate-300">{description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
