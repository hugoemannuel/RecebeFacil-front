# Roadmap Mestre Unificado - RecebeFácil V1 🚀

Este documento consolida todas as pendências técnicas e de produto, estabelecendo uma ordem de execução clara para finalizar a primeira versão estável da plataforma.

---

## 🛠 Fase 1: Sincronização e Consistência (Foco Atual)
*Objetivo: Garantir que o front-end reflita os dados do back-end instantaneamente.*

1.  **[x] Contexto Global de Usuário & Tema (`Zustand Stores`)**:
    *   Migrado `UserContext` e `ThemeContext` para stores do Zustand.
    *   Implementados `StoreInitializer` e `ThemeInitializer` para evitar erros de hidratação.
    *   Unificado o padrão de gerenciamento de estado global.
2.  **[x] Gestão de Cache de Avatar**:
    *   Adicionado timestamp query para forçar atualização de imagem após upload.
3.  **[x] Hook de Sincronização de Assinatura**:
    *   Implementada sincronização automática ao ganhar foco na janela (`refresh` na store).
4.  **[x] Revalidação em Checkout**:
    *   Implementado `revalidatePath` nas Server Actions de perfil e assinatura.

---

## 📱 Fase 2: Comunicação e Automação (Coração do Produto)
*Objetivo: Ativar disparos reais de WhatsApp e permitir customização pelo usuário.*

2.  **[ ] Configuração Z-API**:
    *   Vincular credenciais reais no `.env` do backend.
    *   Criar botão de "Testar Conexão" nas configurações.
3.  **[x] UI de Réguas de Cobrança**:
    *   Tela em `Configurações > Automação` para definir dias de envio. (Concluído)
4.  **[x] UI de Templates de Mensagem**:
    *   Tela em `Configurações > Templates` para editar mensagens. (Concluído)
    *   Integração total no Drawer e Modal de cobrança. (Concluído)
5.  **[ ] Histórico de Mensagens (Logs)**:
    *   Implementar visualização de log de disparos no `ChargeDetailsDrawer`.
6.  **[ ] Motor de Automação (Cron)**:
    *   Finalizar o serviço que varre o banco e dispara via Z-API diariamente.

---

## 📊 Fase 3: Escala e Gestão de Massa
*Objetivo: Facilitar a vida de quem tem muitos clientes.*

1.  **[ ] Importação de Excel**:
    *   Criar endpoint `POST /clients/import` no backend.
    *   Criar Modal de Importação no front-end com suporte a `.xlsx`.
2.  **[ ] Lógica de Recorrência Cron**:
    *   Finalizar o job que gera cobranças baseadas em regras `WEEKLY/MONTHLY`.
3.  **[ ] Ações em Massa**:
    *   Finalizar lógica de `Bulk Remind` e `Bulk Cancel` na listagem de cobranças.

---

## 💅 Fase 4: Polish e Experiência Premium
*Objetivo: Refinar a UX e entregar relatórios profissionais.*

1.  **[ ] Exportação Financeira**:
    *   Gerar PDF/CSV de extrato e cobranças.
2.  **[ ] Centro de Notificações**:
    *   Implementar lógica real no ícone de sino para alertas do sistema.
3.  **[ ] Feedback Visual & Micro-animações**:
    *   Refinar transições entre páginas e estados de loading.

---

## ✅ Concluído recentemente
- [x] Fluxo de Checkout Asaas (Assinatura de Planos).
- [x] Modal de Onboarding de Split (Contrato dinâmico).
- [x] Webhook de Pagamentos Asaas (Sincronização de status).
- [x] Revalidação de Server Actions (Profile/Subscription).
- [x] Seed para Usuário Unlimited.

---
**Última Atualização:** 01/05/2026
**Responsável:** Antigravity (AI Assistant)
