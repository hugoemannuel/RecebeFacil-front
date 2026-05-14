export interface Charge {
  id: string;
  amount: number;
  due_date: string;
  description: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELED';
  recurrence?: 'ONCE' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  custom_message?: string;
  created_at: string;
  payment_date?: string;
  debtor: {
    name: string;
    phone: string;
  };
  messages?: Array<{
    id: string;
    status: 'SENT' | 'FAILED';
    sent_at: string;
    trigger_type: 'MANUAL' | 'AUTOMATIC';
    error_details?: string;
  }>;
}

export interface ChargeFormData {
  debtor_name: string;
  debtor_phone: string;
  amount_display: string;
  due_date: Date;
  description: string;
  recurrence: 'ONCE' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  custom_message: string;
  send_pix_button: boolean;
  pix_key?: string;
  pix_key_type?: 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'EVP';
  save_as_template?: boolean;
  template_name?: string;
}
