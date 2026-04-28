---
name: frontend-plan-gating
description: Controle de acesso por plano (FREE/STARTER/PRO/UNLIMITED) no front-end RecebeFácil. Use ao bloquear módulos, mostrar UpgradeModal, limitar ações ou exibir progress bars de uso.
when_to_use: Quando implementar bloqueio de módulo, paywall, UpgradeModal, limite de cobranças, recorrências por plano ou bulk actions restritas.
---

## Fonte da Verdade

```ts
// GET /subscription/status retorna:
{
  plan: 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED',
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'NONE',
  allowed_modules: string[],  // ['HOME', 'CHARGES', ...]
  current_period_end: string | null,
}
```

O array `allowed_modules` (vindo do back-end) é a única fonte de verdade para liberar módulos.

## Matriz de Módulos

| Módulo       | FREE | STARTER | PRO | UNLIMITED |
|--------------|:----:|:-------:|:---:|:---------:|
| HOME         | ✅   | ✅      | ✅  | ✅        |
| CHARGES      | ✅   | ✅      | ✅  | ✅        |
| CLIENTS      | ❌   | ✅      | ✅  | ✅        |
| REPORTS      | ❌   | ✅      | ✅  | ✅        |
| EXCEL_IMPORT | ❌   | ✅      | ✅  | ✅        |

## Menu com Cadeado (DashboardLayout)

```tsx
const MENU_ITEMS = [
  { name: 'CLIENTES', path: '/dashboard/clientes', icon: IconUsers, module: 'CLIENTS' },
  // ...
];

{MENU_ITEMS.map(item => {
  const isLocked = !subscription.allowed_modules.includes(item.module);
  if (isLocked) return (
    <button onClick={() => setLockedModule(item.module)}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-zinc-400 hover:bg-amber-50 hover:text-amber-600 group">
      <Icon className="text-zinc-300 group-hover:text-amber-400" />
      <span className="flex-1 text-left">{item.name}</span>
      <IconLock className="text-zinc-300 group-hover:text-amber-400" />
    </button>
  );
  return <Link href={item.path} ...>{item.name}</Link>;
})}
```

Itens bloqueados: nunca esconder completamente, mostrar com cadeado (PLG).

## UpgradeModal

```tsx
// Abrir ao clicar em módulo bloqueado:
{lockedModule && <UpgradeModal moduleName={lockedModule} onClose={() => setLockedModule(null)} />}

// Abrir ao atingir limite do plano:
{limitReached && <UpgradeModal moduleName="LIMIT_REACHED" onClose={() => setLimitReached(false)} />}
```

Nunca redirecionar para página de erro — sempre UpgradeModal.

## Limites de Cobranças

```ts
// FREE: 10/mês | STARTER: 50/mês | PRO: 200/mês | UNLIMITED: ilimitado
onClick={() => {
  if (plan === 'FREE' && sentThisMonth >= 10) setLimitReached(true);
  else setDrawerOpen(true);
}}
```

## Recorrências por Plano (NewChargeDrawer)

```ts
const allowedRecurrences = {
  FREE:      ['ONCE'],
  STARTER:   ['ONCE', 'WEEKLY'],
  PRO:       ['ONCE', 'WEEKLY', 'MONTHLY', 'YEARLY'],
  UNLIMITED: ['ONCE', 'WEEKLY', 'MONTHLY', 'YEARLY'],
}[planType];

// Botão de recorrência bloqueada mostra badge "Pro":
{!isAllowed && (
  <span className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[8px] uppercase px-1.5 py-0.5 rounded-bl-lg font-extrabold">Pro</span>
)}
// Clicar em bloqueado: toast.error('O plano X não permite recorrência Y. Faça upgrade!')
```

## Bulk Actions (Ações em Massa)

```tsx
// Checkboxes — desabilitar para FREE/STARTER
disabled={plan === 'FREE' || plan === 'STARTER'}

// Floating Action Bar — só para PRO/UNLIMITED
{showBulkActions && (plan === 'PRO' || plan === 'UNLIMITED') && <FloatingActionBar />}

// Banner de bloqueio abaixo da tabela para FREE/STARTER:
{(plan === 'FREE' || plan === 'STARTER') && (
  <div className="bg-zinc-50/80 border-t p-4 flex items-center justify-between">
    <p className="text-sm text-zinc-500 flex items-center gap-2">
      <IconLock className="w-4 h-4" /> Seleção em massa bloqueada no plano {plan}.
    </p>
    <button className="text-sm font-bold text-green-600 underline">Conhecer PRO</button>
  </div>
)}
```

## Progress Bar de Uso

```tsx
<div className="w-full bg-zinc-100 rounded-full h-2.5">
  <div
    className={`h-2.5 rounded-full transition-all duration-1000 ${count >= limit ? 'bg-red-500' : 'bg-green-500'}`}
    style={{ width: `${Math.min((count / limit) * 100, 100)}%` }}
  />
</div>
```

## Banner de Upgrade na Sidebar (FREE)

```tsx
{subscription.plan === 'FREE' && (
  <div className="mx-4 mb-4 bg-gradient-to-br from-[#0b1521] to-[#0b3d2e] rounded-2xl p-4">
    <p className="text-white font-bold text-xs mb-1">Desbloqueie mais poder</p>
    <p className="text-slate-400 text-[11px] mb-3">Clientes, relatórios e Excel no Starter.</p>
    <Link href="/planos" className="block bg-green-500 hover:bg-green-400 text-white font-bold text-xs py-2 rounded-xl text-center">
      Ver planos →
    </Link>
  </div>
)}
```

## Erros 403 da API

```ts
// createChargeAction trata mensagens de negócio específicas:
if (res.status === 403) {
  if (err?.message === 'LIMIT_REACHED') return { error: 'Limite atingido. Faça upgrade.' };
  if (err?.message === 'RECURRENCE_NOT_ALLOWED') return { error: 'Recorrência não permitida no seu plano.' };
}
```

## Anti-patterns

- Nunca esconder módulo bloqueado completamente — mostrar com cadeado
- Nunca redirecionar para página de erro — sempre UpgradeModal
- Nunca confiar só no front-end — back-end sempre valida também
- Nunca exibir "Erro 403" ao usuário — mensagem humanizada
