'use server';

import { cookies } from 'next/headers';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('recebefacil_token')?.value ?? null;
}

export interface CreateClientPayload {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface UpdateClientPayload {
  name?: string;
  email?: string;
  notes?: string;
}

export async function createClientAction(payload: CreateClientPayload) {
  const token = await getToken();
  if (!token) return { success: false, error: 'Sessão expirada. Faça login novamente.' };

  try {
    const res = await fetch(`${API}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return { success: false, error: err?.message || 'Erro ao cadastrar cliente.' };
    }

    const data = await res.json();
    return { success: true, clientId: data.clientId };
  } catch {
    return { success: false, error: 'Servidor indisponível no momento.' };
  }
}

export async function getClientDetailsAction(clientId: string) {
  const token = await getToken();
  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${API}/clients/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return { success: false, error: err?.message || 'Erro ao buscar cliente.' };
    }

    const data = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: 'Servidor indisponível.' };
  }
}

export async function updateClientAction(clientId: string, payload: UpdateClientPayload) {
  const token = await getToken();
  if (!token) return { success: false, error: 'Sessão expirada.' };

  try {
    const res = await fetch(`${API}/clients/${clientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return { success: false, error: err?.message || 'Erro ao atualizar cliente.' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Servidor indisponível.' };
  }
}

export async function deleteClientAction(clientId: string) {
  const token = await getToken();
  if (!token) return { success: false, error: 'Sessão expirada.' };

  try {
    const res = await fetch(`${API}/clients/${clientId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return { success: false, error: err?.message || 'Erro ao remover cliente.' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Servidor indisponível.' };
  }
}
