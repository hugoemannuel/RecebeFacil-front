'use server';

import { cookies } from 'next/headers';
import { ActionResult } from '@/types/actions';

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
  save_as_template?: boolean;
  template_name?: string;
}



/**
 * Server Action: Cria uma cobrança e dispara o envio via WhatsApp.
 * Por enquanto retorna mock — será conectado ao back-end na próxima fase.
 */
export async function createChargeAction(
  payload: CreateChargePayload
): Promise<ActionResult<{ chargeId: string }>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;

  if (!token) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/charges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      if (res.status === 403) {
        if (errorData?.message === 'LIMIT_REACHED') {
          return { success: false, error: 'Limite do seu plano atingido. Faça upgrade para continuar enviando cobranças.' };
        }
        if (errorData?.message === 'RECURRENCE_NOT_ALLOWED') {
          return { success: false, error: 'O seu plano atual não permite este tipo de recorrência. Faça upgrade para liberar.' };
        }
      }
      return { success: false, error: errorData?.message || 'Erro ao processar cobrança no servidor.' };
    }

    const data = await res.json();
    return {
      success: true,
      data: { chargeId: data.chargeId },
    };
  } catch (error) {
    return { success: false, error: 'Servidor indisponível no momento.' };
  }
}

export async function getChargeDetailsAction(chargeId: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;

  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/charges/${chargeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return { success: false, error: errorData?.message || 'Erro ao buscar cobrança' };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Servidor indisponível' };
  }
}

export async function updateChargeStatusAction(chargeId: string, status: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;
  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/charges/${chargeId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return { success: false, error: err?.message || 'Erro ao atualizar status' };
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Servidor indisponível' };
  }
}

export async function deleteChargeAction(chargeId: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;
  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/charges/permanent/${chargeId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return { success: false, error: err?.message || 'Erro ao excluir cobrança' };
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Servidor indisponível' };
  }
}

export async function bulkCancelAction(chargeIds: string[]): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;

  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/charges/bulk/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ chargeIds }),
    });

    if (!res.ok) return { success: false, error: 'Erro ao cancelar cobranças' };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Servidor indisponível' };
  }
}

export async function bulkRemindAction(chargeIds: string[]): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;

  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/charges/bulk/remind`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ chargeIds }),
    });

    if (!res.ok) return { success: false, error: 'Erro ao enviar lembretes' };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Servidor indisponível' };
  }
}

export async function getRecurringChargesAction(): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;
  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/charges/recurring`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { success: false, error: 'Erro ao buscar recorrências' };
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Servidor indisponível' };
  }
}

export async function cancelRecurringChargeAction(ruleId: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;
  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/charges/recurring/${ruleId}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { success: false, error: 'Erro ao cancelar regra' };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Servidor indisponível' };
  }
}

export interface UpdateRecurringPayload {
  frequency?: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  description?: string;
  next_generation_date?: string;
  custom_message?: string;
}

export async function updateRecurringAction(ruleId: string, payload: UpdateRecurringPayload): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;
  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/charges/recurring/${ruleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return { success: false, error: err?.message || 'Erro ao atualizar automação' };
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Servidor indisponível' };
  }
}

export async function deleteRecurringAction(ruleId: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;
  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/charges/recurring/${ruleId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { success: false, error: 'Erro ao excluir regra' };
    return { success: true };
  } catch {
    return { success: false, error: 'Servidor indisponível' };
  }
}

export async function reactivateRecurringAction(ruleId: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;
  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/charges/recurring/${ruleId}/reactivate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { success: false, error: 'Erro ao reativar automação' };
    return { success: true };
  } catch {
    return { success: false, error: 'Servidor indisponível' };
  }
}
