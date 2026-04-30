import { DashboardLayout } from '@/components/layout/DashboardLayout/DashboardLayout';
import { TemplatesClient } from './TemplatesClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/services/api';
import { SubscriptionStatus } from '@/components/layout/DashboardLayout/interface';
import { getTemplatesAction } from '@/app/actions/templates';

export const metadata = {
  title: 'Templates de Mensagem | RecebeFácil',
};

export default async function TemplatesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const authHeaders = { Authorization: `Bearer ${token}` };
  const [subscriptionRes, templatesRes, userRes] = await Promise.allSettled([
    api.get('/subscription/status', { headers: authHeaders }),
    getTemplatesAction(),
    api.get('/users/me', { headers: authHeaders }),
  ]);

  const subscriptionData = subscriptionRes.status === 'fulfilled' ? subscriptionRes.value.data : null;
  const templatesData = templatesRes.status === 'fulfilled' && templatesRes.value.success ? templatesRes.value.data : [];
  const userData = userRes.status === 'fulfilled' ? userRes.value.data : null;

  const userPlan = subscriptionData?.plan ?? 'FREE';

  const subscription: SubscriptionStatus = {
    plan: userPlan,
    status: subscriptionData?.status ?? 'NONE',
    allowed_modules: subscriptionData?.allowed_modules ?? ['HOME', 'CHARGES'],
    current_period_end: subscriptionData?.current_period_end ?? null,
    cancel_at_period_end: subscriptionData?.cancel_at_period_end ?? false,
    payment_failed: subscriptionData?.payment_failed ?? false,
    payment_failed_at: subscriptionData?.payment_failed_at ?? null,
    userName: userData?.name || 'Usuário',
    avatarUrl: userData?.avatar_url ?? undefined,
  };

  return (
    <DashboardLayout subscription={subscription}>
      <TemplatesClient initialData={templatesData} plan={userPlan} />
    </DashboardLayout>
  );
}
