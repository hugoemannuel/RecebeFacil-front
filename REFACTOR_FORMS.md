# Plano de Refatoração: Padronização Total de Inputs

> **Objetivo:** após este plano executado, nenhum arquivo fora de `components/ui/` conterá `<input>`, `<textarea>` ou `<select>` raw. Cada campo do projeto usa um componente padronizado. Uma vez construídos os primitivos, nunca mais se recria nada — só se instancia.
>
> **Ao concluir TODAS as fases:** atualizar `CLAUDE.md` e as skills `frontend-forms`, `frontend-expert`, `frontend-architecture`.

---

## Inventário completo — o que existe hoje

Auditoria de todos os `<input>`, `<textarea>` e `<select>` raw fora de `components/ui/`:

### `<input>` raw — 21 instâncias

| # | Arquivo | Linha | Tipo | Destino |
|---|---------|-------|------|---------|
| 1 | `app/login/page.tsx` | 196 | email (RHF register) | `RHFInput variant="auth"` |
| 2 | `app/login/page.tsx` | 218 | password (RHF + show/hide) | `RHFPasswordInput variant="auth"` |
| 3 | `app/login/page.tsx` | 238 | checkbox "lembrar" (sem RHF) | `Checkbox` |
| 4 | `app/cadastro/page.tsx` | 192 | text nome (RHF register) | `RHFInput variant="auth"` |
| 5 | `app/cadastro/page.tsx` | 212 | email (RHF register) | `RHFInput variant="auth"` |
| 6 | `app/cadastro/page.tsx` | 229 | tel (RHF + máscara inline) | `RHFInput variant="auth" mask={maskPhone}` |
| 7 | `app/cadastro/page.tsx` | 247 | password (RHF + show/hide) | `RHFPasswordInput variant="auth"` |
| 8 | `app/cadastro/page.tsx` | 267 | checkbox "termos" (sem RHF) | `Checkbox` |
| 9 | `configuracoes/ConfiguracoesClient.tsx` | 209 | text nome (RHF register) | `RHFInput` |
| 10 | `configuracoes/ConfiguracoesClient.tsx` | 224 | email (RHF register) | `RHFInput` |
| 11 | `configuracoes/ConfiguracoesClient.tsx` | 240 | text phone (readOnly, sem RHF) | `Input` direto (display only) |
| 12 | `configuracoes/ConfiguracoesClient.tsx` | 345 | password atual (RHF + show/hide) | `RHFPasswordInput` |
| 13 | `configuracoes/ConfiguracoesClient.tsx` | 363 | nova senha (RHF + show/hide) | `RHFPasswordInput` |
| 14 | `configuracoes/ConfiguracoesClient.tsx` | 380 | confirmar senha (RHF) | `RHFPasswordInput` |
| 15 | `configuracoes/ConfiguracoesClient.tsx` | 199 | file input (hidden, avatar) | **manter** — não é campo de formulário |
| 16 | `components/forms/NewChargeDrawer.tsx` | 522 | pix_key (Controller raw) | `RHFInput` |
| 17 | `components/layout/DashboardLayout.tsx` | 230 | search (sem state, sem RHF) | `Input` direto |
| 18 | `app/dashboard/cobrancas/ChargesClient.tsx` | 302 | search (state onChange) | `Input` direto |
| 19 | `app/dashboard/cobrancas/ChargesClient.tsx` | 311 | date filter (state onChange) | `Input type="date"` direto |
| 20 | `app/dashboard/cobrancas/ChargesClient.tsx` | 94 | checkbox select-all (tanstack) | `Checkbox` |
| 21 | `app/dashboard/cobrancas/ChargesClient.tsx` | 106 | checkbox por linha (tanstack) | `Checkbox` |

### `<textarea>` raw — 1 instância

| # | Arquivo | Linha | Tipo | Destino |
|---|---------|-------|------|---------|
| 1 | `components/forms/NewChargeDrawer.tsx` | 459 | custom_message (Controller + textareaRef) | `RHFTextarea` com suporte a `inputRef` |

### `<select>` raw — 2 instâncias (fora de components/ui/)

| # | Arquivo | Linha | Tipo | Destino |
|---|---------|-------|------|---------|
| 1 | `components/dashboard/PeriodSelect.tsx` | 11 | period navigation (sem RHF) | `Select` direto |
| 2 | `components/forms/NewChargeDrawer.tsx` | 504 | pix_key_type (Controller raw) | `RHFSelect` |

