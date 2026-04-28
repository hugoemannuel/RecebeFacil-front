---
name: frontend-architecture
description: Arquitetura Next.js App Router do RecebeFácil. Use ao criar páginas, componentes, Server Actions ou qualquer novo arquivo no front-end.
when_to_use: Quando criar page.tsx, componentes, actions, serviços de API, ou ao perguntar onde colocar um arquivo no projeto.
---

## Estrutura de Diretórios

```
app/
  actions/          ← Server Actions ('use server') — auth.ts, charges.ts, subscription.ts
  dashboard/        ← Páginas autenticadas (Server Components)
    cobrancas/
      page.tsx      ← Server Component: busca dados, passa para ChargesClient
      ChargesClient.tsx ← 'use client': toda interatividade aqui
  layout.tsx
  page.tsx          ← Landing Page (Server Component, sem 'use client')

components/
  ui/
    Icons.tsx            ← Todos os SVGs como React components — nunca instalar lib de ícones
    UpgradeModal.tsx     ← Modal de upgrade de plano
    WhatsAppPreview.tsx
    Checkbox/index.tsx   ← Checkbox genérico: checked, onChange, indeterminate, size="sm"|"md"
    ConfirmModal.tsx     ← Modal de confirmação destrutiva genérico
    Input/Input.tsx      ← Base input: variant="default"|"auth", icon, rightSlot, label, error
    Textarea/Textarea.tsx
    Select/Select.tsx
  layout/           ← Cascas de página (DashboardLayout.tsx, AuthLayout.tsx, ThemeContext.tsx)
  forms/
    NewChargeDrawer.tsx  ← Formulário multi-step 4 passos
    rhf/
      RHFInput.tsx        ← Controller-wrapped Input (genérico tipado). Props: name, control, label, icon, mask, variant
      RHFPasswordInput.tsx ← Senha com show/hide embutido. Props: name, control, label, placeholder, variant
      RHFTextarea.tsx     ← Controller-wrapped Textarea. Props: name, control, label, rows, inputRef
      RHFSelect.tsx       ← Controller-wrapped Select. Props: name, control, label, options
  dashboard/        ← Específicos do dashboard (ChargeDetailsDrawer.tsx, PeriodSelect.tsx)

services/
  api.ts            ← Instância axios padronizada (baseURL, interceptor de token)

lib/
  formatters.ts     ← Funções puras: formatMoney, maskMoney, parseMoney, maskPhone, interpolateTemplate
```

## Regra Server Component → Client Component

```tsx
// page.tsx — Server Component: busca dados no servidor, sem estado
export default async function Page() {
  const data = await fetchData(); // fetch direto, sem useEffect
  return <ClientComponent initialData={data} />;
}

// ClientComponent.tsx — 'use client': estado, eventos, interatividade
'use client';
export function ClientComponent({ initialData }) { ... }
```

- `page.tsx` máximo ~50 linhas — apenas orquestra layout e importa Client Components
- Toda lógica de filtro, seleção, estado → Client Component dedicado

## Server Actions — Padrão Obrigatório

Rotas protegidas SEMPRE via Server Action. Nunca chamar API diretamente de Client Component para operações autenticadas.

```ts
'use server';
import { cookies } from 'next/headers';

export async function createChargeAction(payload) {
  const token = (await cookies()).get('recebefacil_token')?.value;
  if (!token) return { success: false, error: 'Sessão expirada.' };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/charges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    if (res.status === 403 && err?.message === 'LIMIT_REACHED')
      return { success: false, error: 'Limite do plano atingido. Faça upgrade.' };
    return { success: false, error: err?.message || 'Erro no servidor.' };
  }
  return { success: true, data: await res.json() };
}
```

## Instância Axios (services/api.ts)

```ts
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  if (typeof document !== 'undefined') {
    const tokenCookie = document.cookie.split(';').find(c => c.trim().startsWith('recebefacil_token='));
    if (tokenCookie) config.headers.Authorization = `Bearer ${tokenCookie.split('=')[1]}`;
  }
  return config;
});
```

## Ícones

- **Todos** em `components/ui/Icons.tsx` como SVGs nativos
- Nunca instalar lucide-react, heroicons ou similares
- Props: `{ className?: string }` com `w-X h-X`

## Anti-patterns

- Nunca `dangerouslySetInnerHTML`
- Nunca JWT em `localStorage` — sempre cookie HttpOnly via Server Action
- Nunca CSS global solto — 100% Tailwind utilitário
- Nunca instalar lib de ícones externa
- Nunca `<input>/<textarea>/<select>` raw fora de `components/ui/` — usar wrappers RHF ou componentes UI
- Nunca `register()` em páginas — usar `control` + wrapper RHF
- Nunca importar `react-hot-toast` — usar `sonner`
