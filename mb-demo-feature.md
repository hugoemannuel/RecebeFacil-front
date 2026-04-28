# MB: Feature — Demo Ao Vivo (Front-end)

## Objetivo
Substituir o botão "Ver demonstração" da landing por um formulário real que envia uma
mensagem WhatsApp na hora. Após o uso: tela de sucesso + CTA. Na segunda tentativa: modal de conversão.

---

## Localização na Landing

Arquivo: `app/page.tsx`

Botão atual a substituir:
```tsx
<button ...>
  <IconPlayCircle .../> Ver demonstração
</button>
```

Substituir por `<DemoSection />` (componente Client).

---

## Arquivos a criar

```
app/(landing)/components/
  DemoSection.tsx       — form + estados (idle / loading / success)
  DemoBlockedModal.tsx  — modal de conversão (segunda tentativa)
```

> Se não existir pasta `(landing)/components/`, criar. Ou colocar direto em `app/components/`.

---

## `DemoSection.tsx`

### Estados
```ts
type State = 'idle' | 'loading' | 'success' | 'blocked'
```

### Fluxo
1. **idle** → form com campos `name` + `phone` + botão "Receber demonstração agora"
2. Submit → `POST /demo/send` → **loading** (spinner no botão, inputs disabled)
3. Resposta `{ sent: true }` → **success** → esconde form, mostra tela de sucesso
4. Resposta `{ blocked: true }` → **blocked** → abre `DemoBlockedModal`
5. Erro de rede → toast de erro, volta para **idle**

### Chamada de API

```ts
// app/actions/demo.ts  (Server Action ou função cliente)
export async function sendDemo(data: { name: string; phone: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/demo/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json(); // { sent: boolean, blocked: boolean }
}
```

### Tela de sucesso (estado `success`)
```
"Mensagem enviada! Confira seu WhatsApp 📲"
[Criar conta grátis →]  ← Link href="/cadastro"
```

### Validação (React Hook Form + Zod)
```ts
const schema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/), // BR
})
```

---

## `DemoBlockedModal.tsx`

Modal simples (sem biblioteca externa — usar dialog nativo ou estrutura já usada no projeto).

```
Título:  "Você já testou o RecebeFácil!"
Texto:   "Que tal criar sua conta grátis e começar a cobrar de verdade?"
Botão 1: "Criar conta — é grátis"  → href="/cadastro"
Botão 2: "Fechar"                  → fecha modal
```

Abrir via prop `open: boolean` controlada pelo estado `blocked` do `DemoSection`.

---

## Integração em `page.tsx`

```tsx
// Importar DemoSection e substituir o botão "Ver demonstração"
// DemoSection é 'use client' — encapsular em Suspense se necessário
<DemoSection />
```

---

## Observações

- **Sem localStorage/cookie** para detectar uso anterior — o back-end retorna `blocked: true` e o front reage.
- **Formato de telefone**: aceitar formato BR (11 dígitos com DDD) e enviar limpo (só números) para a API.
- **Design**: seguir o sistema de cores existente — verde `#22c55e` (green-500), fundo branco, bordas zinc. Botão primário igual ao "Começar grátis" da hero.
- **Mobile-first**: inputs full-width em mobile, lado a lado (sm:flex-row) em desktop.
