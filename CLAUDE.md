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

Available actions: `auth.ts`, `charges.ts`, `clients.ts`, `demo.ts`, `profile.ts`, `subscription.ts`, `templates.ts`.

### Subscription / plan gating

`app/dashboard/layout.tsx` (Server Component) fetches `/subscription/status` and `/users/me` on every navigation, then hydrates `useUserStore` via `StoreInitializer`. `DashboardLayout` reads from the store (`useUserStore`) with fallback to its prop for SSR. Module locking is UI-only — the backend enforces authorization independently.

```ts
interface SubscriptionStatus {
  plan: 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED'
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'NONE'
  allowed_modules: string[]
  current_period_end: string | null
  cancel_at_period_end: boolean
  payment_failed: boolean
  payment_failed_at: string | null
  userName?: string
  avatarUrl?: string
}
```

`DashboardLayout` uses `allowed_modules` to lock sidebar items. Locked features render `<UpgradeModal />`.

### Component structure

```
store/
  useThemeStore/          # Zustand: tema (light/dark). ThemeInitializer hidrata do localStorage
  useUserStore/           # Zustand: user + subscription. StoreInitializer hidrata do servidor
    StoreInitializer.tsx  # "use client" — hidrata store a partir de props do Server Component
                          # Renderizado apenas no dashboard/layout.tsx (não duplicar em pages)

components/
  layout/     # DashboardLayout, AuthLayout, ThemeToggle
  ui/
    Icons.tsx           # All SVGs as React components — do not add icon libraries
    UpgradeModal.tsx    # Plan upgrade modal
    WhatsAppPreview.tsx
    Checkbox/index.tsx  # Generic checkbox. Props: checked, onChange, indeterminate, size
    ConfirmModal.tsx    # Generic destructive confirmation modal
    Chip/index.tsx      # Chip/tag component
    Input/Input.tsx     # Base input. variant="default"|"auth", icon, rightSlot, label, error
    Textarea/Textarea.tsx
    Select/Select.tsx
  forms/
    NewChargeDrawer.tsx    # 4-step multi-step form (drawer variant)
    NewChargeModal/        # Refactored multi-step modal with sub-components:
      NewChargeModal.tsx   #   ModalHeader, ModalFooter, StepProgressBar
      components/          #   StepDebtor, StepChargeDetails, StepMessage, StepConfirm
    AutomacaoModal.tsx     # Automation settings modal
    NewClientModal.tsx     # New client creation modal
    FormField/FormField.tsx
    rhf/
      RHFInput.tsx         # Controller-wrapped Input (fully typed generic)
      RHFPasswordInput.tsx # Password input with built-in show/hide toggle
      RHFTextarea.tsx      # Supports inputRef for cursor control
      RHFSelect.tsx        # Controller-wrapped Select
  dashboard/    # RecentActivityClient, ChargeDetailsDrawer, ClientDetailsModal, PeriodSelect
  landing/      # DemoButton, DemoModal, DemoBlockedModal, LandingCarousel
  patterns/     # DatePickerField (DayPicker-based)
```

Pages are thin server components that fetch with `Promise.allSettled()` and pass results to client components.

### Forms

All forms use **React Hook Form + Zod** (`@hookform/resolvers/zod`). Every controlled field uses a dedicated RHF wrapper — never use `register()` or raw `<input>/<textarea>/<select>` outside `components/ui/`.

| Component | When to use |
|---|---|
| `RHFInput` | Text, email, tel, number. Supports `icon`, `mask`, `variant` |
| `RHFPasswordInput` | Password with built-in show/hide toggle |
| `RHFTextarea` | Long text. Supports `inputRef` for cursor control |
| `RHFSelect` | RHF-controlled select with validation |
| `DatePickerField` | Date selection with DayPicker |
| `Checkbox` | Checkbox UI for tables and non-RHF toggles |

For UI inputs without a form (search bars, filters), use `Input` or `Select` directly. Auth pages use `variant="auth"` on RHF fields for the light-mode style. Input masks (money, phone) pass through `mask` prop on `RHFInput` using formatters from `lib/formatters.ts` — no mask library. Key formatters: `maskMoney`, `parseMoney`, `maskPhone`, `formatDate`, `interpolateTemplate` (for WhatsApp variable substitution like `{{nome}}`). Toast: `sonner` only — `react-hot-toast` has been removed.

### Styling

Tailwind CSS v4 only. No custom CSS except the theme variables in `app/globals.css`. Dark mode is toggled via `useThemeStore` (Zustand, persisted in `localStorage`) which adds/removes `dark` on `document.documentElement`. The `ThemeInitializer` component (rendered in `app/layout.tsx`) hydrates the store from `localStorage` on mount. Design tokens: background dark `#0b1521`, accent green `#22c55e`.

### Icons

All SVG icons live in `components/ui/Icons.tsx` as React components — do not add icon libraries.

## Key pages

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Landing page (server component) |
| `/login` | `app/login/page.tsx` | Auth form |
| `/cadastro` | `app/cadastro/page.tsx` | Registration form |
| `/planos` | `app/planos/page.tsx` | Plans/pricing |
| `/dashboard` | `app/dashboard/page.tsx` | Metrics overview |
| `/dashboard/cobrancas` | `app/dashboard/cobrancas/page.tsx` | Charges list + management |
| `/dashboard/cobrancas/recorrentes` | `app/dashboard/cobrancas/recorrentes/page.tsx` | Recurring charges management |
| `/dashboard/cobrancas/templates` | `app/dashboard/cobrancas/templates/page.tsx` | Message templates |
| `/dashboard/clientes` | `app/dashboard/clientes/page.tsx` | Clients management |
| `/dashboard/financeiro` | `app/dashboard/financeiro/page.tsx` | Financial overview |
| `/dashboard/financeiro/extrato` | `app/dashboard/financeiro/extrato/page.tsx` | Statement |
| `/dashboard/financeiro/saques` | `app/dashboard/financeiro/saques/page.tsx` | Withdrawals |
| `/dashboard/relatorios` | `app/dashboard/relatorios/page.tsx` | Reports + PDF export |
| `/dashboard/configuracoes` | `app/dashboard/configuracoes/page.tsx` | Settings (profile, PIX, integrations) |
