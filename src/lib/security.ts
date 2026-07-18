import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');
export const phoneSchema = z.string().min(8).max(20).regex(/^\+?[0-9]+$/);
export async function signToken(payload: { sub: string; role: string }) { return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret); }
export async function currentUser(req: NextRequest) { const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', ''); if (!token) return null; try { return (await jwtVerify(token, secret)).payload as { sub: string; role: string }; } catch { return null; } }
export function json(data: unknown, status = 200) { const res = NextResponse.json(data, { status }); res.headers.set('X-Content-Type-Options', 'nosniff'); res.headers.set('X-Frame-Options', 'DENY'); res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); return res; }
export function requireCsrf(req: NextRequest) { return req.method === 'GET' || req.headers.get('x-csrf-token') === req.cookies.get('csrf')?.value || process.env.NODE_ENV !== 'production'; }
