'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Action = 'APPROVE' | 'REJECT';

type ApiResponse = {
  error?: string;
};

export function AdminDepositActions({ depositId }: { depositId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<Action | null>(null);
  const [error, setError] = useState('');

  async function review(action: Action) {
    setError('');
    setIsSubmitting(action);

    try {
      const response = await fetch(`/api/admin/deposits/${depositId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = (await response.json()) as ApiResponse;
      if (!response.ok) throw new Error(data.error || 'Unable to review deposit.');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to review deposit.');
    } finally {
      setIsSubmitting(null);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        <button className="rounded-full bg-[#23c483] px-4 py-2 text-sm font-bold text-[#071b3a] disabled:opacity-60" disabled={!!isSubmitting} onClick={() => review('APPROVE')} type="button">
          {isSubmitting === 'APPROVE' ? 'Approving…' : 'Approve'}
        </button>
        <button className="rounded-full border border-red-300/40 px-4 py-2 text-sm font-bold text-red-100 disabled:opacity-60" disabled={!!isSubmitting} onClick={() => review('REJECT')} type="button">
          {isSubmitting === 'REJECT' ? 'Rejecting…' : 'Reject'}
        </button>
      </div>
      {error ? <p className="text-xs text-red-200">{error}</p> : null}
    </div>
  );
}
