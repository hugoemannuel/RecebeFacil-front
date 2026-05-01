'use server';

import { cookies } from 'next/headers';
import { api } from '@/services/api';
import { revalidatePath } from 'next/cache';
import { isAxiosError } from 'axios';
import { redirect } from 'next/navigation';

async function getToken() {
  const token = (await cookies()).get('recebefacil_token')?.value;
  if (!token) redirect('/login');
  return token;
}

export async function getAutomationConfigAction() {
  const token = await getToken();
  try {
    const res = await api.get('/integrations/automation', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: res.data };
  } catch {
    return { success: false, data: null };
  }
}

export async function updateAutomationConfigAction(data: {
  allows_automation?: boolean;
  automation_days_before?: number;
  automation_days_after?: number;
}) {
  const token = await getToken();
  try {
    const res = await api.patch('/integrations/automation', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    revalidatePath('/dashboard/configuracoes');
    return { success: true, data: res.data };
  } catch (error) {
    if (isAxiosError(error)) {
      return { success: false, error: error.response?.data?.message || 'Erro ao salvar automação.' };
    }
    return { success: false, error: 'Erro de comunicação.' };
  }
}

export async function getTemplatesAction() {
  const token = await getToken();
  try {
    const res = await api.get('/profiles/me/templates', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: res.data };
  } catch {
    return { success: false, data: [] };
  }
}

export async function updateTemplateAction(id: string, body: string) {
  const token = await getToken();
  try {
    const res = await api.patch(`/profiles/me/templates/${id}`, { body }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    revalidatePath('/dashboard/configuracoes');
    return { success: true, data: res.data };
  } catch (error) {
    if (isAxiosError(error)) {
      return { success: false, error: error.response?.data?.message || 'Erro ao salvar template.' };
    }
    return { success: false, error: 'Erro de comunicação.' };
  }
}
