import { ProductCard } from '@/components/product-card';
import { Card, Shell } from '@/components/ui';
import { activeProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const products = await activeProducts();

  return (
    <Shell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-[#23c483]">Products</p>
          <h1 className="mt-3 text-4xl font-black sm:text-6xl">Choose an active investment product.</h1>
          <p className="mt-4 max-w-3xl text-slate-300">These products are loaded from the database and only include active products configured by administrators.</p>
        </div>
        {products.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <Card>
            <h2 className="text-2xl font-bold">No active products available</h2>
            <p className="mt-3 text-slate-300">Please check back after the admin team publishes investment products.</p>
          </Card>
        )}
      </div>
    </Shell>
  );
}
