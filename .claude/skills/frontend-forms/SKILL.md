---
name: frontend-forms
description: Padrões de formulário do RecebeFácil com React Hook Form + Zod. Use ao criar qualquer formulário, schema de validação, máscara de input ou drawer multi-step.
when_to_use: Quando criar formulários, validações, máscaras de input, inputs controlados ou fluxos multi-step.
---

## Regra Universal

Nenhum `<input>`, `<textarea>` ou `<select>` raw fora de `components/ui/`. Todo campo usa um wrapper RHF ou o componente UI diretamente. Nunca usar `register()` em páginas.

## Stack Obrigatória

- `react-hook-form` + `control` — nunca `register()` em páginas
- `zod` + `@hookform/resolvers/zod` — validação e tipagem
- Sem libs de máscara externas — usar funções de `lib/formatters.ts`
- Toast: somente `sonner` — `react-hot-toast` foi removido

## Setup Padrão

```tsx
const schema = z.object({ ... });
type FormData = z.infer<typeof schema>;

const { control, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
});
```

## Componentes RHF Disponíveis

| Componente | Caminho | Quando usar |
|---|---|---|
| `RHFInput` | `components/forms/rhf/RHFInput` | Texto, email, tel, número. Suporta `icon`, `mask`, `variant` |
| `RHFPasswordInput` | `components/forms/rhf/RHFPasswordInput` | Senha com toggle show/hide embutido |
| `RHFTextarea` | `components/forms/rhf/RHFTextarea` | Área de texto longa. Suporta `inputRef` para cursor |
| `RHFSelect` | `components/forms/rhf/RHFSelect` | Select controlado com validação |
| `DatePickerField` | `components/patterns/DatePickerField` | Seleção de data com DayPicker |
| `Checkbox` | `components/ui/Checkbox` | Checkbox UI (tabelas, toggles não-RHF) |

## Exemplos de Uso

### Campo de texto com ícone e máscara

```tsx
<RHFInput<FormData>
  name="phone"
  control={control}
  label="WhatsApp"
  type="tel"
  placeholder="(00) 00000-0000"
  icon={<IconPhone className="w-4 h-4" />}
  mask={maskPhone}
/>
```

### Senha com toggle

```tsx
<RHFPasswordInput<FormData>
  name="password"
  control={control}
  label="Senha"
  placeholder="Mínimo 8 caracteres"
  variant="auth"   // auth = light-mode, py-3.5, shadow-sm
/>
```

### Select controlado

```tsx
<RHFSelect<FormData>
  name="pix_key_type"
  control={control}
  label="Tipo de Chave"
  options={[
    { label: 'CPF', value: 'CPF' },
    { label: 'E-mail', value: 'EMAIL' },
  ]}
/>
```

### Textarea com inputRef (cursor)

```tsx
const textareaRef = useRef<HTMLTextAreaElement | null>(null);

<RHFTextarea<FormData>
  name="custom_message"
  control={control}
  label="Mensagem"
  rows={9}
  inputRef={textareaRef}
/>
```

### UI inputs sem formulário (search, filtros)

```tsx
<Input
  icon={<IconSearch className="w-4 h-4" />}
  placeholder="Buscar cliente..."
  value={searchQuery}
  onChange={e => setSearchQuery(e.target.value)}
/>
```

### Variant "auth" — páginas de login/cadastro

Usar `variant="auth"` em todos os campos RHF em páginas de autenticação (light-mode only, `py-3.5`, `shadow-sm`):

```tsx
<RHFInput<LoginForm>
  name="email"
  control={control}
  label="E-mail"
  type="email"
  icon={<IconMail className="w-5 h-5" />}
  variant="auth"
/>
```

## Schema Zod — Padrões do Projeto

```ts
const chargeSchema = z.object({
  debtor_name:    z.string().min(2, 'Nome obrigatório'),
  debtor_phone:   z.string().min(10, 'Telefone obrigatório'),
  amount_display: z.string().min(1).refine(val => parseMoney(val) >= 100, { message: 'Valor mínimo R$ 1,00' }),
  due_date:       z.date().refine(val => { const t = new Date(); t.setHours(0,0,0,0); return val >= t; }, { message: 'Data deve ser hoje ou futura' }),
  description:    z.string().min(3).max(200),
  recurrence:     z.enum(['ONCE', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  custom_message: z.string().min(5),
  send_pix_button: z.boolean(),
  pix_key:        z.string().optional(),
  pix_key_type:   z.enum(['CPF', 'CNPJ', 'PHONE', 'EMAIL', 'EVP']).optional(),
}).superRefine((data, ctx) => {
  if (data.send_pix_button && !data.pix_key) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Chave PIX obrigatória', path: ['pix_key'] });
  }
});
```

## Máscaras (lib/formatters.ts) — nunca libs externas

```ts
maskMoney(raw: string): string     // "1500" → "R$ 15,00"
parseMoney(masked: string): number  // "R$ 150,00" → 15000 (centavos)
maskPhone(raw: string): string     // "11999999999" → "(11) 99999-9999"
formatMoney(cents: number): string  // 15000 → "R$ 150,00"
formatDate(date: Date): string     // Date → "30/04/2026"
interpolateTemplate(template, vars): string
```

## Formulários Multi-step com FormProvider

```tsx
// Pai: compartilha form context com sub-componentes
<FormProvider {...form}>
  <form onSubmit={handleSubmit(onSubmit)}>
    {step === 0 && <StepDebtor />}
    {step === 1 && <StepDetails />}
  </form>
</FormProvider>

// Sub-componente: acessa form sem prop drilling
function StepDebtor() {
  const { control, watch, setValue } = useFormContext<FormData>();
}
```

## Validação por Step

```tsx
form.trigger(['debtor_name', 'debtor_phone']).then(ok => { if (ok) setStep(s => s + 1); });
```

## Loading State em Submit

```tsx
const [sending, setSending] = useState(false);

async function onSubmit(data: FormData) {
  setSending(true);
  try {
    const result = await serverAction(data);
    if (result.success) { toast.success('Sucesso!'); reset(); }
    else toast.error(result.error ?? 'Erro. Tente novamente.');
  } finally {
    setSending(false);
  }
}
```

## Anti-patterns

- Nunca `register()` em páginas — sempre `control` + wrapper RHF
- Nunca `<input>/<textarea>/<select>` raw fora de `components/ui/`
- Nunca instalar `react-input-mask` ou similar
- Nunca importar `react-hot-toast` — usar `sonner`
- Nunca submeter sem loading state no botão
- Nunca logar dados de formulário (CPF, senha, chave PIX) no console
