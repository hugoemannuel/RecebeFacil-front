// Utilitários de formatação — padrão do projeto (masks nativas, sem libs externas)

/** Formata valor em centavos para BRL: 15000 → "R$ 150,00" */
export function formatMoney(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

/** Máscara monetária para input: "1500" → "R$ 15,00" */
export function maskMoney(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  const num = parseInt(digits || '0', 10);
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num / 100);
}

/** Converte string mascarada de volta para centavos: "R$ 150,00" → 15000 */
export function parseMoney(masked: string): number {
  const digits = masked.replace(/\D/g, '');
  return parseInt(digits || '0', 10);
}

/** Máscara de telefone: "11999999999" → "(11) 99999-9999" */
export function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
}

/** Formata data para exibição: Date → "30/04/2026" */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

/** Substitui variáveis do template pela mensagem real */
export function interpolateTemplate(
  template: string,
  vars: {
    nome?: string;
    valor?: string;
    vencimento?: string;
    descricao?: string;
    nome_empresa?: string;
    dias_atraso?: string;
  }
): string {
  return template
    .replace(/\{\{nome\}\}/g, vars.nome ?? 'Cliente')
    .replace(/\{\{valor\}\}/g, vars.valor ?? 'R$ 0,00')
    .replace(/\{\{vencimento\}\}/g, vars.vencimento ?? '--/--/----')
    .replace(/\{\{descricao\}\}/g, vars.descricao ?? '')
    .replace(/\{\{nome_empresa\}\}/g, vars.nome_empresa ?? 'RecebeFácil')
    .replace(/\{\{dias_atraso\}\}/g, vars.dias_atraso ?? '0');
}
