---
name: frontend-auth
description: Autenticação do RecebeFácil no front-end — JWT em cookie HttpOnly, Server Actions de login/register/logout, middleware de proteção de rotas.
when_to_use: Quando implementar login, logout, registro, proteção de rotas, leitura do token ou tratamento de sessão expirada.
---

## Fluxo JWT HttpOnly

```
Login/Register → Server Action → POST /auth/login|register
  → Recebe access_token
  → cookieStore.set('recebefacil_token', token, { httpOnly: true })
  → Retorna { success: true, user }
```

O token **nunca** toca o JavaScript do browser — apenas o servidor Next.js o lê via `cookies()`.

## Server Actions (app/actions/auth.ts)

```ts
'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(data) {
  try {
    const response = await api.post('/auth/login', data);
    (await cookies()).set('recebefacil_token', response.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,  // 7 dias
    });
    return { success: true, user: response.data.user };
  } catch (error) {
    if (isAxiosError(error)) {
      const msg = error.response?.data?.message;
      return { success: false, error: Array.isArray(msg) ? msg[0] : (msg || 'E-mail ou senha inválidos.') };
    }
    return { success: false, error: 'Erro de comunicação com o servidor.' };
  }
}

export async function logoutAction() {
  (await cookies()).delete('recebefacil_token');
  redirect('/login');
}
```

## Leitura do Token em Qualquer Server Action

```ts
const token = (await cookies()).get('recebefacil_token')?.value;
if (!token) return { success: false, error: 'Sessão expirada. Faça login novamente.' };

await fetch(`${process.env.NEXT_PUBLIC_API_URL}/endpoint`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Logout (sem JavaScript no client)

```tsx
<form action={logoutAction}>
  <button type="submit">Sair</button>
</form>
```

## Tratamento de 401/403

- API retornou 403 → capturar e mostrar mensagem humanizada, nunca tela quebrada
- Token ausente na Server Action → retornar `{ success: false, error: 'Sessão expirada.' }`
- `middleware.ts` valida globalmente rotas `/dashboard/*` e redireciona para `/login`

## Erros — Mensagens ao Usuário

```ts
// NUNCA: "Token inválido", "JWT expired", "401 Unauthorized"
// SEMPRE: mensagem em português, sem jargão técnico
'E-mail ou senha inválidos.'
'Sessão expirada. Faça login novamente.'
'Erro de comunicação com o servidor. Tente novamente mais tarde.'
```

## Anti-patterns

- Nunca `localStorage.setItem('token', ...)`
- Nunca expor JWT em `console.log`
- Nunca mostrar "Error 401" ou stack trace ao usuário
- Nunca acessar rota privada sem validar no middleware
- Cookie `httpOnly: true` + `secure: true` em produção — nunca omitir
