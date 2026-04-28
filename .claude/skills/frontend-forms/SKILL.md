---
name: frontend-forms
description: Padrões de formulário do RecebeFácil com React Hook Form + Zod. Use ao criar qualquer formulário, schema de validação, máscara de input ou drawer multi-step.
when_to_use: Quando criar formulários, validações, máscaras de input, inputs controlados ou fluxos multi-step.
---

## Stack Obrigatória

- `react-hook-form` — controle de estado de formulário
- `zod` + `@hookform/resolvers/zod` — validação e tipagem
- Sem libs de máscara externas — usar funções de `lib/formatters.ts`

## Setup Padrão

```tsx
const schema = z.object({ ... });
type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
});
const { register, watch, setValue, handleSubmit, reset, formState: { errors } } = form;
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
  // Validações condicionais com superRefine
  if (data.send_pix_button && !data.pix_key) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Chave PIX obrigatória', path: ['pix_key'] });
  }
});
```

## Máscaras (lib/formatters.ts) — nunca libs externas

```ts
// Aplicar no onChange com setValue:
onChange={(e) => setValue('debtor_phone', maskPhone(e.target.value), { shouldValidate: true })}

maskMoney(raw: string): string    // "1500" → "R$ 15,00"
parseMoney(masked: string): number // "R$ 150,00" → 15000 (centavos)
maskPhone(raw: string): string    // "11999999999" → "(11) 99999-9999"
formatMoney(cents: number): string // 15000 → "R$ 150,00"
formatDate(date: Date): string    // Date → "30/04/2026"
interpolateTemplate(template, vars): string
```

## Exibição de Erros

```tsx
{errors.campo && (
  <p className="text-red-500 text-xs mt-1">{errors.campo.message}</p>
)}
```

## Inputs Controlados (Controller)

```tsx
<Controller
  name="campo"
  control={control}
  render={({ field }) => <input {...field} className="..." />}
/>
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
  const { control, watch, setValue, formState: { errors } } = useFormContext<FormData>();
}
```

## Validação por Step (antes de avançar)

```tsx
function nextStep() {
  const fieldsPerStep: (keyof FormData)[][] = [
    ['debtor_name', 'debtor_phone'],
    ['amount_display', 'due_date', 'description'],
    ['custom_message'],
  ];
  form.trigger(fieldsPerStep[step]).then(ok => { if (ok) setStep(s => s + 1); });
}
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

// Botão:
<button disabled={sending} className="... disabled:opacity-60 disabled:hover:scale-100">
  {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirmar'}
</button>
```

## Anti-patterns

- Nunca instalar `react-input-mask` ou similar — funções nativas de `lib/formatters.ts`
- Nunca submeter sem loading state no botão
- Nunca esquecer de resetar o step ao chamar `form.reset()` em multi-step
- Campos de senha sempre com `type="password"`
- Nunca logar dados de formulário (CPF, senha, chave PIX) no console
