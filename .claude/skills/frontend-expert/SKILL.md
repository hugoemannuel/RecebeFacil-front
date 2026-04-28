---
name: frontend-expert
description: Especialista sênior em front-end do RecebeFácil. Conhece toda a arquitetura Next.js App Router, design system, padrões de componentes, autenticação, plan gating e integrações. Invocar para qualquer tarefa de front-end.
when_to_use: Qualquer tarefa de front-end — criar página, componente, form, Server Action, estilização, autenticação, plan gating, drawer, preview de WhatsApp, dark mode ou decisão arquitetural.
---

## Arquitetura

**Stack:** Next.js 15 App Router · TypeScript · Tailwind CSS · React Hook Form · Zod · Axios · Sonner (toasts) · TanStack Table · Radix UI · date-fns

**Estrutura de pastas:**
```
app/
  actions/           ← Server Actions ('use server'): auth.ts, charges.ts, subscription.ts
  dashboard/         ← Páginas autenticadas (Server Components)
    cobrancas/
      page.tsx       ← Server Component: busca dados, ≤50 linhas, sem estado
      ChargesClient.tsx ← 'use client': tabela, filtros, seleção, drawers
  layout.tsx / page.tsx (Landing — Server Component)

components/
  ui/       ← Atômicos sem negócio: Icons.tsx, UpgradeModal.tsx, WhatsAppPreview.tsx
  layout/   ← Cascas: DashboardLayout.tsx, AuthLayout.tsx, ThemeContext.tsx, ThemeToggle.tsx
  forms/    ← Formulários com RHF+Zod: NewChargeDrawer.tsx
  dashboard/← Específicos: ChargeDetailsDrawer.tsx, PeriodSelect.tsx, RecentActivityClient.tsx

services/api.ts   ← Instância axios com interceptor de token
lib/formatters.ts ← Funções puras: formatMoney, maskMoney, parseMoney, maskPhone, formatDate, interpolateTemplate
```

**Regra Server/Client:**
- `page.tsx` = Server Component, busca dados no servidor, ≤50 linhas, sem `useState`/`useEffect`
- Toda interatividade → Client Component dedicado (`'use client'`)
- Rotas protegidas → Server Action lê cookie HttpOnly, nunca o Client Component diretamente

---

## Autenticação

**JWT em cookie HttpOnly** — token nunca toca JavaScript do browser.

```ts
// app/actions/auth.ts — 'use server'
export async function loginAction(data) {
  const response = await api.post('/auth/login', data);
  (await cookies()).set('recebefacil_token', response.data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
  return { success: true, user: response.data.user };
}

export async function logoutAction() {
  (await cookies()).delete('recebefacil_token');
  redirect('/login');
}
```

**Leitura do token em qualquer Server Action:**
```ts
const token = (await cookies()).get('recebefacil_token')?.value;
if (!token) return { success: false, error: 'Sessão expirada. Faça login novamente.' };
```

**Logout sem JS:** `<form action={logoutAction}><button type="submit">Sair</button></form>`

---

## Server Actions — Padrão

```ts
'use server';
export async function createChargeAction(payload): Promise<{ success: boolean; error?: string; data?: any }> {
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
    if (res.status === 403 && err?.message === 'RECURRENCE_NOT_ALLOWED')
      return { success: false, error: 'Recorrência não permitida no seu plano.' };
    return { success: false, error: err?.message || 'Erro no servidor.' };
  }
  return { success: true, data: await res.json() };
}
```

---

## Formulários (React Hook Form + Zod)

