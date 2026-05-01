import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/services/api';
import { StoreInitializer } from '@/store/useUserStore/StoreInitializer';
import { SubscriptionStatus } from '@/components/layout/DashboardLayout/interface';

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const authHeaders = { Authorization: `Bearer ${token}` };

  const [subscriptionRes, userRes] = await Promise.allSettled([
    api.get('/subscription/status', { headers: authHeaders }),
    api.get('/users/me', { headers: authHeaders }),
  ]);

  const subscriptionData = subscriptionRes.status === 'fulfilled' ? subscriptionRes.value.data : null;
  const userData = userRes.status === 'fulfilled' ? userRes.value.data : null;

  const subscription: SubscriptionStatus = {
    plan: subscriptionData?.plan ?? 'FREE',
    status: subscriptionData?.status ?? 'NONE',
    allowed_modules: subscriptionData?.allowed_modules ?? ['HOME', 'CHARGES'],
    current_period_end: subscriptionData?.current_period_end ?? null,
    cancel_at_period_end: subscriptionData?.cancel_at_period_end ?? false,
    payment_failed: subscriptionData?.payment_failed ?? false,
    payment_failed_at: subscriptionData?.payment_failed_at ?? null,
    userName: userData?.name ?? 'Usuário',
    avatarUrl: userData?.avatar_url ?? undefined,
  };

  return (
    <>
      <StoreInitializer user={userData} subscription={subscription} />
      {children}
    </>
  );
}
