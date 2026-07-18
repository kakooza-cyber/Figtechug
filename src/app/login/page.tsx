import Link from 'next/link';
import { AuthForm } from '@/components/auth-forms';
import { Card, Shell } from '@/components/ui';

export default function Page() {
  return (
    <Shell>
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="py-4">
          <p className="text-[#23c483]">Welcome back</p>
          <h1 className="mt-4 text-4xl font-black sm:text-6xl">Sign in to your dashboard.</h1>
          <p className="mt-5 text-lg text-slate-300">
            Investors are routed to the dashboard, while admin users are redirected to the admin overview after authentication.
          </p>
        </div>

        <Card>
          <h2 className="text-3xl font-black">Login</h2>
          <p className="mt-3 text-slate-300">Use the phone number and password you registered with.</p>
          <AuthForm mode="login" />
          <p className="mt-6 text-center text-sm text-slate-300">
            New to Figtechug? <Link className="font-bold text-[#d7a83f]" href="/register">Create an account</Link>
          </p>
        </Card>
      </div>
    </Shell>
  );
}