```ts
// Schema com validações reais do projeto:
const schema = z.object({
  debtor_name:     z.string().min(2, 'Nome obrigatório'),
  debtor_phone:    z.string().min(10, 'Telefone obrigatório'),
  amount_display:  z.string().refine(val => parseMoney(val) >= 100, { message: 'Mínimo R$ 1,00' }),
  due_date:        z.date().refine(val => { const t = new Date(); t.setHours(0,0,0,0); return val >= t; }, { message: 'Data futura ou hoje' }),
  description:     z.string().min(3).max(200),
  recurrence:      z.enum(['ONCE', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  custom_message:  z.string().min(5),
  send_pix_button: z.boolean(),
  pix_key:         z.string().optional(),
  pix_key_type:    z.enum(['CPF', 'CNPJ', 'PHONE', 'EMAIL', 'EVP']).optional(),
}).superRefine((data, ctx) => {
  if (data.send_pix_button && !data.pix_key)
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Chave PIX obrigatória', path: ['pix_key'] });
});

const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { ... } });
```

**Máscaras — sem libs externas**, via `lib/formatters.ts`:
```ts
onChange={(e) => setValue('debtor_phone', maskPhone(e.target.value), { shouldValidate: true })}
onChange={(e) => setValue('amount_display', maskMoney(e.target.value), { shouldValidate: true })}
```

**Multi-step — validar só campos do step atual:**
```ts
form.trigger(['debtor_name', 'debtor_phone']).then(ok => { if (ok) setStep(s => s + 1); });
```

**Loading state obrigatório:**
```tsx
const [sending, setSending] = useState(false);
async function onSubmit(data) {
  setSending(true);
  try {
    const result = await serverAction(data);
    if (result.success) { toast.success('Sucesso!'); reset(); }
    else toast.error(result.error ?? 'Erro. Tente novamente.');
  } finally { setSending(false); }
}
// Botão: disabled={sending} + spinner inline quando sending
```

---

## Design System

**Paleta Light:**
| Token | Valor |
|---|---|
| Background | `bg-[#f8fafc]` |
| Surface | `bg-white` |
| Border | `border-zinc-200` |
| Text primary | `text-zinc-900` |
| Text secondary | `text-zinc-500` |
| Accent (dinheiro/sucesso) | `bg-green-500` / `text-green-500` (`#22c55e`) |
| Dark surface | `bg-[#0b1521]` |
| Dark surface hover | `bg-[#152336]` |

**Paleta Dark:** bg `#0b1521` · surface `#152336` · border `rgba(255,255,255,0.05)` · text `#f8fafc` · secondary `#94a3b8` · accent `#22c55e` (mantido)

**Padrões obrigatórios:**
```tsx
// Botão primário verde
"bg-green-500 hover:bg-green-600 hover:scale-[1.02] transition-all shadow-lg shadow-green-500/20"

// Botão dark (Nova Cobrança no header)
"bg-[#0b1521] hover:bg-[#152336] text-white"

// Input com foco da marca
"focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all"

// Item de menu ativo / inativo
"bg-green-100 text-green-700"  // ativo
"text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"  // inativo
```

**Badges de status:**
```ts
PAID:    "bg-emerald-100 text-emerald-800"
OVERDUE: "bg-red-100 text-red-800"
PENDING: "bg-amber-100 text-amber-800"
```

**Badges de plano:**
```ts
FREE: 'text-zinc-500' · STARTER: 'text-blue-500' · PRO: 'text-green-600' · UNLIMITED: 'text-purple-600'
```

**Dark mode:** classe `dark` no `<html>` via `ThemeContext`. Detectar `prefers-color-scheme` no primeiro acesso, salvar no `localStorage`. Variante `dark:` do Tailwind em todos os elementos. Transição: `transition-colors duration-300`.

**Empty states:** sempre ícone + título + descrição + botão de ação. Nunca texto vazio sem CTA.

**Ícones:** todos em `components/ui/Icons.tsx` como SVGs nativos. Nunca instalar lucide-react ou similares.

---

## Plan Gating (UI)

**Fonte da verdade:** `GET /subscription/status` → `{ plan, allowed_modules: string[] }`

**Matriz:**
| Módulo | FREE | STARTER | PRO | UNLIMITED |
|---|:---:|:---:|:---:|:---:|
| HOME, CHARGES | ✅ | ✅ | ✅ | ✅ |
| CLIENTS, REPORTS, EXCEL_IMPORT | ❌ | ✅ | ✅ | ✅ |

