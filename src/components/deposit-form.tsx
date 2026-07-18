'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type PaymentDestination = {
  network: string;
  phone: string;
  instructions: string;
} | null;

type DepositResponse = {
  error?: string;
};

export function DepositForm({ destination }: { destination: PaymentDestination }) {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [network, setNetwork] = useState(destination?.network || 'Mobile Money');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, senderPhone, transactionId, network }),
      });
      const data = (await response.json()) as DepositResponse;

      if (!response.ok) throw new Error(data.error || 'Could not submit your deposit request.');

      setAmount('');
      setSenderPhone('');
      setTransactionId('');
      setMessage('Deposit submitted for admin review. Your wallet will update after approval.');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not submit your deposit request.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-3xl border border-[#d7a83f]/30 bg-[#d7a83f]/10 p-5">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d7a83f]">Send funds to</p>
        {destination ? (
          <div className="mt-4 space-y-3">
            <p className="text-3xl font-black">{destination.phone}</p>
            <p className="text-slate-200">Network / Bank: {destination.network}</p>
            <p className="text-sm text-slate-300">{destination.instructions}</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-3xl font-black">Payment number pending</p>
            <p className="text-sm text-slate-300">An admin has not configured an active bank account or mobile money number yet. Please contact support before sending funds.</p>
          </div>
        )}
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Amount sent UGX
          <input className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none focus:border-[#d7a83f]" min="1" onChange={(event) => setAmount(event.target.value)} placeholder="50000" required type="number" value={amount} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Sender phone number or name
          <input className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none focus:border-[#d7a83f]" onChange={(event) => setSenderPhone(event.target.value)} placeholder="+256700000000 or Jane Doe" required value={senderPhone} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Network / Bank used
          <input className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none focus:border-[#d7a83f]" onChange={(event) => setNetwork(event.target.value)} required value={network} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Transaction reference ID
          <input className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none focus:border-[#d7a83f]" onChange={(event) => setTransactionId(event.target.value)} placeholder="MTN123456789" required value={transactionId} />
        </label>
        {message ? <p className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</p> : null}
        {error ? <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}
        <button className="rounded-full bg-[#d7a83f] px-6 py-4 font-black text-[#071b3a] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting || !destination} type="submit">
          {isSubmitting ? 'Submitting…' : 'Submit deposit for review'}
        </button>
      </form>
    </div>
  );
}
