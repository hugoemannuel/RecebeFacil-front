"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("recebefacil_token")?.value;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getSplitTermsAction() {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/integrations/asaas/split-terms`, {
      headers,
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar termos de split");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching split terms:", error);
    return null;
  }
}

export async function acknowledgeSplitAction(data: { version: string, document?: string, bankData?: any }) {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/integrations/asaas/acknowledge-split`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Erro ao salvar aceite" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error acknowledging split:", error);
    return { success: false, error: "Erro na conexão com o servidor" };
  }
}
