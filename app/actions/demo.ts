export async function sendDemo(data: { name: string; phone: string; message: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/demo/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Erro ao enviar');

  return res.json() as Promise<{ sent: boolean; blocked: boolean }>;
}