**Total: 24 instâncias para migrar.**

---

## Decisões de arquitetura

**D1 — Dois contextos visuais, um componente base.**
Auth pages (login, cadastro) são light-mode only e têm inputs mais altos (`py-3.5`) com sombra. Dashboard usa dark mode e `py-3` sem sombra. `Input` recebe `variant?: 'default' | 'auth'`. Nenhuma página passa `className` para sobrescrever estilo de campo.

**D2 — RHF wrapper = único ponto de entrada para campos controlados.**
Fora de `components/ui/`, ninguém usa `register()` diretamente. Todo campo de formulário usa `control` + wrapper RHF. `register()` some das páginas.

**D3 — `Checkbox` é um componente, não uma string de classes.**
O checkbox atual carrega ~200 caracteres de classes Tailwind com base64 SVG embutido. Isso é código de componente disfarçado de className. Vira `components/ui/Checkbox/Checkbox.tsx` com as classes internas.

**D4 — `RHFTextarea` suporta `inputRef` para cursor.**
O `custom_message` no `NewChargeDrawer` precisa controlar a posição do cursor (inserção de variáveis). `RHFTextarea` recebe prop `inputRef?: React.RefObject<HTMLTextAreaElement>` para expor o elemento DOM sem quebrar o `ref` do Controller.

**D5 — `FormField` se torna componente residual.**
Após a refatoração, `FormField` só existe para casos genuinamente custom (grupos de radio, toggles com label externa). Todo campo simples usa o wrapper RHF correspondente que carrega label+error internamente.

**D6 — `sonner` é o único toast. `react-hot-toast` é removido.**

---

## Fase 1 — Construir os primitivos completos

Nenhuma migração começa antes desta fase estar completa. Cada componente construído aqui elimina a necessidade de recriar qualquer coisa depois.

### 1.1 `components/ui/Input/Input.tsx` — adicionar `variant` e `rightSlot`

```tsx
type InputProps = {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightSlot?: React.ReactNode;       // para botão show/hide, ações, etc.
  variant?: 'default' | 'auth';      // auth = light-only, py-3.5, shadow-sm
  className?: string;
  // + todos os HTMLInputElement props via rest
};
```

- `variant="default"` (atual): `py-3`, dark mode tokens, sem sombra
- `variant="auth"`: `py-3.5 bg-white border-zinc-200 shadow-sm hover:border-zinc-300 font-medium` (sem classes dark:)
- `rightSlot`: `<div className="absolute right-3 top-1/2 -translate-y-1/2">` + padding-right no input aumenta para `pr-10` quando presente

### 1.2 `components/ui/Textarea/Textarea.tsx` — adicionar `label` e `error`

Alinhar interface com `Input`. Adicionar `label?` e `error?` com mesma renderização.

```tsx
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};
```

### 1.3 `components/ui/Select/Select.tsx` — adicionar `error`

```tsx
type SelectProps = {
  label?: string;
  error?: string;           // adicionar
  value?: string;
  onChange?: (value: string) => void;
  options: Option[];
  className?: string;
};
// renderizar {error && <p className="text-red-500 text-xs mt-1">{error}</p>} após o select
```

### 1.4 `components/ui/Checkbox/index.tsx` — componente novo

Encapsula toda a lógica visual do checkbox (checked state, ícone SVG, focus ring). Interface mínima — sem RHF, apenas props nativas:

```tsx
type CheckboxProps = {
  id?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  indeterminate?: boolean;    // para o "select all" do tanstack
};
```

Internamente: `appearance-none`, checked state via `data-[state=checked]` ou classe condicional, ícone checkmark embutido (sem base64). Tamanho padrão `w-4 h-4` (tabelas) com prop `size?: 'sm' | 'md'` para `w-5 h-5` (formulários de auth).

### 1.5 `components/forms/rhf/RHFInput.tsx` — remover `any`, adicionar `variant`

```tsx
import { Control, FieldValues, Path } from 'react-hook-form';
import { ComponentProps } from 'react';
import { Input } from '@/components/ui/Input/Input';

type Props<T extends FieldValues> = Omit<ComponentProps<typeof Input>, 'onChange' | 'value' | 'name'> & {
  name: Path<T>;
  control: Control<T>;
  mask?: (v: string) => string;
  // variant, label, icon, rightSlot, placeholder, type já vêm via Omit
};

export function RHFInput<T extends FieldValues>({ name, control, mask, ...props }: Props<T>)
```

