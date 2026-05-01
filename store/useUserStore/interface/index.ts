import { User } from '@/types/user';
import { SubscriptionStatus } from '@/components/layout/DashboardLayout/interface';

export interface UserState {
  user: User | null;
  subscription: SubscriptionStatus | null;
  loading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setSubscription: (subscription: SubscriptionStatus | null) => void;
  setLoading: (loading: boolean) => void;
  updateLocalUser: (data: Partial<User>) => void;
  updateLocalSubscription: (data: Partial<SubscriptionStatus>) => void;
  
  // Async actions
  refresh: () => Promise<void>;
  
  // Helper to initialize from server
  initialize: (data: { user: User | null; subscription: SubscriptionStatus | null }) => void;
}
