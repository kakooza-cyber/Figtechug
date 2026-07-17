import { NextResponse, type NextRequest } from 'next/server';
const buckets = new Map<string, { count: number; reset: number }>();
export function middleware(req: NextRequest) { const ip=req.headers.get('x-forwarded-for') ?? 'local'; const now=Date.now(); const bucket=buckets.get(ip) ?? {count:0,reset:now+60_000}; if(now>bucket.reset){bucket.count=0;bucket.reset=now+60_000} bucket.count++; buckets.set(ip,bucket); if(bucket.count>120) return NextResponse.json({error:'Too many requests'},{status:429}); const res=NextResponse.next(); res.headers.set('X-Content-Type-Options','nosniff'); res.headers.set('X-Frame-Options','DENY'); return res; }
export const config = { matcher: ['/api/:path*'] };


