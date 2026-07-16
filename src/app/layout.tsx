import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Figtechug Investment Platform', description: 'Premium investment management platform' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
