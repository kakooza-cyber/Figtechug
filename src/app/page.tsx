import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { Button, Card, Shell, Stat } from '@/components/ui';
import { activeProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await activeProducts();

  return (
    <Shell>
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_.8fr]">
        <div className="py-10">
          <p className="text-[#23c483]">Modern • Secure • Mobile first</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-7xl">Premium investment management for growing communities.</h1>
          <p className="mt-6 max-w-2xl text-slate-300">Manual deposits, configurable products, multi-level referrals, admin approvals, notifications, and extensible wallet architecture ready for Supabase and Vercel.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/register"><Button>Create account</Button></Link>
            <Link className="rounded-full border border-white/20 px-5 py-3" href="/products">View products</Link>
          </div>
        </div>
        <Card className="grid gap-4">
          <Stat label="Wallet architecture" value="Gateway-ready" />
          <Stat label="Referral levels" value="Configurable" />
          <Stat label="Active products" value={String(products.length)} />
        </Card>
      </section>

      <section className="mx-auto mt-12 max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[#23c483]">Live opportunities</p>
            <h2 className="mt-2 text-3xl font-black">Investment products</h2>
          </div>
          <Link className="text-sm font-bold text-[#d7a83f]" href="/products">See all products</Link>
        </div>
        {products.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <Card>
            <h3 className="text-2xl font-bold">No active products yet</h3>
            <p className="mt-3 text-slate-300">Admin-created active investment products will appear here automatically.</p>
          </Card>
        )}
      </section>
    </Shell>
  );
}
