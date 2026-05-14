export interface CreditorProfile {
  id: string;
  business_name?: string;
  document?: string;
  pix_key?: string;
  pix_key_type?: 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'EVP';
  pix_merchant_name?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}
