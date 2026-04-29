# Plano: Corrigir Chips/Badges e Alerta no Dark Mode

## Contexto

Os chips de status (Pendente, Atrasado, Pago) na tabela de atividade recente e o alerta "Modo Viagem no Tempo" usam apenas classes Tailwind de light mode (`bg-amber-100 text-amber-800`, etc.) sem variantes `dark:`. No tema escuro ficam com fundo claro sobre superfície escura — visual feio e inconsistente.

---

## Arquivos a Modificar

1. `components/dashboard/RecentActivityClient.tsx` — chips da tabela
2. `app/dashboard/page.tsx` — alerta Modo Viagem no Tempo
3. `.claude/skills/frontend-design-system/SKILL.md` — atualizar tokens de badges
4. `CLAUDE.md` — adicionar regra: badges sempre precisam de variante `dark:`

---

## Mudanças

### 1. `RecentActivityClient.tsx` — Status chips (linhas 75–88)

Adicionar variantes `dark:` seguindo o padrão já usado nos filter chips do `page.tsx`:

```tsx
// Pago
"inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400"

// Atrasado
"inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
 bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400"

// Pendente
"inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
 bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400"
```

Resultado: fundo translúcido colorido sobre `#152336` — bonito e coerente com o design system.

---

### 2. `page.tsx` — Alerta "Modo Viagem no Tempo" (linha 79–93)

**Container:**
```
bg-amber-50 dark:bg-amber-950/40
border border-amber-200 dark:border-amber-500/25
text-amber-800 dark:text-amber-300
shadow-xl shadow-amber-900/10 dark:shadow-amber-900/40
```

**Ícone:**
```
text-amber-500 dark:text-amber-400
```

**Botão "Voltar ao Presente":**
```
bg-amber-100 hover:bg-amber-200 text-amber-900
dark:bg-amber-500/15 dark:hover:bg-amber-500/25 dark:text-amber-300
```

---

### 3. `frontend-design-system/SKILL.md` — Seção "Badges de Status"

Atualizar de:
```tsx
PAID:    "bg-emerald-100 text-emerald-800"
OVERDUE: "bg-red-100 text-red-800"
PENDING: "bg-amber-100 text-amber-800"
```

Para:
```tsx
PAID:    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400"
OVERDUE: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400"
PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400"
```

Adicionar seção **Alertas Flutuantes (dark mode)**:
```tsx
// Toast/alerta amber (ex: Modo Viagem no Tempo)
container: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/25 text-amber-800 dark:text-amber-300"
button:    "bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 dark:text-amber-300"
```

---

### 4. `CLAUDE.md` — Regra na seção Styling

Adicionar ao parágrafo de dark mode:
> Badges e alertas **sempre** precisam de variante `dark:` — nunca usar apenas classes de light mode em elementos coloridos.

---

## Verificação

1. `npm run dev` — abrir `/dashboard` em dark mode
2. Confirmar chips Pendente/Atrasado/Pago com fundo translúcido verde/vermelho/âmbar sobre `#152336`
3. Ativar "Modo Viagem no Tempo" (via query `?targetDate=...`) e verificar toast no canto inferior direito em dark mode
4. Testar em light mode para garantir que não quebrou nada
