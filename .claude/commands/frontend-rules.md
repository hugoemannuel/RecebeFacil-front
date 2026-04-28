# Contexto Front-End — RecebeFácil

Stack: Next.js App Router · TypeScript · Tailwind CSS · React Hook Form + Zod · Axios

## Design System
- Accent: `#22c55e` (green-500)
- Background dark: `bg-[#0b1521]` (Surface 0), `bg-[#152336]` (cards)
- Botões: `hover:bg-green-600 hover:scale-[1.02] transition-transform`
- Inputs: `focus:ring-2 focus:ring-green-500/50`
- Dark mode: variante `dark:` em todos os componentes; toggle Sol/Lua no header
- Transição de tema: `transition-colors duration-300`

## Arquitetura (inegociável)
- JWT: cookie `HttpOnly` via Server Actions. NUNCA `localStorage`
- Server Actions em `/app/actions/` para chamadas autenticadas
- `middleware.ts` redireciona rotas privadas sem auth para `/login`
- Axios: instância centralizada em `services/api.ts`
- Ícones: SVGs nativos em `components/ui/Icons.tsx` — sem lucide-react
- CSS: 100% Tailwind; CSS customizado só para animações que Tailwind não cobre
- `page.tsx`: máximo ~50 linhas, apenas orquestra componentes

## Estrutura de Componentes
- `components/ui/` — atômicos, sem negócio, com `forwardRef`
- `components/layout/` — AuthLayout, DashboardLayout
- `components/forms/` — formulários com RHF + Zod + Server Actions
- `utils/` ou `lib/` — funções puras (formatters, máscaras)

## Formulários
- React Hook Form + Zod obrigatório (`@hookform/resolvers/zod`)
- Máscaras: funções utilitárias no `onChange`, sem `react-input-mask`
- Todo submit: loading state + toast verde (sucesso) + toast vermelho humanizado (erro)
- Desabilitar botão durante loading

## Plan Gating
| Módulo           | FREE | STARTER | PRO |
|------------------|:----:|:-------:|:---:|
| Home / Dashboard | ✅   | ✅      | ✅  |
| Cobranças        | ✅   | ✅      | ✅  |
| Clientes         | ❌   | ✅      | ✅  |
| Relatórios       | ❌   | ✅      | ✅  |
| Importação Excel | ❌   | ✅      | ✅  |

- Bloqueado: opacidade reduzida + ícone cadeado (nunca esconder)
- Acesso negado → modal de upgrade, NUNCA página de erro
- Fonte da verdade: `plan_type` no `UserPlanContext` ou prop do `DashboardLayout`

## NewChargeDrawer
4 steps: Devedor → Cobrança → Mensagem WhatsApp → Confirmar & Enviar
- Step 3: preview ao vivo estilo WhatsApp (fundo `#e5ddd5`)
- Chips de variáveis: `{{nome}}` `{{valor}}` `{{vencimento}}` `{{descricao}}` `{{nome_empresa}}`
- Sem PIX configurado: banner amarelo no Step 3
- Valor mínimo R$1,00; data futura ou hoje; recorrência conforme plano

## Checkout
- Front apenas redireciona para `invoiceUrl` do Asaas — nunca processa cartão
- Após retorno: polling ou SSE para confirmar plano antes de liberar módulos

## Segurança
- Nunca `dangerouslySetInnerHTML`
- Nunca `console.log` de dados sensíveis
- Erros 403/401: redirecionar para lista segura, nunca tela quebrada
