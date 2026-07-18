import Link from 'next/link';
import { AuthForm } from '@/components/auth-forms';
import { Card, Shell } from '@/components/ui';

export default function Page() {
  return (
    <Shell>
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="py-4">
          <p className="text-[#23c483]">Join Figtechug</p>
          <h1 className="mt-4 text-4xl font-black sm:text-6xl">Create your investor account.</h1>
          <p className="mt-5 text-lg text-slate-300">
            Register with your phone number, secure password, and optional referral code to open your wallet and start tracking investment products.
          </p>
        </div>

        <Card>
          <h2 className="text-3xl font-black">Register</h2>
          <p className="mt-3 text-slate-300">Your account is created instantly and linked to a wallet for deposits, investments, and withdrawals.</p>
          <AuthForm mode="register" />
          <p className="mt-6 text-center text-sm text-slate-300">
            Already have an account? <Link className="font-bold text-[#d7a83f]" href="/login">Sign in</Link>
          </p>
        </Card>
      </div>
    </Shell>
  );
}
