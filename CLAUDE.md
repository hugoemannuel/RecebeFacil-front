# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint check
```

No test suite is configured. There is no `test` script.

## Environment Variables

Create `.env.local` with:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

The API defaults to `http://localhost:3001` if the variable is absent.

## Architecture

**Next.js 16 App Router** with React 19. All routes live under `app/`.

### Route protection

`proxy.ts` at the root defines the Next.js middleware logic, but it exports a function named `proxy` — **not** `middleware`. For route protection to be active, it must be renamed to `middleware.ts` and its export renamed to `middleware`. Until then, `/dashboard/*` routes are unprotected at the middleware layer.

### Auth flow

- `app/actions/auth.ts` — `loginAction`, `registerAction`, `logoutAction` Server Actions
- On login/register: backend returns `access_token`; the action sets it as an HttpOnly cookie named `recebefacil_token` (7-day TTL)
- On logout: cookie deleted, redirected to `/login`

### API service

`services/api.ts` — Axios instance pointing to `NEXT_PUBLIC_API_URL`. A request interceptor reads `recebefacil_token` from `document.cookie` (client-side only) and injects `Authorization: Bearer <token>`. **Server Actions** do NOT use this interceptor; they call `api.post/get` without auth headers — the cookie is managed by Next.js `cookies()` on the server side.

### Server Actions pattern

All mutations go through `app/actions/`. Actions return `{ success: true, data }` or `{ success: false, error: string }`. Error messages are in Portuguese. Plan-limit errors arrive as HTTP 403 with codes like `LIMIT_REACHED` or `RECURRENCE_NOT_ALLOWED`.

### Subscription / plan gating

`app/actions/subscription.ts` fetches `/subscription/status`, returning:

```ts
interface SubscriptionStatus {
  plan: 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED'
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'NONE'
  allowed_modules: string[]
  current_period_end: string | null
  userName?: string
}
```

`DashboardLayout` uses `allowed_modules` to lock/hide sidebar items. Locked features render `<UpgradeModal />`.

### Component structure

```
components/
  layout/     # DashboardLayout, AuthLayout, ThemeContext, ThemeToggle
  ui/         # Icons (all SVGs as React components), UpgradeModal, WhatsAppPreview
  forms/      # NewChargeDrawer (4-step multi-step form)
  dashboard/  # RecentActivityClient, ChargeDetailsDrawer, PeriodSelect
```

Pages are thin server components that fetch with `Promise.allSettled()` and pass results to client components.

### Forms

All forms use **React Hook Form + Zod** (`@hookform/resolvers/zod`). Input masks (money, phone) are implemented as pure `onChange` handlers in `lib/formatters.ts` — no mask library. Key formatters: `maskMoney`, `parseMoney`, `maskPhone`, `formatDate`, `interpolateTemplate` (for WhatsApp variable substitution like `{{nome}}`).

### Styling

Tailwind CSS v4 only. No custom CSS except the theme variables in `app/globals.css`. Dark mode is toggled via `ThemeContext` (persisted in `localStorage`) which adds/removes `dark` on `document.documentElement`. Design tokens: background dark `#0b1521`, accent green `#22c55e`.

### Icons

All SVG icons live in `components/ui/Icons.tsx` as React components — do not add icon libraries.

## Key pages

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Landing page (server component) |
| `/login` | `app/login/page.tsx` | Auth form |
| `/cadastro` | `app/cadastro/page.tsx` | Registration form |
| `/dashboard` | `app/dashboard/page.tsx` | Metrics overview |
| `/dashboard/cobrancas` | `app/dashboard/cobrancas/page.tsx` | Charges list + management |
| `/dashboard/configuracoes` | `app/dashboard/configuracoes/page.tsx` | Settings |
| `/planos` | `app/planos/page.tsx` | Plans/pricing |
