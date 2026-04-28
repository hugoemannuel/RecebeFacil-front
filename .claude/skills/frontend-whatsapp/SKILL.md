---
name: frontend-whatsapp
description: Templates de mensagem WhatsApp, preview ao vivo, variáveis interpoladas e drawer de nova cobrança no RecebeFácil.
when_to_use: Quando trabalhar com NewChargeDrawer, WhatsAppPreview, templates de mensagem, variáveis {{nome}}/{{valor}}, drawer multi-step de cobrança.
---

## Componente WhatsAppPreview

```tsx
<WhatsAppPreview
  senderName={userName}
  message={previewMessage}     // texto já interpolado
  showQrCode={false}
  showPixButton={values.send_pix_button}
  amount={values.amount_display}
/>
// Fundo: #e5ddd5 (cor real do WhatsApp)
// Atualiza em tempo real conforme o lojista edita
```

## Interpolação (lib/formatters.ts)

```ts
const previewMessage = interpolateTemplate(values.custom_message, {
  nome:        values.debtor_name || 'Cliente',
  valor:       values.amount_display || 'R$ 0,00',
  vencimento:  values.due_date ? formatDate(values.due_date) : '--/--/----',
  descricao:   values.description || '',
  nome_empresa: userName,
  dias_atraso: '0',
});
```

## Variáveis Disponíveis

| Variável           | Substituída por              |
|--------------------|------------------------------|
| `{{nome}}`         | Nome do devedor              |
| `{{valor}}`        | Valor formatado (R$ X,XX)    |
| `{{vencimento}}`   | Data vencimento (dd/MM/yyyy) |
| `{{descricao}}`    | Descrição da cobrança        |
| `{{nome_empresa}}` | Nome do lojista              |
| `{{dias_atraso}}`  | Dias em atraso               |

## Chips Clicáveis de Variáveis

```tsx
const VARIABLES = ['{{nome}}', '{{valor}}', '{{vencimento}}', '{{descricao}}', '{{nome_empresa}}'];

function insertVariable(variable: string) {
  const el = textareaRef.current;
  const start = el.selectionStart;
  const current = values.custom_message || '';
  setValue('custom_message', current.slice(0, start) + variable + current.slice(start));
  setTimeout(() => { el.selectionStart = el.selectionEnd = start + variable.length; el.focus(); }, 0);
}

{VARIABLES.map(v => (
  <button type="button" onClick={() => insertVariable(v)}
    className="text-[11px] font-mono bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-lg hover:bg-green-100">
    {v}
  </button>
))}
```

## Templates Padrão

```ts
const TEMPLATE_OPTIONS = [
  { label: 'Cobrança Inicial',  value: DEFAULT_TEMPLATE },
  { label: 'Lembrete Amigável', value: `Oi *{{nome}}*! 😊\n\nSua cobrança de *{{valor}}* vence em *{{vencimento}}*.\n\nPague via PIX! 💳` },
  { label: 'Urgente',           value: `⚠️ *{{nome}}*, sua cobrança de *{{valor}}* vence *hoje*!\n\nPague agora via PIX.` },
];
```

## Estrutura do Drawer Multi-step

```
[1 Devedor] → [2 Cobrança] → [3 Mensagem] → [4 Confirmar]
```

- Step 2 (Mensagem) expande drawer: `maxWidth: step === 2 ? '900px' : '480px'`
- Layout dual-column no step 2: editor (esquerda) + WhatsAppPreview (direita, 380px)
- ESC fecha o drawer (via `useEffect` + `removeEventListener`)

## PIX Inline (sem chave configurada)

```tsx
{values.send_pix_button && !hasPixKey && (
  <div className="bg-zinc-50 border rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
    <div className="grid grid-cols-3 gap-3">
      <select name="pix_key_type">CPF / CNPJ / Celular / E-mail / Aleatória</select>
      <input name="pix_key" placeholder="Ex: 123.456.789-00" className="col-span-2" />
    </div>
  </div>
)}
```

## Ordem de Envio (back-end)

1. Mensagem de texto (sempre)
2. Imagem QR Code (se `pix_qr_code_url` configurado)
3. Botão PIX nativo Z-API (se `pix_key` + `send_pix_button: true`)

## Formatação WhatsApp no Textarea

- `*negrito*` → botão **N** no toolbar
- `_itálico_` → botão _I_ no toolbar
- Emojis rápidos: 💰 📅 ✅ ⚠️ via botões inline

## Anti-patterns

- Nunca exibir chave PIX do lojista em texto claro no preview
- `pix_merchant_name` máx 25 chars (protocolo PIX — exibido no app do pagador)
- Nunca pre-popular telefone do devedor com DDI antes de limpar máscara: `phone.replace(/\D/g, '')` antes de enviar ao back-end
