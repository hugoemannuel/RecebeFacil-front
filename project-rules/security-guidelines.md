# Guias de Segurança - Front-End (RecebeFácil)

A segurança no front-end é tão crítica quanto no back-end, pois lidamos com dados sensíveis, saldos, faturamentos e links de pagamento. O front-end é a primeira linha de defesa.

---

## 1. Gestão de Sessão e Autenticação (JWT)

- **Armazenamento de Tokens:** O Token JWT retornado pelo back-end no momento do login NÂO deve ser armazenado em `localStorage` devido ao risco alto de ataques XSS.
- **Abordagem Correta:** O token deve ser mantido em um cookie `HttpOnly` e `Secure` (via Server Actions no Next.js ou pela API Route do Next), garantindo que nenhum script malicioso no cliente consiga lê-lo.
- **Redirecionamento Global:** O aplicativo deve possuir um middleware (`middleware.ts` no Next.js) que intercepta rotas privadas (ex: `/dashboard`) e redireciona automaticamente para `/login` caso o usuário não esteja autenticado.

---

## 2. Prevenção contra Cross-Site Scripting (XSS)

Como a plataforma exibe descrições de cobranças criadas por usuários e pode interagir com dados abertos:
- **NUNCA usar `dangerouslySetInnerHTML`** no React, a menos que os dados venham de uma fonte 100% controlada e tenham passado por uma biblioteca de sanitização estrita (como DOMPurify).
- O React já escapa variáveis nativamente (`{variavel}`), confie nesse comportamento padrão.

---

## 3. Prevenção de Exposição de Dados Sensíveis

- **Limpeza de Logs:** Nenhum dado sensível (CPF, senhas, tokens de API, chaves PIX de clientes) pode ser logado no `console.log()` sob nenhuma circunstância em produção.
- **Máscaras de Input no Cliente:** Para campos como CPF/CNPJ e Telefone, a máscara no front-end é obrigatória não só pela UX, mas para garantir que o formato enviado ao back-end seja predizível. No entanto, o front-end nunca deve confiar cegamente nisso: campos sensíveis de senha devem ser do tipo `type="password"`.

---

## 4. Comunicação com a API (API Client)

- **Tratamento de IDOR (Insecure Direct Object Reference) Visual:** Se a API retornar um erro `403 Forbidden` ou `401 Unauthorized` ao tentar acessar o recurso de outra pessoa (ex: `/cobranca/ID_FALSO`), o front-end deve capturar esse erro de forma graciosa e redirecionar o usuário para a lista segura (ex: `/dashboard`), evitando telas quebradas ou travamento da aplicação.
- **HTTPS Sempre:** Todas as requisições API devem utilizar o protocolo `https://`. Nenhum fallback para HTTP é aceitável em ambiente de produção.

---

## 5. Validação Client-Side Defensiva

O front-end deve atuar como o primeiro filtro de sujeira:
- Utilizar bibliotecas robustas de schema validation (ex: **Zod** + React Hook Form) para barrar payloads inválidos antes mesmo de baterem no servidor.
- Não permitir envio de formulários múltiplos (adicionar propriedade `disabled` em botões após o clique durante o tempo de loading).
- Senhas devem ser validadas no momento da digitação para respeitar a regra de "mínimo 8 caracteres".
