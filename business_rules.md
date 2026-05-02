# 📖 Regras de Negócio: RecebeFácil

Este documento serve como a única fonte de verdade para o comportamento do sistema, integrações e limitações de planos.

---

## 1. Modelo de Assinaturas (Tiers)

O sistema opera em 4 níveis de acesso, controlados pelo backend via `allowed_modules`:

| **Preço Mensal** | R$ 0 | R$ 67 | R$ 97 | R$ 247 |
| **Limite de Cobranças** | 10 / mês | 50 / mês | 200 / mês | Ilimitado |
| **Recorrência** | Não | Apenas Semanal | Completa | Completa |
| **Relatórios Avançados** | Bloqueado | Bloqueado | Bloqueado | **Liberado** |
| **Importação Excel** | Bloqueado | Liberado | Liberado | Liberado |
| **Módulo Financeiro** | Bloqueado | Bloqueado | **Liberado** | **Liberado** |
| **Fluxo de Recebimento** | Manual | Manual | **Automático (Split)** | **Automático (Split)** |
| **Taxa da Plataforma** | 0% | 0% | **2% / transação** | **1% / transação** |
| **WhatsApp Próprio** | Não (Compartilhado) | Não (Compartilhado) | Não (Compartilhado) | **Sim (Incluso)** |
| **Integrações (Webhooks)** | Bloqueado | Bloqueado | Bloqueado | **Liberado** |
| **Recibos em PDF** | Não | Não | Não | **Personalizados** |

---

## 2. Fluxos de Recebimento (Financeiro)

A plataforma não retém saldo de lojistas diretamente. O dinheiro flui de duas formas principais:

### A. Fluxo Manual (FREE & STARTER)
*   **Chave PIX**: O lojista cadastra sua própria chave PIX (CPF, Celular, E-mail ou Aleatória) de qualquer instituição bancária.
*   **Conciliação**: O sistema não possui integração de status para este fluxo. O lojista deve conferir seu extrato bancário externo e marcar a cobrança como **"Paga"** manualmente no dashboard.
*   **Webhooks**: Não existem webhooks de pagamento ativos para usuários nestes planos.

### B. Fluxo Automático / Split Asaas (PRO & UNLIMITED)
*   **Integração**: O lojista conecta sua conta Asaas via API Key (Asaas Connect).
*   **Split Externo**: As cobranças são geradas na infraestrutura da Asaas. No momento do pagamento, o valor é direcionado à conta Asaas do lojista.
*   **Automação**: O Webhook da Asaas notifica o RecebeFácil sobre a liquidação, e o sistema altera o status da cobrança para **"Paga"** automaticamente.
*   **Comissão da Plataforma**: O RecebeFácil retém uma taxa de serviço sobre o valor bruto de cada transação via Split:
    *   **Plano PRO**: 2% por transação.
    *   **Plano UNLIMITED**: 1% por transação.
*   **Módulo Financeiro**: Apenas usuários destes planos visualizam saldo em tempo real, extrato consolidado e realizam pedidos de saque via dashboard.

---

## 3. Mensageria (WhatsApp & Z-API)

*   **Infraestrutura**: O envio de mensagens utiliza a Z-API integrada diretamente na plataforma.
    *   **Modelo All-in-one**: A mensalidade já cobre os custos de infraestrutura de envio.
    *   **STARTER / PRO**: Utilizam o **número compartilhado** da plataforma (Alta conversão e baixo custo).
    *   **UNLIMITED**: Permite conectar um **número próprio** (Instância dedicada inclusa).
*   **Variáveis Dinâmicas**: O uso de variáveis como `{{nome}}`, `{{valor}}`, `{{vencimento}}` e `{{descricao}}` é o padrão para garantir alta conversão.
*   **Preview ao Vivo**: O sistema deve fornecer um preview visual da mensagem (WhatsApp Preview) antes do envio definitivo.
*   **Rastreamento**: O status da mensagem (Enviada, Entregue, Lida) é atualizado via webhooks da Z-API.
*   **Recursos Avançados (UNLIMITED)**: Acesso a Webhooks para integração externa e geração de recibos em PDF personalizados com a logo do lojista.

---

## 4. Automação e Recorrência

*   **Motor de Geração**: Um serviço de Cron Job (backend) é responsável por gerar novas cobranças a partir de regras de recorrência ativas.
*   **Gating de Recorrência**:
    *   **STARTER**: Apenas recorrência Semanal.
    *   **PRO/UNLIMITED**: Semanal, Mensal e Anual.
*   **Lembretes**: Lógica de disparo automático de lembretes antes do vencimento (baseado no plano).

---

## 5. Segurança e Conformidade (LGPD)

*   **Shadow Users**: Clientes (devedores) são armazenados com o flag `is_registered: false`. Seus dados são isolados por credor.
*   **Isolamento de Dados**: Rigoroso controle de acesso (Ownership Check) em todos os endpoints para evitar que um usuário veja dados de outro.
*   **Auditoria (AuditLog)**: Registro obrigatório de logs para ações sensíveis:
    *   Alteração de dados bancários/PIX.
    *   Alteração de status de cobranças.
    *   Ações em massa (Bulk actions).
    *   Upgrades/Downgrades de plano.
*   **Criptografia**: Dados de integração (API Keys) devem ser armazenados de forma segura/criptografada.

---

## 6. UX e Gatilhos de Venda (Upsell)

*   **Visibilidade**: Módulos e funcionalidades premium devem ser visíveis para todos os usuários, mas com indicativos de bloqueio (ícone de cadeado).
*   **Conversão**: Ao tentar acessar uma função bloqueada, o sistema deve disparar o `UpgradeModal`, focando nos benefícios do plano superior para induzir a assinatura.