### 1.6 `components/forms/rhf/RHFTextarea.tsx` — adicionar `label`, `error`, `inputRef`

```tsx
type Props = {
  name: string;
  control: any;
  label?: string;
  rows?: number;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;  // para controle de cursor
};

// render: passa label, error={fieldState.error?.message}, expõe inputRef via ref callback
render={({ field, fieldState }) => (
  <Textarea
    {...field}
    ref={(e) => {
      field.ref(e);
      if (inputRef) inputRef.current = e;
    }}
    label={label}
    error={fieldState.error?.message}
    rows={rows}
    placeholder={placeholder}
  />
)}
```

### 1.7 `components/forms/rhf/RHFSelect.tsx` — componente novo

```tsx
import { Controller, FieldValues, Path, Control } from 'react-hook-form';
import { Select } from '@/components/ui/Select/Select';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  options: { label: string; value: string }[];
};

export function RHFSelect<T extends FieldValues>({ name, control, label, options }: Props<T>) {
  return (
    <Controller name={name} control={control} render={({ field, fieldState }) => (
      <Select
        label={label}
        value={field.value}
        onChange={field.onChange}
        error={fieldState.error?.message}
        options={options}
      />
    )} />
  );
}
```

### 1.8 `components/forms/rhf/RHFPasswordInput.tsx` — componente novo

```tsx
'use client';
import { useState } from 'react';
import { FieldValues, Path, Control } from 'react-hook-form';
import { RHFInput } from './RHFInput';
import { IconEye, IconEyeOff } from '@/components/ui/Icons';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  variant?: 'default' | 'auth';
};

export function RHFPasswordInput<T extends FieldValues>({ name, control, label, placeholder, variant }: Props<T>) {
  const [show, setShow] = useState(false);
  return (
    <RHFInput
      name={name}
      control={control}
      type={show ? 'text' : 'password'}
      label={label}
      placeholder={placeholder}
      variant={variant}
      rightSlot={
        <button type="button" onClick={() => setShow(v => !v)}
          className="text-zinc-400 hover:text-zinc-600 transition-colors">
          {show ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
        </button>
      }
    />
  );
}
```

### 1.9 `components/ui/ConfirmModal.tsx` — componente novo

Modal genérico de confirmação destrutiva. Elimina o modal inline de exclusão de conta em `ConfiguracoesClient`:

```tsx
interface Props {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}
```

---

## Fase 2 — Migrar os formulários

Com os primitivos da Fase 1 prontos, cada migração abaixo é mecânica.

### 2.1 `app/login/page.tsx`

- Trocar `useForm` + `register` → usar `control`
- `<input type="email">` → `<RHFInput name="email" control={control} label="E-mail" icon={<IconMail />} variant="auth" />`
- `<input type="password">` + show/hide manual → `<RHFPasswordInput name="password" control={control} label="Senha" variant="auth" />`
- O link "Esqueceu sua senha?" fica fora do componente, no mesmo row que o label. Como `RHFPasswordInput` não expõe slot de label customizado, renderizar o row manualmente com `label` sem passar para o componente, e usar o componente sem `label`:
  ```tsx
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Senha</span>
      <a href="#" className="text-xs font-bold text-green-500 hover:underline">Esqueceu?</a>
    </div>
    <RHFPasswordInput name="password" control={control} variant="auth" placeholder="••••••••" />
  </div>
  ```
- `<input type="checkbox" id="remember">` → `<Checkbox id="remember" size="md" />`
- `toast` de `react-hot-toast` → `toast` de `sonner`
- Remover `<Toaster>` — `sonner` já está em `app/layout.tsx`

### 2.2 `app/cadastro/page.tsx`

- Remover `handlePhoneChange` inline (linhas 48–61) — `maskPhone` de `lib/formatters.ts` já faz isso
- Todos os campos → `RHFInput variant="auth"` com ícones correspondentes
- `<input type="password">` → `RHFPasswordInput variant="auth"`
- Dois checkboxes (`remember`, `terms`) → `<Checkbox>`
- `toast` de `react-hot-toast` → `sonner`
- Remover `<Toaster>`

