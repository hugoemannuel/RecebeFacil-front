# Plano de Implementação: Módulo de Cobranças (Front-End)

Este documento descreve a arquitetura, telas e regras de negócio para a implementação do módulo de Cobranças (`/dashboard/cobrancas`) no front-end do RecebeFácil. O foco principal é criar uma experiência premium (High-End) com forte apelo para conversão de planos (Product-Led Growth).

---

## 1. Estrutura de Páginas e Componentes

### 1.1. Página Principal: Listagem de Cobranças (`/app/dashboard/cobrancas/page.tsx`)
A visão central onde o lojista gerencia seu fluxo de caixa pendente.

*   **Header da Página:**
    *   Título "Cobranças".
    *   Botão primário `[+ Nova Cobrança]`, que abre o `NewChargeDrawer` (já implementado).
    *   **Progress Bar de Uso (Gatilho de Upsell):** Um card superior que mostra o consumo do plano atual. Ex: `Plano Free: 8/10 cobranças criadas neste mês. [Fazer Upgrade]`.

*   **Filtros Relação (Topo da Tabela):**
    *   Pesquisa rápida por nome/telefone.
    *   Filtros em botões pílula: `Todas`, `Pendentes`, `Atrasadas` (em vermelho), `Pagas`.

*   **A Tabela / Data Grid:**
    *   **Colunas:** Cliente (Nome + WhatsApp), Valor, Vencimento, Status (Badge colorido), Automação (Robô ativo/inativo).
    *   **Ações Rápidas por linha (hover):** Ícones para *Copiar Pix*, *Copiar Link WA*, *Detalhes*.
    *   **Ações em Massa (Bulk Actions):** Checkboxes ao lado de cada cobrança. Ao selecionar, abre uma barra flutuante inferior (Floating Action Bar) com opções: `Notificar Selecionados`, `Cancelar Selecionados`.

### 1.2. Painel de Detalhes (Drawer ou Modal de Detalhes)
Ao clicar numa cobrança na tabela, abrirá um slide-over (similar ao NewChargeDrawer) ou página detalhada (`/dashboard/cobrancas/[id]`).

*   **Resumo:** Informações financeiras e chave PIX gerada.
*   **Timeline do Robô (Histórico de WhatsApp):**
    *   Uma linha do tempo vertical mostrando: *Cobrança Criada*, *Lembrete de Véspera (Agendado)*, *Vencimento*.
    *   Status do disparo: `Enviado ✅`, `Erro ❌`, `Aguardando ⏳`.

---

## 2. Regras de Negócio e Travas de Planos (Upsell)

Para gerar desejo no usuário, as funcionalidades dos planos maiores devem estar visíveis, porém "trancadas" (Lock Icons e Badges) com call-to-actions claros.

### Plano FREE (Amostra / Trabalhoso)
*   **Limite:** 10 cobranças/mês.
*   **Envio 100% Manual:** Na tabela, a ação primária é o botão `[Enviar WhatsApp]`. O lojista **precisa clicar** em cada cobrança no dia do vencimento para abrir o seu próprio WhatsApp Web e enviar a cobrança.
*   **Coluna "Automação":** Todas as cobranças aparecem com o ícone de robô inativo/trancado. Ao clicar para ligar o lembrete automático, abre modal de Upgrade.
*   **Drawer de Nova Cobrança:** Bloqueado para recorrências diferentes de `ÚNICA`. Sem acesso a ações em massa.

### Plano STARTER (Automação Básica)
*   **Limite:** 50 cobranças/mês.
*   **Automação Individual Liberada (O Robô Trabalha):** O usuário não precisa mais clicar em "Enviar WhatsApp". O sistema fará isso sozinho no vencimento. Ele pode ligar/desligar lembretes automáticos clicando no "Robô" da tabela.
*   **Timeline do Robô:** Libera a visão completa do histórico de mensagens que a plataforma disparou por ele.
*   **Drawer de Nova Cobrança:** Liberada recorrência `SEMANAL`.
*   **Bloqueio de Bulk Actions:** Checkboxes de ações em massa continuam com uma flag "Pro".

### Plano PRO e UNLIMITED (Escala e Massificação)
*   **Limite:** 200/mês (PRO) ou Ilimitado (UNLIMITED).
*   **Automação Global e Editável:** Tem acesso à Tela de Régua de Automação Global (Item 3.1) para mudar os textos de antes, no dia e após o vencimento.
*   **Cobrança em Massa:** Checkboxes da tabela totalmente liberados. O lojista pode selecionar dezenas de devedores e executar comandos, e também tem acesso à importação de planilhas.
*   **Drawer de Nova Cobrança:** Todas as recorrências liberadas.

---

## 3. Telas e Recursos Exclusivos (Premium - PRO e UNLIMITED)

Para justificar o valor dos planos mais altos, o módulo de cobranças terá sub-telas dedicadas a escala de negócio, focadas em economia de tempo extremo.

