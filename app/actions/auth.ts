'use server';

import { cookies } from 'next/headers';
import { api } from '@/services/api';
import { isAxiosError } from 'axios';

export async function loginAction(data: any) {
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

    return { success: true, user: response.data.user };
  } catch (error) {
    if (isAxiosError(error)) {
      return { success: false, error: error.response?.data?.message || 'E-mail ou senha inválidos.' };
    }
    return { success: false, error: 'Erro de comunicação com o servidor.' };
  }
}

export async function registerAction(data: any) {
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

    return { success: true, user: response.data.user };
  } catch (error) {
    if (isAxiosError(error)) {
      return { success: false, error: error.response?.data?.message || 'Erro ao realizar o cadastro.' };
    }
    return { success: false, error: 'Erro de comunicação com o servidor.' };
  }
}
