# Especificação de Produto e Front-End - RecebeFácil

Este documento detalha a arquitetura, padrões visuais e regras de negócio do front-end. O objetivo é garantir uma experiência **Premium**, **Mobile-First** e **Focada em Conversão** para os nossos usuários.

---

## 1. Visão Geral e Público-Alvo

O **RecebeFácil** é focado em pequenos empreendedores (Barbeiros, Personal Trainers, Clínicas) que não são necessariamente técnicos e utilizam o celular o dia todo. 

**Implicação no Front-End:**
- A interface deve ser absurdamente simples.
- Textos diretos e sem jargões financeiros ("Mais dinheiro na mão" em vez de "Otimização de Fluxo de Caixa").
- O layout mobile não é uma adaptação do desktop, ele é a **prioridade número 1**.

---

## 2. Padrões Visuais e de Design (Premium Fintech)

O design deve passar confiança de banco, mas com a agilidade de uma startup de tecnologia (SaaS).

### 2.1. Cores Principais
- **Background Clássico:** Branco (`bg-white` ou `bg-zinc-50`) para a área de trabalho clara e formulários.
- **Background Premium (Dark Mode/Destaques):** Azul muito escuro (`bg-[#0b1521]`, `bg-[#152336]`) para passar a sensação de "Fintech de Alta Performance".
- **Cor de Ação (Accent):** Verde Néon/Esmeralda (`text-green-500`, `bg-green-500` - `#22c55e`). Representa "dinheiro", "sucesso" e "ação".

### 2.2. Tipografia e Espaçamentos
- Fonte sem serifa moderna (Inter ou sistema nativo via `font-sans`).
- Abuso de espaçamentos generosos (respiro). Componentes não devem parecer "espremidos".
- Títulos muito marcados (`font-extrabold`, `tracking-tight`).

### 2.3. Micro-interações
- Botões devem ter efeito de hover (`hover:bg-green-600`) e um leve scale ou sombra ao passar o mouse (`transition-transform hover:scale-[1.02] shadow-green-500/20`).
- Inputs ao receberem foco devem brilhar com a cor da marca (`focus:ring-2 focus:ring-green-500/50`).

---

## 3. Arquitetura Técnica (Next.js App Router)

- **Server Components vs Client Components:** O projeto usa o padrão do Next.js App Router. Páginas estáticas ou de SEO (como Landing Page) rodam no servidor. Telas interativas (formulários, dashboards) devem usar `"use client";`.
- **Ícones:** Para evitar bibliotecas pesadas e manter o bundle mínimo, estamos construindo os SVGs nativamente como componentes React (padrão Lucide Icons).
- **Estilização:** Tailwind CSS utilitário para 100% da estilização. Proibido CSS customizado solto, a menos que extremamente necessário (ex: animações complexas que o Tailwind não cobre nativamente).

---

## 4. Regras de Interface e UX

### 4.1. Product-Led Growth (PLG)
O design deve sempre incentivar o usuário a dar o próximo passo:
- Telas vazias (Empty States) nunca devem ser apenas "Nenhum cliente cadastrado". Devem ter um botão gigante: "Adicionar meu primeiro cliente".
- O link de cobrança (WhatsApp) deve ter destaque imenso, com botão nativo de "Copiar" e "Abrir no WhatsApp".

### 4.2. Tratamento de Estados
Todo botão de ação que faz requisição à API (ex: `onSubmit`) deve ter:
- Estado de "Loading" (spinner ou skeleton).
- Feedback visual claro em caso de Sucesso (Toast verde).
- Tratamento de Erro humanizado (Toast vermelho). Não mostrar "Error 500", mas sim "Ops, algo deu errado. Tente novamente."

---

## 5. Padrões de Implementação (Forms, Auth e APIs)

### 5.1. Formulários e Validação
- **React Hook Form + Zod:** Todos os formulários devem obrigatoriamente usar `react-hook-form` para controle de estado de alta performance e `zod` (`@hookform/resolvers/zod`) para validação rigorosa de schemas e tipagem estática (TypeScript).
- **Máscaras Leves:** Evitamos bibliotecas pesadas de máscaras (ex: `react-input-mask`). Utilizamos funções utilitárias nativas interceptando o `onChange` do RHF (como fizemos na máscara de telefone e alternância visual de senhas).