### 2.3 `app/dashboard/configuracoes/ConfiguracoesClient.tsx`

**Aba Perfil — profileForm:**
- Trocar `profileForm.register('name')` → `RHFInput name="name" control={profileForm.control} label="Nome" icon={<IconUser />}`
- Trocar `profileForm.register('email')` → `RHFInput name="email" control={profileForm.control} label="E-mail" icon={<IconMail />}`
- Campo `phone` (readOnly, não faz parte do schema) → `<Input value={profile?.phone} readOnly icon={<IconPhone />}` direto (sem RHF)
- Remover os `<label>`, `<div className="relative">`, e `<p className="text-red-500">` manuais de cada campo

**Aba Segurança — pwForm:**
- `current_password` → `<RHFPasswordInput name="current_password" control={pwForm.control} label="Senha atual" />`
- `new_password` → `<RHFPasswordInput name="new_password" control={pwForm.control} label="Nova senha" />`
- `confirm_password` → `<RHFPasswordInput name="confirm_password" control={pwForm.control} label="Confirmar nova senha" />`
- Remover `showNewPw` e `showCurrentPw` do state local — esse estado passa para dentro de `RHFPasswordInput`

**Modal de exclusão:**
- Substituir o bloco `{showDelete && <div className="fixed inset-0...">...</div>}` (linhas 427–456) por:
  ```tsx
  <ConfirmModal
    open={showDelete}
    title="Excluir conta?"
    description="Esta ação é irreversível..."
    confirmLabel="Sim, excluir"
    variant="danger"
    loading={isPending}
    icon={<IconAlertOctagon className="w-6 h-6 text-red-500" />}
    onConfirm={onDeleteAccount}
    onCancel={() => setShowDelete(false)}
  />
  ```

### 2.4 `components/forms/NewChargeDrawer.tsx` — campos remanescentes

Dentro do `StepMessage`:
- `<textarea>` raw (linha 459) com `textareaRef` → `<RHFTextarea name="custom_message" control={control} inputRef={textareaRef} rows={9} />`
- `<Controller name="pix_key_type">` com `<select>` raw → `<RHFSelect name="pix_key_type" control={control} options={PIX_KEY_TYPE_OPTIONS} />`
- `<Controller name="pix_key">` com `<input>` raw → `<RHFInput name="pix_key" control={control} placeholder="Ex: 123.456.789-00" />`
- Remover os `<label>` e `<p className="text-red-500">` manuais desses três campos

### 2.5 `components/dashboard/PeriodSelect.tsx`

```tsx
<Select
  value={currentPeriod}
  onChange={(value) => router.push(`/dashboard?period=${value}`)}
  options={[
    { label: 'Últimos 7 dias', value: '7days' },
    { label: 'Este mês', value: 'month' },
  ]}
/>
```

### 2.6 `components/layout/DashboardLayout/DashboardLayout.tsx`

Substituir `<input type="text">` da busca global por `<Input>` direto (sem RHF, sem label, sem error). Manter `icon={<IconSearch />}` e o `className` de borda arredondada via prop `className`.

### 2.7 `app/dashboard/cobrancas/ChargesClient.tsx`

- Busca de cliente (linha 302) → `<Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} icon={<IconSearch />} placeholder="Buscar cliente..." />`
- Filtro de data (linha 311) → `<Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />`
- Checkbox select-all (linha 94) → `<Checkbox checked={table.getIsAllRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} disabled={...} indeterminate={table.getIsSomeRowsSelected()} />`
- Checkbox por linha (linha 106) → `<Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} disabled={...} />`

---

## Fase 3 — Limpar resíduos

### 3.1 Remover `react-hot-toast`
Após completar 2.1 e 2.2, verificar:
```bash
grep -r "react-hot-toast" --include="*.tsx" --include="*.ts" .
```
Se zerado: `npm uninstall react-hot-toast`.

### 3.2 Auditar `FormField`
Após as migrações, fazer:
```bash
grep -r "FormField" --include="*.tsx" .
```
Avaliar cada uso restante. Se todos forem legítimos (campos sem wrapper RHF), documentar. Se não houver nenhum, remover o componente.

### 3.3 Auditar `<input>` e `<select>` residuais
```bash
grep -rn "<input\|<textarea\|<select" --include="*.tsx" app/ components/
```
O único resultado aceitável são os arquivos dentro de `components/ui/`.

---

