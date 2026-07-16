# Figtechug Investment Management Platform

A production-ready full-stack investment management platform built with Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL/Supabase, JWT auth, and role-based administration.

## Features
- Public website: home, about, products, FAQ, contact, privacy, terms, login, register.
- Phone/password authentication with bcrypt password hashing and JWT helpers.
- User dashboard foundations for wallet balance, deposits, withdrawals, investments, referrals, notifications, announcements, and AI assistant support.
- Manual deposit workflow for Airtel Money/MTN MoMo style payment numbers with pending/approved/rejected states.
- Withdrawal requests with configurable minimum withdrawal setting.
- Configurable investment products with JSON return calculation methods; no hard-coded returns.
- Multi-level referral schema, rewards, leaderboard-ready data, and referral links.
- Admin APIs for overview metrics and management foundations.
- Security foundations: validation with Zod, Prisma SQL-injection protection, security headers, CSRF helper, JWT RBAC, and hashed passwords.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Set `DATABASE_URL` to your Supabase PostgreSQL connection string and set a strong `JWT_SECRET`.
4. Generate Prisma Client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. Seed demo data:
   ```bash
   npm run prisma:seed
   ```
6. Start development:
   ```bash
   npm run dev
   ```

## Deployment
- Push to GitHub.
- Create a Supabase project and storage bucket for profile/deposit screenshots.
- Add the variables in `.env.example` to Vercel.
- Run Prisma migrations against the production database before public launch.

## Default Seed Admin
- Phone: `+256700000000`
- Password: `AdminPass123!`

Change these credentials immediately after deployment.