### 5.2. Autenticação e Segurança
- **Server Actions:** O fluxo de autenticação e rotas críticas utiliza Next.js Server Actions (`/app/actions`) para orquestrar a comunicação de forma segura com o Back-End sem expor a lógica no navegador.
- **Cookies HttpOnly:** Os tokens JWT **não** devem ser guardados em `localStorage` (prevenção contra XSS). Eles são salvos via Server Actions em cookies `HttpOnly` e validados globalmente pelo `middleware.ts`.

### 5.3. Requisições (HTTP)
- **Axios:** Utilizamos uma instância padronizada do `axios` (`services/api.ts`) para realizar as chamadas REST ao Back-End.

---

## 6. Arquitetura de Componentização (Clean Code)

Para evitar arquivos gigantes ("Spaghetti Code") e garantir a escalabilidade do Front-End, adotamos a seguinte estrutura de diretórios e divisão de responsabilidades:

### 6.1. Estrutura de Pastas (`/components`)
- `/components/ui`: Componentes genéricos, atômicos e reaproveitáveis (ex: `Input.tsx`, `Button.tsx`, `Icons.tsx`). Eles são "burros": apenas recebem props (inclusive `forwardRef` para forms) e não possuem regras de negócio profundas.
- `/components/layout`: Componentes de estrutura visual e "cascas" das páginas (ex: `AuthLayout.tsx`, `DashboardLayout.tsx`). Servem para não repetirmos HTML de estrutura.
- `/components/forms`: Componentes específicos de formulários de negócio (ex: `LoginForm.tsx`, `RegisterForm.tsx`). Estes contêm a lógica do `react-hook-form`, os schemas do Zod e chamam as Server Actions.
- `/utils` ou `/lib`: Funções utilitárias puras (ex: `formatters.ts` para máscaras de input).

