# MB: Feature — Demo Ao Vivo (Front-end)

## Objetivo
Transformar o botão "Ver demonstração" em "Teste agora". Ao clicar, abre um modal com
formulário de nome + telefone que dispara uma mensagem WhatsApp real para o visitante.

---

## Estado atual em `app/page.tsx` (linha 51–53)

```tsx
// ANTES — botão sem ação
<button className="w-full sm:w-auto ...">
  <IconPlayCircle className="w-5 h-5 text-zinc-700" /> Ver demonstração
</button>

// DEPOIS — substituir por:
<DemoButton />
```

`page.tsx` continua **Server Component** — toda a interatividade fica encapsulada em `DemoButton`.

---

## Arquivos a criar

```
app/(landing)/components/
  DemoButton.tsx       — botão "Teste agora" + gerencia abertura do DemoModal
  DemoModal.tsx        — modal com form (idle / loading / success)
  DemoBlockedModal.tsx — modal de conversão (segunda tentativa)
```

> Se não existir `app/(landing)/components/`, criar. Ou usar `app/components/` seguindo
> a convenção já adotada no projeto.

---

## `DemoButton.tsx`

```tsx
'use client'
// Renderiza o botão e controla qual modal está aberto.
// Estados: nenhum aberto | DemoModal aberto | DemoBlockedModal aberto

export function DemoButton() {
  const [modal, setModal] = useState<'demo' | 'blocked' | null>(null)

  return (
    <>
      <button
        onClick={() => setModal('demo')}
        className="w-full sm:w-auto bg-white hover:bg-zinc-50 border border-zinc-200
                   text-zinc-900 px-8 py-4 rounded-xl md:rounded-full font-bold text-lg
                   flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <IconPlayCircle className="w-5 h-5 text-zinc-700" /> Teste agora
      </button>

      <DemoModal
        open={modal === 'demo'}
        onClose={() => setModal(null)}
        onBlocked={() => setModal('blocked')}
      />

      <DemoBlockedModal
        open={modal === 'blocked'}
        onClose={() => setModal(null)}
      />
    </>
  )
}
```

---

## `DemoModal.tsx`

### Estados internos

```ts
type FormState = 'idle' | 'loading' | 'success'
```

### Estrutura visual

Modal centralizado com overlay escuro (`fixed inset-0 bg-black/50 z-50`).
Painel branco, `rounded-2xl`, `max-w-md`, `p-6 md:p-8`.
Fechar via ícone ×, clique no overlay ou tecla Esc.

### Fluxo

1. **idle** → form com `RHFInput` para `name` + `phone` + botão "Receber no WhatsApp"
2. Submit → `POST /demo/send` → **loading** (spinner no botão, inputs disabled)
3. `{ sent: true }` → **success** → esconde form, mostra tela de sucesso dentro do modal
4. `{ blocked: true }` → chama `onBlocked()` (fecha este modal, abre `DemoBlockedModal`)
5. Erro de rede → toast `sonner`, volta para **idle**

### Chamada de API

```ts
// app/actions/demo.ts
export async function sendDemo(data: { name: string; phone: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/demo/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json() // { sent: boolean, blocked: boolean }
}
```

### Validação (React Hook Form + Zod)

```ts
const schema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  phone: z.string().regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Telefone inválido'),
})
```

Usar `RHFInput` com `mask` de telefone via `maskPhone` de `lib/formatters.ts`.

### Tela de sucesso (dentro do modal, estado `success`)

```
Ícone ✅ verde
"Mensagem enviada! Confira seu WhatsApp 📲"
Subtexto: "Gostou? Crie sua conta e comece a cobrar automaticamente."
[Criar conta grátis →]  ← Link href="/cadastro"
[Fechar]
```

---

## `DemoBlockedModal.tsx`

Modal simples usando a mesma estrutura de overlay do `DemoModal`.

```
Título:  "Você já testou o RecebeFácil!"
Texto:   "Que tal criar sua conta grátis e começar a cobrar de verdade?"
Botão 1: "Criar conta — é grátis"  → href="/cadastro"
Botão 2: "Fechar"                  → onClose()
```

---

## Integração em `page.tsx`

```tsx
// 1. Importar DemoButton (client component)
import { DemoButton } from './(landing)/components/DemoButton'

// 2. Substituir o <button> existente (linhas 51–53):
<DemoButton />
```

`page.tsx` permanece Server Component — nenhum `'use client'` necessário no arquivo.

---

## Observações

- **Sem localStorage/cookie** para detectar uso anterior — o back-end retorna `blocked: true`.
- **Formato de telefone**: aceitar formato BR (com DDD), enviar só dígitos para a API (`replace(/\D/g, '')`).
- **Design**: seguir o sistema de cores existente — `#22c55e` (green-500), fundo branco, bordas zinc.
  Botão "Receber no WhatsApp" igual ao estilo primário ("Começar grátis").
- **Ícones**: usar `IconPlayCircle` já existente em `page.tsx`; criar via `Icons.tsx` se precisar de
  ícone de WhatsApp ou check dentro do modal.
- **Toast**: usar `sonner` apenas — `react-hot-toast` foi removido do projeto.
- **Mobile-first**: inputs full-width em mobile, painel do modal com `mx-4` em telas pequenas.
