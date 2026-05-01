import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout/DashboardLayout';
import { getRecurringChargesAction } from '@/app/actions/charges';
import { getSubscriptionStatusAction } from '@/app/actions/subscription';
import { getProfileAction } from '@/app/actions/profile';
import { RecorrentesClient } from './RecorrentesClient';
import { SubscriptionStatus } from '@/components/layout/DashboardLayout/interface';

export default async function RecorrentesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const [recurringRes, subscriptionRes, profileRes] = await Promise.all([
    getRecurringChargesAction(),
    getSubscriptionStatusAction(),
    getProfileAction(),
  ]);

  if (!recurringRes.success) {
    // Handle error or show empty
  }

  const subscription: SubscriptionStatus = {
    plan: subscriptionRes?.plan ?? 'FREE',
    status: subscriptionRes?.status ?? 'NONE',
    allowed_modules: subscriptionRes?.allowed_modules ?? ['HOME', 'CHARGES'],
    current_period_end: subscriptionRes?.current_period_end ?? null,
    cancel_at_period_end: subscriptionRes?.cancel_at_period_end ?? false,
    payment_failed: subscriptionRes?.payment_failed ?? false,
    payment_failed_at: subscriptionRes?.payment_failed_at ?? null,
    userName: profileRes?.data?.name ?? 'Usuário',
    avatarUrl: profileRes?.data?.avatar_url ?? undefined,
  };

  return (
    <DashboardLayout subscription={subscription}>
      <RecorrentesClient initialData={recurringRes.success ? recurringRes.data : []} plan={subscription.plan} />
    </DashboardLayout>
  );
}
