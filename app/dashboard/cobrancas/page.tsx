import { DashboardLayout } from '@/components/layout/DashboardLayout/DashboardLayout';
import { ChargesClient } from './ChargesClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/services/api';
import { SubscriptionStatus } from '@/components/layout/DashboardLayout/interface';


export const metadata = {
  title: 'Cobranças | RecebeFácil',
};



export default async function ChargesPage() {
  // Simulando contexto do servidor
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;


  if (!token) {
    redirect('/login');
  }

  const authHeaders = { Authorization: `Bearer ${token}` };
  const [metricsRes, subscriptionRes, chargesRes] = await Promise.allSettled([
    api.get('/dashboard/metrics', { headers: authHeaders }),
    api.get('/subscription/status', { headers: authHeaders }),
    api.get('/charges', { headers: authHeaders }),
  ]);
  const metrics = metricsRes.status === 'fulfilled' ? metricsRes.value.data : null;

  const subscriptionData = subscriptionRes.status === 'fulfilled' ? subscriptionRes.value.data : null;
  const chargesData = chargesRes.status === 'fulfilled' ? chargesRes.value.data : [];

  const limits: Record<string, number> = { FREE: 10, STARTER: 50, PRO: 200, UNLIMITED: 999999 };
  const userPlan = subscriptionData?.plan ?? 'FREE';
  const usageCount = metrics?.summary?.sentThisMonth || 0;
  const usageLimit = limits[userPlan] || 10;

  const userName = metrics?.user?.name || 'Usuário';

  const subscription: SubscriptionStatus = {
    plan: subscriptionData?.plan ?? 'FREE',
    status: subscriptionData?.status ?? 'NONE',
    allowed_modules: subscriptionData?.allowed_modules ?? ['HOME', 'CHARGES'],
    current_period_end: subscriptionData?.current_period_end ?? null,
    userName,
  };

  return (
    <DashboardLayout subscription={subscription} >
      <ChargesClient
        initialData={chargesData}
        plan={userPlan}
        usage={{ count: usageCount, limit: usageLimit }}
      />
    </DashboardLayout>
  );
}
