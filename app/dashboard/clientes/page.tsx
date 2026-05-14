import { DashboardLayout } from '@/components/layout/DashboardLayout/DashboardLayout';
import { ClientsClient } from './ClientsClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/services/api';
import { SubscriptionStatus } from '@/components/layout/DashboardLayout/interface';

export const metadata = {
  title: 'Clientes | RecebeFácil',
};

export default async function ClientsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;

  if (!token) redirect('/login');

  const authHeaders = { Authorization: `Bearer ${token}` };

  const [clientsRes, subscriptionRes, userRes] = await Promise.allSettled([
    api.get('/clients', { headers: authHeaders }),
    api.get('/subscription/status', { headers: authHeaders }),
    api.get('/users/me', { headers: authHeaders }),
  ]);

  const clientsData = clientsRes.status === 'fulfilled' ? clientsRes.value.data : [];
  const subscriptionData = subscriptionRes.status === 'fulfilled' ? subscriptionRes.value.data : null;
  const userData = userRes.status === 'fulfilled' ? userRes.value.data : null;

  const userName = userData?.name || 'Usuário';

  const subscription: SubscriptionStatus = {
    plan: subscriptionData?.plan ?? 'FREE',
    status: subscriptionData?.status ?? 'NONE',
    allowed_modules: subscriptionData?.allowed_modules ?? ['HOME', 'CHARGES'],
    current_period_end: subscriptionData?.current_period_end ?? null,
    cancel_at_period_end: subscriptionData?.cancel_at_period_end ?? false,
    payment_failed: subscriptionData?.payment_failed ?? false,
    payment_failed_at: subscriptionData?.payment_failed_at ?? null,
    userName,
    avatarUrl: userData?.avatar_url ?? undefined,
  };

  return (
    <DashboardLayout subscription={subscription}>
      <ClientsClient initialData={clientsData} plan={subscription.plan} />
    </DashboardLayout>
  );
}
