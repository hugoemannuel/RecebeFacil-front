---
name: frontend-architecture
description: Arquitetura Next.js App Router do RecebeFácil. Use ao criar páginas, componentes, Server Actions ou qualquer novo arquivo no front-end.
when_to_use: Quando criar page.tsx, componentes, actions, serviços de API, ou ao perguntar onde colocar um arquivo no projeto.
---

## Estrutura de Diretórios

```
app/
  actions/           ← Server Actions ('use server')
    auth.ts          ← loginAction, registerAction, logoutAction
    charges.ts       ← createChargeAction, updateChargeStatusAction, ...
    clients.ts       ← createClientAction, updateClientAction
    demo.ts          ← sendDemoAction (pública, sem token)
    profile.ts       ← updateProfileAction (CreditorProfile, PIX)
    subscription.ts  ← getSubscriptionStatusAction
    templates.ts     ← createTemplateAction, updateTemplateAction, deleteTemplateAction
  dashboard/         ← Páginas autenticadas (Server Components)
    layout.tsx       ← Busca user+subscription no servidor, hidrata useUserStore via StoreInitializer
    page.tsx         ← Métricas overview
    cobrancas/
      page.tsx + ChargesClient.tsx
      recorrentes/   ← Cobranças recorrentes
      templates/     ← Templates de mensagem WhatsApp
    clientes/
      page.tsx + ClientsClient.tsx
    financeiro/
      page.tsx + FinanceiroClient.tsx
      extrato/       ← Extrato financeiro
      saques/        ← Saques
    relatorios/
      page.tsx + RelatoriosClient.tsx + RelatorioPDF.tsx
    configuracoes/
      page.tsx + ConfiguracoesClient.tsx  ← Perfil, senha, PIX, integrações
  login/ | cadastro/ | planos/
  layout.tsx | page.tsx (Landing Page)

components/
  ui/
    Icons.tsx            ← Todos os SVGs — nunca instalar lib de ícones
    UpgradeModal.tsx     ← Modal de upgrade de plano
    WhatsAppPreview.tsx
    Checkbox/index.tsx   ← checked, onChange, indeterminate, size="sm"|"md"
    ConfirmModal.tsx     ← Modal de confirmação destrutiva
    Chip/index.tsx       ← Chip/tag component
    Input/Input.tsx      ← variant="default"|"auth", icon, rightSlot, label, error
    Textarea/Textarea.tsx | Select/Select.tsx
  layout/          ← DashboardLayout.tsx, AuthLayout.tsx, ThemeToggle
  forms/
    NewChargeDrawer.tsx    ← Drawer multi-step 4 passos (variante drawer)
    NewChargeModal/        ← Modal multi-step 4 passos (variante modal, refatorado)
      NewChargeModal.tsx
      components/          ← ModalHeader, ModalFooter, StepProgressBar
                              StepDebtor, StepChargeDetails, StepMessage, StepConfirm
      interfaces/          ← ChargeFormData.ts, NewChargeModalProps.ts
    AutomacaoModal.tsx     ← Configurações de automação
    NewClientModal.tsx     ← Criação de cliente
    FormField/FormField.tsx
    rhf/
      RHFInput.tsx         ← Controller-wrapped Input. Props: name, control, label, icon, mask, variant
      RHFPasswordInput.tsx ← Senha com show/hide. Props: name, control, label, placeholder, variant
      RHFTextarea.tsx      ← Props: name, control, label, rows, inputRef
      RHFSelect.tsx        ← Props: name, control, label, options
  dashboard/       ← ChargeDetailsDrawer, ClientDetailsModal, PeriodSelect, RecentActivityClient
  patterns/
    DatePickerField.tsx  ← Seleção de data com react-day-picker
  landing/
    DemoButton.tsx | DemoModal.tsx | DemoBlockedModal.tsx | LandingCarousel.tsx

store/
  useThemeStore/
    index.ts             ← Zustand store: 'light'|'dark', setTheme, toggleTheme
    ThemeInitializer.tsx ← "use client" — hidrata do localStorage no mount (em app/layout.tsx)
    interface/index.ts
  useUserStore/
    index.ts             ← Zustand store: user, subscription, refresh(), updateLocalUser()
    StoreInitializer.tsx ← "use client" — hidrata store a partir de props do Server Component
                           ATENÇÃO: renderizar APENAS em dashboard/layout.tsx, nunca duplicar em pages
    interface/index.ts

services/
  api.ts     ← Axios instance com interceptor de token (client-side)
  templates.ts

lib/
  formatters.ts  ← formatMoney, maskMoney, parseMoney, maskPhone, formatDate, interpolateTemplate
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

## Middleware de Proteção de Rotas

O arquivo `proxy.ts` na raiz define a lógica do middleware, mas exporta `proxy` em vez de `middleware`. **Para ativar a proteção de `/dashboard/*`, renomear para `middleware.ts` e a export para `middleware`.** Enquanto isso não for feito, as rotas do dashboard ficam desprotegidas no nível do middleware.

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
- Nunca renderizar `StoreInitializer` em mais de um lugar para a mesma rota — cada instância tem `initialized.current` próprio e causa dupla escrita no store
- Nunca ler `localStorage` sem validar o valor em runtime (cast TypeScript não é validação)
