'use server';

import { cookies } from 'next/headers';
import { api } from '@/services/api';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { isAxiosError } from 'axios';

async function getToken() {
  const token = (await cookies()).get('recebefacil_token')?.value;
  if (!token) redirect('/login');
  return token;
}

export async function getProfileAction() {
  const token = await getToken();
  try {
    const res = await api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } });
    return { success: true, data: res.data };
  } catch {
    return { success: false, data: null };
  }
}

export async function updateProfileAction(payload: { name: string; email: string }) {
  const token = await getToken();
  try {
    const res = await api.patch('/users/me', payload, { headers: { Authorization: `Bearer ${token}` } });
    revalidatePath('/dashboard', 'layout');
    return { success: true, data: res.data };
  } catch (error) {
    if (isAxiosError(error)) {
      const msg = error.response?.data?.message;
      return { success: false, error: Array.isArray(msg) ? msg[0] : msg ?? 'Erro ao salvar perfil.' };
    }
    return { success: false, error: 'Erro de comunicação.' };
  }
}

export async function uploadAvatarAction(formData: FormData) {
  const token = await getToken();
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/users/me/avatar`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        // ATENÇÃO: NÃO definir Content-Type aqui, o fetch definirá automaticamente com o boundary correto para FormData
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { 
        success: false, 
        error: errorData.message || 'Erro ao enviar foto.' 
      };
    }

    const data = await res.json();
    revalidatePath('/dashboard', 'layout');
    return { success: true, data };
  } catch (error) {
    console.error('Erro no uploadAvatarAction:', error);
    return { success: false, error: 'Erro de comunicação.' };
  }
}

export async function updatePasswordAction(payload: { current_password: string; new_password: string }) {
  const token = await getToken();
  try {
    await api.patch('/users/me/password', payload, { headers: { Authorization: `Bearer ${token}` } });
    return { success: true };
  } catch (error) {
    if (isAxiosError(error)) {
      const msg = error.response?.data?.message;
      return { success: false, error: Array.isArray(msg) ? msg[0] : msg ?? 'Senha atual incorreta.' };
    }
    return { success: false, error: 'Erro de comunicação.' };
  }
}

export async function deleteAccountAction() {
  const token = await getToken();
  try {
    await api.delete('/users/me', { headers: { Authorization: `Bearer ${token}` } });
    (await cookies()).delete('recebefacil_token');
  } catch {
    return { success: false, error: 'Erro ao excluir conta. Tente novamente.' };
  }
  redirect('/login');
}

export async function getCreditorProfileAction() {
  const token = await getToken();
  try {
    const res = await api.get('/profiles/me', { headers: { Authorization: `Bearer ${token}` } });
    return { success: true, data: res.data };
  } catch {
    return { success: false, data: null };
  }
}

export async function updateCreditorProfileAction(payload: any) {
  const token = await getToken();
  try {
    const res = await api.patch('/profiles/me', payload, { headers: { Authorization: `Bearer ${token}` } });
    return { success: true, data: res.data };
  } catch (error) {
    if (isAxiosError(error)) {
      const msg = error.response?.data?.message;
      return { success: false, error: Array.isArray(msg) ? msg[0] : msg ?? 'Erro ao salvar configurações.' };
    }
    return { success: false, error: 'Erro de comunicação.' };
  }
}
