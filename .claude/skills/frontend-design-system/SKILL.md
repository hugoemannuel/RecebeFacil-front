---
name: frontend-design-system
description: Design system do RecebeFácil — cores, tipografia, micro-interações, dark mode, empty states e badges. Use ao criar ou estilizar qualquer componente.
when_to_use: Quando estilizar componentes, definir cores, implementar dark mode, criar empty states, badges de status ou plano, ou qualquer decisão visual.
---

## Paleta — Light Mode

| Token          | Classe Tailwind           | Uso                            |
|----------------|---------------------------|--------------------------------|
| Background     | `bg-[#f8fafc]`            | Fundo principal do app         |
| Surface        | `bg-white`                | Cards, sidebar, header         |
| Border         | `border-zinc-200`         | Bordas padrão                  |
| Text Primary   | `text-zinc-900`           | Títulos, conteúdo              |
| Text Secondary | `text-zinc-500`           | Labels, subtítulos             |
| Text Muted     | `text-zinc-400`           | Placeholders, ícones inativos  |
| Accent         | `bg-green-500` / `text-green-500` (`#22c55e`) | CTA, sucesso, ativo |
| Dark Surface   | `bg-[#0b1521]`            | Botão "Nova Cobrança", gradientes |
| Dark Surface 2 | `bg-[#152336]`            | Hover do dark surface          |

## Paleta — Dark Mode

| Token          | Valor                    |
|----------------|--------------------------|
| Background     | `#0b1521`                |
| Surface 1      | `#152336`                |
| Border         | `rgba(255,255,255,0.05)` |
| Text Primary   | `#f8fafc` (zinc-50)      |
| Text Secondary | `#94a3b8` (slate-400)    |
| Accent         | `#22c55e` (verde mantido)|

## Tipografia

- Fonte: `font-sans` (Inter ou sistema)
- Títulos: `font-extrabold tracking-tight`
- Labels de campo: `text-xs font-bold uppercase tracking-wider`
- Badges: `text-xs font-bold`

## Micro-interações Obrigatórias

```tsx
// Botão de ação primária (verde)
"bg-green-500 hover:bg-green-600 hover:scale-[1.02] transition-all shadow-lg shadow-green-500/20"

// Botão dark (Nova Cobrança)
"bg-[#0b1521] hover:bg-[#152336] text-white transition-all"

// Input com foco da marca
"focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all"

// Item de menu ativo
"bg-green-100 text-green-700"

// Item de menu inativo
"text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"

// Transição de tema (dark mode)
"transition-colors duration-300"
```

## Badges de Status de Cobrança

```tsx
PAID:     "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400"  // Pago
OVERDUE:  "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400"                  // Atrasado
PENDING:  "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400"          // Pendente
CANCELED: "bg-zinc-200 text-zinc-600 dark:bg-zinc-700/50 dark:text-zinc-400"              // Cancelado
```

## Badges de Plano Inline (feature gating)

```tsx
Pro: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
```

## Alertas Flutuantes (dark mode)

```tsx
// Toast/alerta amber (ex: Modo Viagem no Tempo)
container: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/25 text-amber-800 dark:text-amber-300"
button:    "bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 dark:text-amber-300"
```

## Badges de Plano (sidebar)

```ts
FREE:      { label: 'Plano Free',      color: 'text-zinc-500'   }
STARTER:   { label: 'Plano Starter',   color: 'text-blue-500'   }
PRO:       { label: 'Plano Pro',       color: 'text-green-600'  }
UNLIMITED: { label: 'Plano Unlimited', color: 'text-purple-600' }
```

## Dark Mode — Implementação

- `ThemeContext.tsx` controla a classe `dark` no `<html>`
- Toggle Sol/Lua posicionado no header
- Detecção inicial via `prefers-color-scheme` → salvar no `localStorage`
- Tailwind: usar variante `dark:` em todos elementos de fundo e texto
- **Nunca** sombras pretas no dark mode — usar glow ou bordas mais claras

## Empty States — Padrão

```tsx
<div className="flex flex-col items-center justify-center max-w-sm mx-auto py-24">
  <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
    <IconSearch className="w-8 h-8 text-zinc-300" />
  </div>
  <h3 className="text-lg font-bold text-zinc-900 mb-1">Título descritivo</h3>
  <p className="text-sm text-zinc-500 mb-6">Descrição + próxima ação.</p>
  <button className="px-4 py-2 bg-green-50 text-green-700 font-bold rounded-lg hover:bg-green-100">
    Criar primeiro item
  </button>
</div>
```

Nunca exibir estado vazio sem um botão de ação.

## Anti-patterns

- Não usar jargões financeiros ("Otimização de Fluxo" → "Mais dinheiro na mão")
- Não "espremer" componentes — espaçamentos generosos
- Não usar `transition` sem especificar propriedade (`transition-colors`, não `transition`)
- Não usar sombras pretas no dark mode
