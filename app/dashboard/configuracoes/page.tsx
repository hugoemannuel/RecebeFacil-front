import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/services/api';
import { DashboardLayout, SubscriptionStatus } from '@/components/layout/DashboardLayout';
import { ConfiguracoesClient } from './ConfiguracoesClient';

export default async function ConfiguracoesPage() {
  const token = (await cookies()).get('recebefacil_token')?.value;
  if (!token) redirect('/login');

  const authHeaders = { Authorization: `Bearer ${token}` };

  const [profileRes, subscriptionRes] = await Promise.allSettled([
    api.get('/users/me', { headers: authHeaders }),
    api.get('/subscription/status', { headers: authHeaders }),
  ]);

  const profile = profileRes.status === 'fulfilled' ? profileRes.value.data : null;
  const subscriptionData = subscriptionRes.status === 'fulfilled' ? subscriptionRes.value.data : null;

  const subscription: SubscriptionStatus = {
    plan: subscriptionData?.plan ?? 'FREE',
    status: subscriptionData?.status ?? 'NONE',
    allowed_modules: subscriptionData?.allowed_modules ?? ['HOME', 'CHARGES'],
    current_period_end: subscriptionData?.current_period_end ?? null,
    userName: profile?.name ?? 'Usuário',
  };

  return (
    <DashboardLayout subscription={subscription}>
      <ConfiguracoesClient
        profile={profile}
        subscription={subscriptionData}
      />
    </DashboardLayout>
  );
}
