'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'register';

type AuthResponse = {
  token?: string;
  user?: {
    role?: string;
  };
  error?: string;
};

function persistToken(token?: string) {
  if (!token) return;
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
  window.localStorage.setItem('figtechug_token', token);
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === 'register';

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const payload = isRegister
      ? { phone, password, referralCode: referralCode || undefined }
      : { phone, password, rememberMe };

    try {
      const response = await fetch(isRegister ? '/api/auth/register' : '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as AuthResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your details and try again.');
      }

      persistToken(data.token);
      router.push(data.user?.role === 'ADMIN' ? '/admin' : '/dashboard');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 grid gap-5" onSubmit={onSubmit}>
      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        Phone number
        <input
          className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-400 focus:border-[#d7a83f]"
          inputMode="tel"
          name="phone"
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+256700000000"
          required
          type="tel"
          value={phone}
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        Password
        <input
          className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-400 focus:border-[#d7a83f]"
          minLength={isRegister ? 8 : 1}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder={isRegister ? 'Create at least 8 characters' : 'Enter your password'}
          required
          type="password"
          value={password}
        />
      </label>

      {isRegister ? (
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Referral code <span className="font-normal text-slate-400">Optional</span>
          <input
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base uppercase text-white outline-none transition placeholder:text-slate-400 focus:border-[#d7a83f]"
            name="referralCode"
            onChange={(event) => setReferralCode(event.target.value.toUpperCase())}
            placeholder="FIGABC123"
            value={referralCode}
          />
        </label>
      ) : (
        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            checked={rememberMe}
            className="h-4 w-4 accent-[#d7a83f]"
            onChange={(event) => setRememberMe(event.target.checked)}
            type="checkbox"
          />
          Keep me signed in on this device
        </label>
      )}

      {error ? <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}

      <button
        className="rounded-full bg-[#d7a83f] px-6 py-4 font-black text-[#071b3a] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
      </button>
    </form>
  );
}
