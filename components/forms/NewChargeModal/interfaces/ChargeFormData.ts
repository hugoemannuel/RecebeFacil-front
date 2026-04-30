import { z } from 'zod';
import { parseMoney } from '@/lib/formatters';

export const DEFAULT_TEMPLATE = `Olá *{{nome}}*! 👋

Passando para lembrar da sua cobrança:

💰 Valor: *{{valor}}*
📅 Vencimento: *{{vencimento}}*
📝 Referência: {{descricao}}

Para pagar via PIX, clique no botão abaixo! ✅`;

export const TEMPLATE_OPTIONS = [
  { label: 'Cobrança Inicial', value: DEFAULT_TEMPLATE },
  { label: 'Lembrete Amigável', value: `Oi *{{nome}}*! 😊\n\nSua cobrança de *{{valor}}* vence em *{{vencimento}}*.\n\nPague via PIX rapidinho! 💳` },
  { label: 'Urgente', value: `⚠️ *{{nome}}*, sua cobrança de *{{valor}}* vence *hoje*!\n\nEvite atrasos — pague agora via PIX.` },
];

export const VARIABLES = ['{{nome}}', '{{valor}}', '{{vencimento}}', '{{descricao}}', '{{nome_empresa}}'];
export const STEPS = ['Devedor', 'Cobrança', 'Mensagem', 'Confirmar'];

export const baseSchema = z.object({
  debtor_name: z.string().min(2, 'Nome obrigatório'),
  debtor_phone: z.string().min(10, 'Telefone obrigatório'),
  amount_display: z.string().min(1, 'Valor obrigatório').refine((val) => parseMoney(val) >= 100, { message: 'Valor mínimo R$ 1,00' }),
  due_date: z.date({ error: 'Data obrigatória' }).refine((val) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return val >= today;
  }, { message: 'A data deve ser futura ou hoje' }),
  description: z.string().min(3, 'Descrição obrigatória').max(200),
  recurrence: z.enum(['ONCE', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  custom_message: z.string().min(5, 'Mensagem obrigatória'),
  send_pix_button: z.boolean(),
  pix_key: z.string().optional(),
  pix_key_type: z.enum(['CPF', 'CNPJ', 'PHONE', 'EMAIL', 'EVP']).optional(),
  save_as_template: z.boolean().optional(),
});

export type ChargeFormData = z.infer<typeof baseSchema>;
export type PlanType = 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED';
