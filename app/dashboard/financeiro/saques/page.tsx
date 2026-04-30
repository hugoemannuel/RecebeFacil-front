import { DashboardLayout } from '@/components/layout/DashboardLayout/DashboardLayout';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/services/api';
import { SubscriptionStatus } from '@/components/layout/DashboardLayout/interface';
import { SaquesClient } from './SaquesClient';

export default async function SaquesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const authHeaders = { Authorization: `Bearer ${token}` };
  
  const [subscriptionRes, profileRes] = await Promise.all([
    api.get('/subscription/status', { headers: authHeaders }).catch(() => null),
    api.get('/users/me', { headers: authHeaders }).catch(() => null),
  ]);

  const subscriptionData = subscriptionRes?.data;
  const profileData = profileRes?.data;
  const plan = subscriptionData?.plan ?? 'FREE';
  const isPremium = ['PRO', 'UNLIMITED'].includes(plan);

  const subscription: SubscriptionStatus = {
    plan: plan,
    status: subscriptionData?.status ?? 'NONE',
    allowed_modules: subscriptionData?.allowed_modules ?? ['HOME', 'CHARGES'],
    current_period_end: subscriptionData?.current_period_end ?? null,
    cancel_at_period_end: subscriptionData?.cancel_at_period_end ?? false,
    payment_failed: subscriptionData?.payment_failed ?? false,
    payment_failed_at: subscriptionData?.payment_failed_at ?? null,
    userName: profileData?.name ?? 'Usuário',
    avatarUrl: profileData?.avatar_url,
  };

  return (
    <DashboardLayout subscription={subscription}>
      <SaquesClient isPremium={isPremium} plan={plan} />
    </DashboardLayout>
  );
}