### 6.2. Regras de Clean Code no Next.js
- **Páginas Enxutas:** Os arquivos em `/app/.../page.tsx` devem ser meros orquestradores. Eles instanciam Layouts e importam os componentes menores, raramente ultrapassando 50 linhas.
- **Isolamento de SVGs:** Todos os ícones em SVG devem estar extraídos, preferencialmente centralizados num único arquivo de biblioteca de ícones (`components/ui/Icons.tsx`), para não poluir a lógica dos componentes visuais.
- **DRY (Don't Repeat Yourself):** Se uma estrutura visual se repete (como o painel escuro das telas de login/cadastro), ela deve ser extraída para um componente de Layout comum imediatamente.

---

## 7. Controle de Acesso por Módulo (Plan Gating — Front-End)

O menu lateral do `DashboardLayout` e as rotas da área logada devem refletir exatamente a matriz de planos definida no `backend-specification.md` (Seção 9).

### 7.1. Matriz de Módulos por Plano

| Módulo               | FREE | STARTER | PRO |
|----------------------|:----:|:-------:|:---:|
| Home (Dashboard)     | ✅   | ✅      | ✅  |
| Cobranças            | ✅   | ✅      | ✅  |
| Clientes             | ❌   | ✅      | ✅  |
| Relatórios           | ❌   | ✅      | ✅  |
| Importação via Excel | ❌   | ✅      | ✅  |

### 7.2. Como Implementar

1. **Fonte da Verdade:** O plano do usuário (`plan_type`) deve ser lido uma única vez e armazenado num React Context (`UserPlanContext`) ou passado como prop para o `DashboardLayout`.
2. **Menu Dinâmico:** O array `menuItems` do `DashboardLayout` deve ter um campo `requiredPlan`, e a lista renderizada filtra os itens de acordo com o plano atual.
3. **Paywall — Nunca Bloquear com Erro:** Se o usuário tentar acessar uma rota de módulo bloqueado, **não** redirecionar para uma página de erro. Em vez disso:
   - Exibir um modal ou banner de upgrade com a mensagem clara do benefício desbloqueado.
   - Botão de ação: **"Fazer upgrade para [STARTER/PRO]"** → redireciona para `/planos`.
4. **Itens de Menu Bloqueados:** Em vez de esconder completamente, itens bloqueados podem ser exibidos com opacidade reduzida e um ícone de cadeado 🔒, incentivando o upgrade (Product-Led Growth).

### 7.3. Página `/planos`

- Deve exibir os 3 planos (FREE, STARTER, PRO) com tabela comparativa de recursos.
- Toggle **Mensal / Anual** com destaque do desconto (ex: badge "Economize 20%").
- O plano atual do usuário deve estar visualmente destacado (borda verde, badge "Plano Atual").
- Ao clicar em "Assinar": chamar a Server Action que aciona o back-end para gerar o link de checkout do Asaas e redirecionar o usuário.

---

## 8. Importação de Clientes via Excel (UI — Plano STARTER+)

### 8.1. Componente de Upload

- Localização: `/components/forms/ExcelImportForm.tsx`
- Interface de **drag & drop** com fallback de botão "Selecionar arquivo".
- Aceitar apenas `.xlsx` e `.csv`.
- Exibir preview das primeiras linhas do arquivo antes de confirmar o envio.
- Após o envio, exibir um relatório de resultado: `X cadastros criados com sucesso` e, se houver, a lista de linhas com erro e o motivo.

### 8.2. Arquivo de Exemplo para Download

- Um link fixo "📥 Baixar modelo de planilha" deve estar visível na tela de importação.
- Este link aponta para `GET /charges/import/template` no back-end (retorna o `.xlsx` modelo).
- Colunas obrigatórias no modelo: `nome`, `telefone`, `valor`, `data_vencimento`, `descricao`.

### 8.3. Estados da UI

| Estado        | Comportamento                                                                 |
|---------------|-------------------------------------------------------------------------------|
| Idle          | Área de drag & drop com instrução e botão de download do modelo               |
| Selecionado   | Preview da tabela com as primeiras 5 linhas do arquivo                        |
| Enviando      | Spinner + "Importando X linhas..."                                            |
| Sucesso       | Card verde: "X cobranças criadas com sucesso"                                 |
| Erro parcial  | Card amarelo com accordion mostrando cada linha com erro e o motivo           |
| Erro total    | Toast vermelho: "Arquivo inválido. Verifique o formato e tente novamente."    |

---

## 9. Fluxo de Checkout e Assinatura (UI)

O front-end **não processa** dados de cartão diretamente. O papel do front-end é:

1. Apresentar os planos na página `/planos`.
2. Chamar a Server Action `createCheckout(planType, period)`.
3. A Server Action faz `POST /subscription/checkout` no back-end e recebe o `invoiceUrl` do Asaas.
4. Front-end redireciona para o `invoiceUrl` (checkout hospedado e seguro do Asaas).

> ⚠️ Nunca criar formulários de cartão de crédito no front-end próprio. O checkout é sempre externo (Asaas), que é certificado PCI DSS.

### 9.1. Feedback pós-pagamento

- Após o retorno do Asaas, exibir uma tela de confirmação: **"Seu plano foi ativado! 🎉"**
- O status real da assinatura só deve ser atualizado após a confirmação via webhook no back-end — **não confiar apenas no redirect do Asaas**.
- Usar polling ou Server-Sent Events (SSE) para verificar se o plano foi confirmado no banco antes de liberar os módulos.

---

## 10. Criação de Cobrança — Fluxo de UI (MVP Core)

A criação de cobrança é a funcionalidade **mais crítica do produto** e deve ser extremamente fluida. O botão "Nova Cobrança" no header abre um **modal lateral (drawer)** — não uma nova página — para manter o contexto do lojista.

### 10.1. Estrutura do Drawer de Nova Cobrança

**Componente:** `components/forms/NewChargeDrawer.tsx` (`"use client"`)

O drawer desliza da direita com `translate-x` animado. Tem 4 **etapas (steps)** com indicador de progresso no topo:

```
[1 Devedor] → [2 Cobrança] → [3 Mensagem WhatsApp] → [4 Confirmar & Enviar]
```

#### Step 1 — Quem vai receber?
- Campo de busca inteligente: digitar nome ou telefone busca clientes existentes no banco
- Se não encontrar, exibe opção "➕ Cadastrar novo contato"
- Mini-formulário inline: `Nome`, `Telefone` (máscara: +55 (11) 99999-9999)
- Seleção exibe card do cliente com avatar e histórico resumido

#### Step 2 — Dados da Cobrança
- **Valor** (campo com máscara monetária BRL, ex: `R$ 150,00`)
- **Data de vencimento** (date picker com destaque do dia atual)
- **Descrição** (textarea, max 200 chars, ex: "Corte de cabelo - Abril/2026")
- **Recorrência** (toggle): Única | Mensal | Semanal | Anual

#### Step 3 — Personalizar Mensagem WhatsApp ⭐ (Diferencial)

Esta é a tela de **maior valor percebido** do produto. Dividida em 2 colunas:

**Coluna esquerda — Editor:**
- Selector de **template base** (dropdown): "Cobrança Inicial" | "Lembrete Amigável" | "Urgente" | "Personalizado"
- **Textarea editável** com o template populado e destaque de variáveis `{{nome}}` em chips coloridos
- Toolbar de formatação: **N** (negrito) | _I_ (itálico) | botões de emoji populares (💰 📅 ✅ ⚠️)
- Toggle "Incluir QR Code como imagem" (se lojista tem QR Code salvo)
- Toggle "Incluir botão PIX nativo" (se lojista tem chave PIX configurada) — **recomendado, marcado por padrão**

**Coluna direita — Preview ao vivo:**
- Simulação visual da **tela do WhatsApp** com as mensagens que serão enviadas
- Exibe em ordem: 1) Texto, 2) Imagem QR (se ativado), 3) Botão PIX (se ativado)
- Preview atualiza em tempo real conforme o lojista edita
- Estilo: fundo `#e5ddd5` (cor do fundo do WhatsApp), balões de mensagem verdes/brancos

