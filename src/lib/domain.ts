import { z } from 'zod';
export const money = z.coerce.number().positive();
export function referralCode() { return `FIG${crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`; }
export function calculateReturn(principal: number, method: unknown) { const cfg = method as { type?: string; rate?: number; amount?: number }; if (cfg.type === 'fixed') return cfg.amount ?? 0; if (cfg.type === 'percentage') return principal * ((cfg.rate ?? 0) / 100); return 0; }
