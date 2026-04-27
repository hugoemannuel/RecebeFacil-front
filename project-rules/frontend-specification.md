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