## Fase 4 — Atualizar documentação (OBRIGATÓRIO, não pular)

### 4.1 `CLAUDE.md` — seção `### Forms`

Reescrever completamente para refletir o padrão atual:

```markdown
### Forms

All forms use **React Hook Form + Zod**. Every controlled field uses a dedicated RHF wrapper —
never use `register()` or raw `<input>/<textarea>/<select>` outside `components/ui/`.

| Componente           | Usar quando                                             |
|----------------------|---------------------------------------------------------|
| `RHFInput`           | Texto, email, tel, número. Suporta icon, mask, variant  |
| `RHFPasswordInput`   | Senha com toggle show/hide embutido                     |
| `RHFTextarea`        | Área de texto longa. Suporta inputRef para cursor       |
| `RHFSelect`          | Select controlado por RHF com validação                 |
| `DatePickerField`    | Seleção de data com DayPicker                           |
| `Checkbox`           | Checkbox UI (tabelas, toggles não-RHF)                  |
| `FormField`          | Apenas para campos custom sem wrapper RHF dedicado      |

Para inputs de UI sem formulário (search, filtros), usar `Input` ou `Select` diretamente.
Auth pages usam `variant="auth"` nos campos RHF para o estilo light-mode.
Toast: somente `sonner`. `react-hot-toast` foi removido do projeto.
```

Atualizar também a seção `### Component structure` para incluir:
```
components/
  ui/
    Checkbox/index.tsx     # Checkbox genérico (tabelas, formulários auth)
    ConfirmModal.tsx       # Modal de confirmação genérico
  forms/
    rhf/
      RHFInput.tsx         # Controller-wrapped Input (tipado)
      RHFPasswordInput.tsx # Input senha com toggle
      RHFTextarea.tsx      # Controller-wrapped Textarea
      RHFSelect.tsx        # Controller-wrapped Select
```

### 4.2 Skill `frontend-forms`
Arquivo: `.claude/skills/frontend-forms/SKILL.md`

Reescrever exemplos. Mostrar:
- Uso correto de cada wrapper RHF com `control`
- `variant="auth"` para páginas de auth
- `inputRef` no `RHFTextarea`
- Regra explícita: "nunca usar `register()` em páginas"

### 4.3 Skill `frontend-expert`
Arquivo: `.claude/skills/frontend-expert/SKILL.md`

Adicionar a regra de inputs universais como princípio arquitetural do projeto.

### 4.4 Skill `frontend-architecture`
Arquivo: `.claude/skills/frontend-architecture/SKILL.md`

Atualizar mapa de `components/forms/rhf/` e `components/ui/` com os novos arquivos.

---

## Ordem de execução

```
1.1  Input — variant + rightSlot
1.2  Textarea — label + error
1.3  Select — error
1.4  Checkbox — componente novo
1.5  RHFInput — tipagem genérica
1.6  RHFTextarea — label + error + inputRef
1.7  RHFSelect — componente novo
1.8  RHFPasswordInput — componente novo
1.9  ConfirmModal — componente novo
──── primitivos prontos ────
2.1  login/page.tsx
2.2  cadastro/page.tsx
2.3  ConfiguracoesClient.tsx
2.4  NewChargeDrawer.tsx (campos remanescentes)
2.5  PeriodSelect.tsx
2.6  DashboardLayout.tsx (search)
2.7  ChargesClient.tsx (search + date + checkboxes)
──── migrações prontas ────
3.1  Remover react-hot-toast
3.2  Auditar FormField
3.3  Verificação final grep
──── limpeza pronta ────
4    CLAUDE.md + skills (OBRIGATÓRIO)
```

---

## Critérios de conclusão

- [ ] `grep -rn "<input\|<textarea\|<select" --include="*.tsx" app/ components/` retorna zero resultados fora de `components/ui/`
- [ ] `grep -r "react-hot-toast"` retorna zero resultados
- [ ] `grep -r "\.register(" --include="*.tsx" app/` retorna zero resultados (nenhum `register()` em páginas)
- [ ] `RHFPasswordInput`, `RHFSelect`, `Checkbox`, `ConfirmModal` existem e são usados
- [ ] `npm run build` sem erros TypeScript
- [ ] `npm run lint` sem warnings
- [ ] CLAUDE.md atualizado
- [ ] Skills `frontend-forms`, `frontend-expert`, `frontend-architecture` atualizadas
