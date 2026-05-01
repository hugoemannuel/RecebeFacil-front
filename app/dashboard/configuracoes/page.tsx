import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/services/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout/DashboardLayout';
import { ConfiguracoesClient } from './ConfiguracoesClient';
import { SubscriptionStatus } from '@/components/layout/DashboardLayout/interface';
import { StoreInitializer } from '@/store/useUserStore/StoreInitializer';

export default async function ConfiguracoesPage() {
  const token = (await cookies()).get('recebefacil_token')?.value;
  if (!token) redirect('/login');

  const authHeaders = { Authorization: `Bearer ${token}` };

  const [profileRes, subscriptionRes, creditorRes, automationRes, templatesRes] = await Promise.allSettled([
    api.get('/users/me', { headers: authHeaders }),
    api.get('/subscription/status', { headers: authHeaders }),
    api.get('/profiles/me', { headers: authHeaders }),
    api.get('/integrations/automation', { headers: authHeaders }),
    api.get('/profiles/me/templates', { headers: authHeaders }),
  ]);
 
  const profile = profileRes.status === 'fulfilled' ? profileRes.value.data : null;
  const subscriptionData = subscriptionRes.status === 'fulfilled' ? subscriptionRes.value.data : null;
  const creditorProfile = creditorRes.status === 'fulfilled' ? creditorRes.value.data : null;
  const automationConfig = automationRes.status === 'fulfilled' ? automationRes.value.data : null;
  const templates = templatesRes.status === 'fulfilled' ? templatesRes.value.data : [];

  const subscription: SubscriptionStatus = {
    plan: subscriptionData?.plan ?? 'FREE',
    status: subscriptionData?.status ?? 'NONE',
    allowed_modules: subscriptionData?.allowed_modules ?? ['HOME', 'CHARGES'],
    current_period_end: subscriptionData?.current_period_end ?? null,
    cancel_at_period_end: subscriptionData?.cancel_at_period_end ?? false,
    payment_failed: subscriptionData?.payment_failed ?? false,
    payment_failed_at: subscriptionData?.payment_failed_at ?? null,
    userName: profile?.name ?? 'Usuário',
    avatarUrl: profile?.avatar_url ?? undefined,
  };

  return (
    <>
      <StoreInitializer user={profile} subscription={subscription} />
      <DashboardLayout subscription={subscription}>
      <ConfiguracoesClient
        profile={profile}
        subscription={subscriptionData}
        creditorProfile={creditorProfile}
        automationConfig={automationConfig}
        templates={templates}
      />
    </DashboardLayout>
    </>
  );
}