### 3.1. Tela de Régua de Automação Global (`/dashboard/cobrancas/automation`)
*(Acesso restrito: Mostra um "Paywall/Upgrade" se acessado por FREE/STARTER)*
*   **O que é:** Um painel Kanban/Workflow visual onde o lojista define **quando** o robô deve trabalhar por ele.
*   **Componentes da Tela:**
    *   **Cards de Gatilho Ativáveis:** 
        *   `[Ligar] 3 Dias Antes do Vencimento`
        *   `[Ligar] No Dia do Vencimento`
        *   `[Ligar] 1 Dia Após o Vencimento (Atraso)`
    *   **Editor de Mensagens Padrão:** Para cada gatilho, ele pode editar a mensagem global. (Ex: "O tom da mensagem de atraso pode ser mais firme").
    *   **Botão de "Salvar Régua".**

### 3.2. Tela de Disparo em Massa & Importação (`/dashboard/cobrancas/mass-billing`)
*(Acesso restrito: Mostra um "Paywall/Upgrade" se acessado por FREE/STARTER)*
*   **O que é:** Direcionado para academias, escolas ou contabilidades que precisam cobrar 50+ clientes todo mês.
*   **Componentes da Tela:**
    *   **Área de Upload Drag & Drop:** Importador inteligente de planilha Excel ou CSV.
    *   **Mapeador de Colunas (Inteligência):** O sistema detecta a coluna de "Nome", "WhatsApp" e "Valor".
    *   **Preview em Lote (Tabela de Revisão):** Uma tabela mostrando como as 50 cobranças vão ficar antes de disparar.
    *   **Botão Primário de Ação:** `[Gerar 50 Cobranças e Disparar WhatsApp]`. 

---

## 4. Status de Implementação (Atualizado)

✅ **Fase 1: O Esqueleto e Componentes Visuais (Concluída)**
    *   Layout base da página `/dashboard/cobrancas` com responsividade completa (Mobile Sidebar menu).
    *   Tabela interativa implementada.

✅ **Fase 2: Travas Visuais e "Empty States" (Concluída)**
    *   Componente de Progressão do Plano consumindo métricas reais da API.
    *   Lógicas condicionais (`planType`) implementadas (Plan Gating em pleno funcionamento).

✅ **Fase 3: Ações de Cobrança e Interface Mobile (Concluída)**
    *   Floating Action Bar para `Bulk Actions` ajustada para dispositivos móveis.
    *   Drawer de "Nova Cobrança" com preview adaptativo.

✅ **Fase 4: Integração com Back-End (Concluída)**
    *   Carregamento simultâneo via `Promise.allSettled` de Métricas, Assinatura e Cobranças (`GET /charges`).
    *   Ações reais ligadas: `DELETE /charges/:id`, `POST /charges/bulk/cancel`, `POST /charges/bulk/remind`.
    *   Disparo de WhatsApp integrado (`wa.me` com template populado dinamicamente).
    *   Cópia de link PIX mapeando o `id` da cobrança.

⏳ **Fase 5: Detalhes da Cobrança e Inovações (Finalizado/Em Andamento)**
    *   ✅ **Time Travel (Viagem no Tempo):** Gráfico interativo e relatórios diários/semanais.
        *   *Regra de Semântica Temporal:* Para manter os dados alinhados e consistentes, **todas as métricas** (Total a Receber, Top Clientes e a lista de Atividade Recente) são ancoradas estritamente pelo `due_date` (Data de Vencimento). O Total Pago usa o `payment_date`. Assim, a tabela exibe exatamente os itens que compõem os valores financeiros daquele dia.
    *   ✅ Filtros nativos nas telas (Por data e status combinados sem recarregar API indevidamente).
    *   Criar o componente `ChargeDetailsDrawer` focado na visão da Timeline do WhatsApp.
    *   Tela de Régua de Automação Global (`/dashboard/cobrancas/automation`).

---

## 4. UI/UX Premium (Clean Code & Aesthetics)
*   Uso constante de Empty States com ilustrações ou SVGs de alta qualidade quando não houver cobranças.
*   Micro-interações (Framer Motion) para a Floating Action Bar (quando checkboxes forem selecionados).
*   Utilizar *Skeleton Loaders* na tabela em vez de spinners clássicos para percepção de maior velocidade.

---

## 5. Bibliotecas a serem utilizadas (Dependências)
Conforme aprovado, adicionaremos dependências pontuais que aceleram o desenvolvimento sem sacrificar a identidade visual (Clean UI) ou inchar o projeto:

1.  **`@tanstack/react-table`:** O "padrão ouro" para tabelas no React. É uma biblioteca *headless* (sem estilos pré-definidos). Usaremos ela para gerenciar o estado da tabela (sort, paginação, seleção múltipla) mas renderizaremos 100% do visual usando o nosso Tailwind, mantendo a estética idêntica ao resto do sistema.
2.  **`@radix-ui/react-dropdown-menu`:** Também *headless* e focado em acessibilidade. Ideal para o botão de "3 pontinhos" (Ações Individuais) de cada linha da tabela. Totalmente estilizável com Tailwind.
3.  *(Opcional)* **`framer-motion`:** Se as animações complexas da Floating Action Bar (que sobe ao marcar checkboxes) não ficarem perfeitas com puro CSS, adicionaremos. Por enquanto, tentaremos manter apenas com as classes de animação do Tailwind (`animate-in slide-in-from-bottom`).

> **Nota sobre Ícones:** Apesar de estarmos construindo uma tabela complexa, NÃO instalaremos `lucide-react` ou similares. Manteremos a regra do projeto de copiar os SVGs puros e inseri-los centralizados em `/components/ui/Icons.tsx` para manter o bundle enxuto.
