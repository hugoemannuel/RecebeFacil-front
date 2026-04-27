# Configurações & Dark Mode - Especificações de UI/UX

Este documento detalha o funcionamento do módulo de configurações e a padronização do sistema de Dark Mode no RecebeFácil.

---

## 1. Módulo de Configurações (`/dashboard/configuracoes`)

O módulo deve ser construído utilizando um sistema de **Abas (Tabs)** para organizar as diferentes áreas de responsabilidade do usuário.

### 1.1. Perfil (Identidade)
- **Avatar:** Componente de upload circular com preview. Deve permitir remover a foto atual.
- **Campos:** Nome (obrigatório) e E-mail (validação de formato).
- **Telefone:** Exibido como somente leitura (Read-only) para preservar a identidade vinculada ao auth.

### 1.2. Assinatura & Plano
- **Visualização:** Card com a cor do plano (ex: Verde para PRO, Azul para STARTER).
- **Indicador de Uso:** Barra de progresso visual mostrando quantas cobranças restam no ciclo atual.
- **Call to Action:** Botão "Upgrade" sempre visível para planos inferiores.

### 1.3. WhatsApp & PIX
- **Chave PIX:** Input com seletor de tipo (CPF/CNPJ/Celular/E-mail/EVP).
- **Configurações Globais:** Template padrão de mensagem WhatsApp que será usado como base no drawer de cobranças.

### 1.4. Segurança & Gestão de Conta
- **Troca de Senha:** Fluxo padrão com validação de senha atual.
- **Zona de Perigo (Danger Zone):** Botão para excluir conta. Deve exibir um modal de confirmação agressivo. 
- **Regra de Exclusão:** Os dados pessoais devem ser anonimizados no banco para manter a integridade financeira das cobranças existentes, mas removendo qualquer PII (Personally Identifiable Information).

---

## 2. Sistema de Dark Mode (Premium Experience)

O Dark Mode não é apenas uma inversão de cores, mas uma adaptação para reduzir a fadiga ocular mantendo o aspecto **Premium**.

### 2.1. Paleta de Cores Dark
- **Background (Surface 0):** `#0b1521` (Fundo principal das páginas).
- **Surface 1 (Cards/Sidebar):** `#152336` (Componentes que flutuam sobre o fundo).
- **Bordas:** `rgba(255, 255, 255, 0.05)`.
- **Texto Primário:** `#f8fafc` (Zinc-50).
- **Texto Secundário:** `#94a3b8` (Slate-400).
- **Accent:** `#22c55e` (Verde Esmeralda - mantém a identidade de "dinheiro").

### 2.2. Implementação Técnica
- **Tailwind Strategy:** Uso da variante `dark:` em todos os componentes.
- **Theme Toggle:** Botão Sol/Lua posicionado no Header, próximo ao perfil do usuário.
- **Sincronização:** O tema deve ser detectado automaticamente via `prefers-color-scheme` no primeiro acesso, mas respeitar a escolha manual do usuário salva no `localStorage`.

---

## 3. Regras de Interface (UX)

- **Transições:** A mudança de tema deve ter uma transição suave (`transition-colors duration-300`) em todos os elementos de fundo e texto.
- **Shadows:** No modo Dark, sombras pretas (`shadow-black`) devem ser substituídas por um leve glow ou bordas mais claras para dar profundidade.
- **Empty States:** Ilustrações e ícones de estados vazios devem ser adaptados para não causarem ofuscamento no modo escuro.