**Menu com cadeado (PLG — nunca esconder):**
```tsx
const isLocked = !subscription.allowed_modules.includes(item.module);
if (isLocked) return (
  <button onClick={() => setLockedModule(item.module)}
    className="... text-zinc-400 hover:bg-amber-50 hover:text-amber-600 group">
    <Icon className="text-zinc-300 group-hover:text-amber-400" />
    {item.name}
    <IconLock className="text-zinc-300 group-hover:text-amber-400" />
  </button>
);
```

**UpgradeModal:** abrir ao clicar em módulo bloqueado ou ao atingir limite. Nunca redirecionar para página de erro.

**Recorrências por plano:**
```ts
const allowed = { FREE: ['ONCE'], STARTER: ['ONCE','WEEKLY'], PRO: ['ONCE','WEEKLY','MONTHLY','YEARLY'], UNLIMITED: ['ONCE','WEEKLY','MONTHLY','YEARLY'] }[plan];
// Botão bloqueado: badge "Pro" + toast.error ao clicar
```

**Bulk actions:** desabilitadas para FREE/STARTER. Floating Action Bar só para PRO/UNLIMITED. Banner de bloqueio visual abaixo da tabela.

**Progress bar de uso:**
```tsx
<div className="w-full bg-zinc-100 rounded-full h-2.5">
  <div className={`h-2.5 rounded-full ${count >= limit ? 'bg-red-500' : 'bg-green-500'}`}
    style={{ width: `${Math.min((count / limit) * 100, 100)}%` }} />
</div>
```

---

## NewChargeDrawer

**Estrutura:** 4 steps → `[Devedor] → [Cobrança] → [Mensagem] → [Confirmar]`

Step 2 (Mensagem): drawer expande para `maxWidth: '900px'` com layout dual-column (editor + WhatsAppPreview ao vivo).

**WhatsAppPreview:** fundo `#e5ddd5`, atualiza em tempo real via `interpolateTemplate()`.

**Variáveis de template:** `{{nome}}` `{{valor}}` `{{vencimento}}` `{{descricao}}` `{{nome_empresa}}` `{{dias_atraso}}`

**Inserir variável no cursor:**
```ts
function insertVariable(v: string) {
  const start = el.selectionStart;
  setValue('custom_message', current.slice(0, start) + v + current.slice(start));
  setTimeout(() => { el.selectionStart = el.selectionEnd = start + v.length; el.focus(); }, 0);
}
```

**PIX inline** (se lojista sem chave configurada): campos `pix_key_type` + `pix_key` aparecem no step 2 com `animate-in fade-in slide-in-from-top-2`.

**Fechar com ESC:** `useEffect` + `document.addEventListener('keydown', handler)` com cleanup.

---

## Tabela de Cobranças (ChargesClient)

- **TanStack Table** (`useReactTable`) para estado: sort, seleção, filtro
- **Radix UI DropdownMenu** para ações por linha (3 pontinhos)
- Filtros locais com `useMemo` — sem re-fetch ao filtrar por status, data ou busca
- `router.refresh()` após ações que mudam estado no servidor

---

## Anti-patterns

- Nunca `localStorage.setItem('token', ...)`
- Nunca `dangerouslySetInnerHTML`
- Nunca instalar lib de ícones (lucide-react, heroicons)
- Nunca lib de máscara externa (react-input-mask)
- Nunca chamar API protegida de Client Component — usar Server Action
- Nunca CSS global solto — 100% Tailwind utilitário
- Nunca `page.tsx` com lógica de estado
- Nunca esconder módulo bloqueado sem cadeado — PLG
- Nunca redirecionar para erro quando módulo bloqueado — UpgradeModal
- Nunca logar dados sensíveis (CPF, senha, chave PIX) no console
- Nunca submeter form sem loading state no botão
