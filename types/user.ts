export interface CreditorProfile {
  id: string;
  name: string;
  pix_key?: string;
  pix_key_type?: 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'EVP';
  whatsapp_number?: string;
  business_name?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}
