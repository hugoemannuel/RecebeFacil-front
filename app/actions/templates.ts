'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getTemplatesAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;
  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${API_URL}/profiles/me/templates`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { success: false, error: 'Erro ao buscar templates' };
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Servidor indisponível' };
  }
}

export async function createTemplateAction(payload: { name: string; body: string; trigger?: string; is_default?: boolean }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;
  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${API_URL}/profiles/me/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return { success: false, error: err?.message || 'Erro ao criar template' };
    }
    const data = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: 'Servidor indisponível' };
  }
}

export async function updateTemplateAction(id: string, payload: { name?: string; body?: string; trigger?: string; is_default?: boolean }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;
  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${API_URL}/profiles/me/templates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return { success: false, error: err?.message || 'Erro ao atualizar template' };
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Servidor indisponível' };
  }
}

export async function deleteTemplateAction(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;
  if (!token) return { success: false, error: 'Não autorizado' };

  try {
    const res = await fetch(`${API_URL}/profiles/me/templates/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { success: false, error: 'Erro ao excluir template' };
    return { success: true };
  } catch {
    return { success: false, error: 'Servidor indisponível' };
  }
}
