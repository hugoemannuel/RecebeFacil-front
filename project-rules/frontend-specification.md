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
