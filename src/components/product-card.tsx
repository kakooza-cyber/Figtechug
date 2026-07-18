import Link from 'next/link';
import { Card } from '@/components/ui';

export type ProductCardProduct = {
  id: string;
  name: string;
  description: string;
  minInvestment: string | number;
  maxInvestment: string | number;
  durationDays: number;
  riskDisclosure: string;
};

function money(value: string | number) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `UGX ${value}`;
  return new Intl.NumberFormat('en-UG', { currency: 'UGX', maximumFractionDigits: 0, style: 'currency' }).format(amount);
}

export function ProductCard({ product }: { product: ProductCardProduct }) {
  return (
    <Card className="flex h-full flex-col gap-5">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#23c483]">Investment product</p>
        <h3 className="mt-3 text-2xl font-black">{product.name}</h3>
        <p className="mt-3 text-slate-300">{product.description}</p>
      </div>

      <dl className="grid gap-3 rounded-2xl bg-white/5 p-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-slate-400">Minimum</dt>
          <dd className="font-bold text-white">{money(product.minInvestment)}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Maximum</dt>
          <dd className="font-bold text-white">{money(product.maxInvestment)}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Duration</dt>
          <dd className="font-bold text-white">{product.durationDays} days</dd>
        </div>
      </dl>

      <p className="text-sm text-slate-400">{product.riskDisclosure}</p>
      <Link className="mt-auto rounded-full border border-white/20 px-5 py-3 text-center font-bold transition hover:border-[#d7a83f] hover:text-[#d7a83f]" href="/register">
        Start investing
      </Link>
    </Card>
  );
}