#### Step 4 — Confirmar & Enviar
- Resumo compacto: nome do devedor, valor, vencimento, tipo de mensagem
- Seletor: **"Enviar agora"** ou **"Agendar para"** (date/time picker)
- Botão principal: `Enviar Cobrança via WhatsApp 🚀` (verde, full-width, com loading state)
- Ao confirmar: toast de sucesso + drawer fecha + lista de cobranças atualiza

### 10.2. Validações com Zod

```typescript
const chargeSchema = z.object({
  debtor_name: z.string().min(2, 'Nome obrigatório'),
  debtor_phone: z.string().min(10, 'Telefone obrigatório'),
  amount_display: z.string().min(1, 'Valor obrigatório').refine((val) => parseMoney(val) >= 100, { message: 'Valor mínimo R$ 1,00' }),
  due_date: z.date({ error: 'Data obrigatória' }).refine((val) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return val >= today;
  }, { message: 'A data deve ser futura ou hoje' }),
  description: z.string().min(3, 'Descrição obrigatória').max(200),
  recurrence: z.enum(['ONCE', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  custom_message: z.string().min(5, 'Mensagem obrigatória'),
  send_pix_button: z.boolean().default(true),
  pix_key: z.string().optional(),
  pix_key_type: z.enum(['CPF', 'CNPJ', 'PHONE', 'EMAIL', 'EVP']).optional(),
});
```

### 10.3. Estados da UI do Drawer

| Estado | Comportamento |
|---|---|
| Fechado | `translate-x-full` — invisível |
| Abrindo | Animação slide-in + overlay escurecido |
| Salvando | Botão com spinner, campos desabilitados |
| Sucesso | Toast verde "Cobrança enviada! ✅" + drawer fecha |
| Erro API | Toast vermelho "Erro ao enviar. Tente novamente." |
| Sem PIX configurado | Banner amarelo no Step 3 "Configure sua chave PIX nas configurações para ativar o botão nativo" |

---

## 11. Configurações de WhatsApp do Lojista

**Rota:** `/dashboard/configuracoes` (tab "WhatsApp & PIX")
**Componente:** `components/forms/WhatsappSettingsForm.tsx`

### 11.1. Campos

| Campo | UI | Notas |
|---|---|---|
| Chave PIX | Input | Formato varia por tipo |
| Tipo da chave PIX | Select | CPF / CNPJ / Telefone / E-mail / Aleatória (EVP) |
| Nome no pagamento | Input (max 25 chars) | Contador de caracteres visível, ex: "João Barbearia" |
| QR Code PIX | Upload de imagem | Preview circular + botão remover |
| Template padrão | Textarea | Com variáveis destacadas em chips |

### 11.2. Preview do QR Code

- Ao fazer upload, exibir preview circular (como avatar) com a imagem do QR Code
- Botão "Testar envio" → envia uma mensagem de teste para o próprio WhatsApp do lojista

### 11.3. Regras de Negócio

- Se o lojista não tiver chave PIX configurada, a opção "Botão PIX nativo" fica desabilitada no Step 3 do drawer (com tooltip explicativo)
- Se não tiver QR Code, a opção "Incluir QR Code" fica desabilitada
- O `pix_merchant_name` tem limite **rígido de 25 caracteres** (protocolo PIX — exibido no app de pagamento do cliente)


