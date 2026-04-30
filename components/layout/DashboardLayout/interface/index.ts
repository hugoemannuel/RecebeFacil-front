export interface SubscriptionStatus {
  plan: 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED';
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'NONE';
  allowed_modules: string[];
  current_period_end: string | null;
  cancel_at_period_end?: boolean;
  payment_failed?: boolean;
  payment_failed_at?: string | null;
  userName?: string;
  avatarUrl?: string;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  subscription: SubscriptionStatus;
  sentThisMonth?: number;
}
