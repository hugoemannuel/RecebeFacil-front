export interface SubscriptionStatus {
  plan: 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED';
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'NONE';
  allowed_modules: string[];
  current_period_end: string | null;
  userName?: string;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  subscription: SubscriptionStatus;
  sentThisMonth?: number;
}
