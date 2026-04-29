"use server";

import { cookies } from 'next/headers';
import { api } from '@/services/api';
import { redirect } from 'next/navigation';

export async function createCheckoutAction(planType: string, period: 'MONTHLY' | 'YEARLY') {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const response = await api.post(
      '/subscription/checkout',
      { planType, period },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { invoiceUrl } = response.data;

    if (invoiceUrl) {
      return { success: true, url: invoiceUrl };
    }

    return { success: false, error: 'URL de checkout não recebida' };
  } catch (error: any) {
    console.error('Erro ao criar checkout:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Erro ao conectar com o servidor de pagamentos' 
    };
  }
}

export async function cancelSubscriptionAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;
  if (!token) redirect('/login');
  try {
    const response = await api.post('/subscription/cancel', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    const msg = error.response?.data?.message;
    return { success: false, error: Array.isArray(msg) ? msg[0] : msg ?? 'Erro ao cancelar assinatura.' };
  }
}

export async function getSubscriptionStatusAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;

  if (!token) return null;

  try {
    const response = await api.get('/subscription/status', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return null;
  }
}
