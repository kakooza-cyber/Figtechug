import Link from 'next/link';
import type { ReactNode } from 'react';
export function Shell({ children }: { children: ReactNode }) { return <main className="min-h-screen px-4 py-6 sm:px-8"><nav className="mx-auto mb-8 flex max-w-6xl items-center justify-between"><Link href="/" className="text-2xl font-black text-[#d7a83f]">Figtechug</Link><div className="hidden gap-5 md:flex"><Link href="/products">Products</Link><Link href="/faq">FAQ</Link><Link href="/login">Login</Link></div></nav>{children}</main>; }
export function Card({ children, className='' }: { children: ReactNode; className?: string }) { return <section className={`glass rounded-3xl p-6 ${className}`}>{children}</section>; }
export function Stat({ label, value }: { label: string; value: string }) { return <Card><p className="text-sm text-slate-300">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></Card>; }
export function Button({ children }: { children: ReactNode }) { return <button className="rounded-full bg-[#d7a83f] px-5 py-3 font-bold text-[#071b3a] transition hover:scale-105">{children}</button>; }
