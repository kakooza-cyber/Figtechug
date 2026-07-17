'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Shell } from '@/components/ui';

export default function Page() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referredByCode, setReferredByCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone, 
          password, 
          referredByCode 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Automatically redirect to login page after successful signup
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className="mx-auto max-w-md w-full my-12 px-4">
        <Card>
          <h1 className="text-4xl font-black capitalize text-white">register</h1>
          <p className="mt-2 text-slate-300 text-sm mb-6">
            Figtechug register experience with responsive glass cards, dark mode, and secure entry.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 text-sm rounded-lg">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="e.g., +256700000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/80 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/80 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter code if referred"
                value={referredByCode}
                onChange={(e) => setReferredByCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/80 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <a href="/login" className="text-amber-400 hover:underline">
              Login here
            </a>
          </p>
        </Card>
      </div>
    </Shell>
  );
}
