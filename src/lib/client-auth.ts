export type SessionUser = { id: string; phone: string; role: 'USER' | 'ADMIN'; referralCode?: string };
export type SessionPayload = { token: string; user: SessionUser };
const key = 'figtechug.session';
export function saveSession(session: SessionPayload, remember: boolean) { const storage = remember ? localStorage : sessionStorage; storage.setItem(key, JSON.stringify(session)); if (remember) sessionStorage.removeItem(key); else localStorage.removeItem(key); }
export function getSession(): SessionPayload | null { if (typeof window === 'undefined') return null; const raw = localStorage.getItem(key) ?? sessionStorage.getItem(key); if (!raw) return null; try { return JSON.parse(raw) as SessionPayload; } catch { return null; } }
export function authHeaders() { const session = getSession(); return session ? { Authorization: `Bearer ${session.token}` } : {}; }
export async function apiFetch<T>(path: string, init: RequestInit = {}) { const headers = new Headers(init.headers); headers.set('Content-Type', 'application/json'); const auth = authHeaders(); if ('Authorization' in auth) headers.set('Authorization', auth.Authorization); const res = await fetch(path, { ...init, headers }); const data = await res.json().catch(() => ({})); if (!res.ok) throw new Error(data.error ?? 'Request failed'); return data as T; }
export function clearSession() { localStorage.removeItem(key); sessionStorage.removeItem(key); }
