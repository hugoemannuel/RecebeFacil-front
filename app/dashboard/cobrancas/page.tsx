import { DashboardLayout, SubscriptionStatus } from '@/components/layout/DashboardLayout';
import { ChargesClient } from './ChargesClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/services/api';


export const metadata = {
  title: 'Cobranças | RecebeFácil',
};

// Mock de dados para a Fase 1
const MOCK_CHARGES = [
  { id: '1', debtorName: 'Carlos Silva', phone: '5511999999999', amount: 15000, dueDate: '2023-11-20', status: 'PENDING', automationEnabled: false },
  { id: '2', debtorName: 'Mariana Souza', phone: '5511888888888', amount: 25000, dueDate: '2023-11-10', status: 'OVERDUE', automationEnabled: true },
  { id: '3', debtorName: 'Roberto Alves', phone: '5511777777777', amount: 9900, dueDate: '2023-11-05', status: 'PAID', automationEnabled: false },
  { id: '4', debtorName: 'Juliana Costa', phone: '5511666666666', amount: 45000, dueDate: '2023-11-25', status: 'PENDING', automationEnabled: false },
];

export default async function ChargesPage() {
  // Simulando contexto do servidor
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;


  if (!token) {
    redirect('/login');
  }
  const userPlan: 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED' = 'FREE';
  const usageCount = 8;
  const usageLimit = 10;

  const authHeaders = { Authorization: `Bearer ${token}` };
  const [metricsRes, subscriptionRes] = await Promise.allSettled([
    api.get('/dashboard/metrics', { headers: authHeaders }),
    api.get('/subscription/status', { headers: authHeaders }),
  ]);
  const metrics = metricsRes.status === 'fulfilled' ? metricsRes.value.data : null;

  const subscriptionData = subscriptionRes.status === 'fulfilled' ? subscriptionRes.value.data : null;
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
        initialData={MOCK_CHARGES}
        plan={userPlan}
        usage={{ count: usageCount, limit: usageLimit }}
      />
    </DashboardLayout>
  );
}
