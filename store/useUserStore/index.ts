import { create } from 'zustand';
import { UserState } from './interface';
import { getSubscriptionStatusAction } from '@/app/actions/subscription';
import { getProfileAction } from '@/app/actions/profile';

export const useUserStore = create<UserState>((set) => ({
  user: null,
  subscription: null,
  loading: false,

  setUser: (user) => set({ user }),
  setSubscription: (subscription) => set({ subscription }),
  setLoading: (loading) => set({ loading }),

  updateLocalUser: (data) => set((state) => ({ 
    user: state.user ? { ...state.user, ...data } : null 
  })),

  updateLocalSubscription: (data) => set((state) => ({ 
    subscription: state.subscription ? { ...state.subscription, ...data } : null 
  })),

  initialize: (data) => set({ 
    user: data.user, 
    subscription: data.subscription 
  }),

  refresh: async () => {
    set({ loading: true });
    try {
      const [profileRes, subData] = await Promise.all([
        getProfileAction(),
        getSubscriptionStatusAction(),
      ]);

      if (profileRes.success) {
        set({ user: profileRes.data });
      }

      if (subData) {
        set({
          subscription: {
            plan: subData.plan,
            status: subData.status,
            allowed_modules: subData.allowed_modules,
            current_period_end: subData.current_period_end,
            cancel_at_period_end: subData.cancel_at_period_end,
            payment_failed: subData.payment_failed,
            payment_failed_at: subData.payment_failed_at,
            userName: profileRes.data?.name,
            avatarUrl: profileRes.data?.avatar_url,
          }
        });
      }
    } catch {
      // silencioso em produção — falha de refresh não quebra a sessão
    } finally {
      set({ loading: false });
    }
  },
}));
