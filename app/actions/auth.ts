'use server';

import { cookies } from 'next/headers';
import { api } from '@/services/api';
import { isAxiosError } from 'axios';
import { ActionResult } from '@/types/actions';
import { User } from '@/types/user';

export async function loginAction(data: any): Promise<ActionResult<{ user: User }>> {
  try {
    const response = await api.post('/auth/login', data);

    const cookieStore = await cookies();
    cookieStore.set('recebefacil_token', response.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return { success: true, data: { user: response.data.user } };
  } catch (error) {
    if (isAxiosError(error)) {
      const data = error.response?.data;
      let errorMessage = 'E-mail ou senha inválidos.';
      if (data?.message) {
        errorMessage = Array.isArray(data.message) ? data.message[0] : data.message;
      }
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Erro de comunicação com o servidor. Tente novamente mais tarde.' };
  }
}

export async function registerAction(data: any): Promise<ActionResult<{ user: User }>> {
  try {
    const response = await api.post('/auth/register', data);

    const cookieStore = await cookies();
    cookieStore.set('recebefacil_token', response.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return { success: true, data: { user: response.data.user } };
  } catch (error) {
    if (isAxiosError(error)) {
      const data = error.response?.data;
      let errorMessage = 'Erro ao realizar o cadastro.';
      if (data?.message) {
        errorMessage = Array.isArray(data.message) ? data.message[0] : data.message;
      }
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Erro de comunicação com o servidor. Tente novamente mais tarde.' };
  }
}

import { redirect } from 'next/navigation';

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('recebefacil_token');
  redirect('/login');
}
