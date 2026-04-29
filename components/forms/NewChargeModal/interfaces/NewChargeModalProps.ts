export interface NewChargeModalProps {
  open: boolean;
  onClose: () => void;
  userName?: string;
  hasPixKey?: boolean;
  planType?: 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED';
  onSuccess?: () => void;
}
