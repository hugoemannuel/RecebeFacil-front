'use server';

import { cookies } from 'next/headers';

export interface CreateChargePayload {
  debtor_name: string;
  debtor_phone: string;
  amount: number; // centavos
  due_date: string; // ISO
  description: string;
  recurrence: 'ONCE' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  custom_message: string;
  send_pix_button: boolean;
  pix_key?: string;
  pix_key_type?: 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'EVP' | string;
}

export interface CreateChargeResult {
  success: boolean;
  error?: string;
  chargeId?: string;
}

/**
 * Server Action: Cria uma cobrança e dispara o envio via WhatsApp.
 * Por enquanto retorna mock — será conectado ao back-end na próxima fase.
 */
export async function createChargeAction(
  payload: CreateChargePayload
): Promise<CreateChargeResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;

  if (!token) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' };
  }

  // TODO: conectar ao back-end real
  // const res = await api.post('/charges', payload, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });

  // Mock para desenvolvimento — simula delay de rede
  await new Promise((r) => setTimeout(r, 1500));

  // Simula sucesso
  return {
    success: true,
    chargeId: `mock-${Date.now()}`,
  };
}
