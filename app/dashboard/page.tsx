import { DashboardLayout, SubscriptionStatus } from '@/components/layout/DashboardLayout';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';
import {
  IconWallet,
  IconAlertTriangle,
  IconSend,
  IconZap,
  IconMoreVertical,
  IconFilter,
  IconCheckCircle,
  IconAlertCircle,
  IconClock
} from '@/components/ui/Icons';
import { PeriodSelect } from '@/components/dashboard/PeriodSelect';
import { RecentActivityClient } from '@/components/dashboard/RecentActivityClient';

export default async function Dashboard(props: any) {
  const searchParams = await props.searchParams;
  const period = searchParams?.period || '7days';
  const status = searchParams?.status;
  const targetDate = searchParams?.targetDate;
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const authHeaders = { Authorization: `Bearer ${token}` };

  const queryParams = new URLSearchParams();
  if (period) queryParams.set('period', period);
  if (status) queryParams.set('status', status);
  if (targetDate) queryParams.set('targetDate', targetDate);

  // Busca métricas e assinatura em paralelo para melhor performance
  const [metricsRes, subscriptionRes] = await Promise.allSettled([
    api.get(`/dashboard/metrics?${queryParams.toString()}`, { headers: authHeaders }),
    api.get('/subscription/status', { headers: authHeaders }),
  ]);

  const metrics = metricsRes.status === 'fulfilled' ? metricsRes.value.data : null;
  const subscriptionData = subscriptionRes.status === 'fulfilled' ? subscriptionRes.value.data : null;

  if (metricsRes.status === 'rejected') console.error('Failed to fetch metrics:', metricsRes.reason);
  if (subscriptionRes.status === 'rejected') console.error('Failed to fetch subscription:', subscriptionRes.reason);

  const summary = metrics?.summary || { totalPending: 0, totalOverdue: 0, sentThisMonth: 0, conversionRate: '0.0' };
  const actionNecessary = metrics?.actionNecessary || 0;
  const topClients = metrics?.topClients || [];
  const chartData = metrics?.chart || [
    { label: 'DOM', amount: 0, heightPercentage: 10 },
    { label: 'SEG', amount: 0, heightPercentage: 10 },
    { label: 'TER', amount: 0, heightPercentage: 10 },
    { label: 'QUA', amount: 0, heightPercentage: 10 },
    { label: 'QUI', amount: 0, heightPercentage: 10 },
    { label: 'SEX', amount: 0, heightPercentage: 10 },
    { label: 'SÁB', amount: 0, heightPercentage: 10 },
  ];
  const recentActivity = metrics?.recentActivity || [];
  const userName = metrics?.user?.name || 'Usuário';

  const subscription: SubscriptionStatus = {
    plan: subscriptionData?.plan ?? 'FREE',
    status: subscriptionData?.status ?? 'NONE',
    allowed_modules: subscriptionData?.allowed_modules ?? ['HOME', 'CHARGES'],
    current_period_end: subscriptionData?.current_period_end ?? null,
    userName,
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100);
  };

  return (
    <DashboardLayout subscription={subscription} sentThisMonth={summary.sentThisMonth}>

      <div className="p-8 max-w-[1600px] mx-auto space-y-6">

        {targetDate && (
          <div className="fixed bottom-6 right-6 z-50 bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-2xl flex flex-col gap-4 shadow-xl shadow-amber-900/10 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex items-start gap-3">
              <IconAlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base">Modo Viagem no Tempo</p>
                <p className="text-sm opacity-80 mt-0.5 leading-relaxed">
                  Vendo métricas {period === 'month' ? 'da semana iniciada em' : 'como se hoje fosse o dia'} <strong>{new Date(targetDate + 'T00:00:00').toLocaleDateString('pt-BR')}</strong>.
                </p>
              </div>
            </div>
            <Link href="/dashboard" className="w-full text-center bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
              Voltar ao Presente
            </Link>
          </div>
        )}

        <div className="bg-[#0b1521] rounded-[2rem] p-8 lg:p-10 text-white relative overflow-hidden shadow-xl shadow-slate-200/50">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

          <div className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
            Performance em tempo real
          </div>

          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3">
            Bom dia, {userName}.
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Sua performance este mês está <span className="text-green-400 font-medium">+15% acima da média</span> do trimestre anterior. O dinheiro está em movimento.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">


          <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <IconWallet className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${summary.pendingVariation?.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-700'}`}>
                {summary.pendingVariation || '0%'} hoje
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Total a Receber</p>
              <p className="text-2xl font-bold text-zinc-900 tracking-tight">{formatMoney(summary.totalPending)}</p>
            </div>
          </div>


          <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden">
            <div className="absolute left-0 top-6 bottom-6 w-1 bg-red-500 rounded-r-full"></div>
            <div className="flex justify-between items-start pl-2">
              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                <IconAlertTriangle className="w-5 h-5" />
              </div>
              <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">Alerta</span>
            </div>
            <div className="pl-2">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Atrasados</p>
              <p className="text-2xl font-bold text-red-500 tracking-tight">{formatMoney(summary.totalOverdue)}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center">
                <IconSend className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Cobranças Enviadas</p>
              <p className="text-2xl font-bold text-zinc-900 tracking-tight">{summary.sentThisMonth} <span className="text-sm font-medium text-zinc-400">este mês</span></p>
            </div>
          </div>


          <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
              </div>
              <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">Alta</span>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Conversão WhatsApp</p>
              <p className="text-2xl font-bold text-zinc-900 tracking-tight">{summary.conversionRate}%</p>
            </div>
          </div>

        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-1">Recebimentos por Dia</h3>
                  <p className="text-sm text-zinc-500">Acompanhamento de fluxo de caixa em tempo real</p>
                </div>
                <PeriodSelect />
              </div>


              <div className="h-48 flex items-end justify-between gap-2 mt-10">
                {chartData.map((d: any, i: number) => {
                  const isSelected = targetDate ? d.date === targetDate : d.isToday;
                  return (
                    <Link
                      href={d.isToday ? `/dashboard?period=${period}` : `/dashboard?targetDate=${d.date}&period=${period}`}
                      key={i}
                      className={`w-full transition-colors rounded-t-lg relative group flex items-end justify-center pb-2 cursor-pointer ${isSelected ? 'bg-green-500 hover:bg-green-400' : 'bg-green-100 hover:bg-green-200'}`}
                      style={{ height: `${d.heightPercentage}%` }}
                      title={`${d.count || 0} cobrança(s)\n${formatMoney(d.amount)}`}
                    >
                      <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold ${isSelected ? 'text-green-600' : 'text-slate-400'}`}>
                        {d.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>


          <div className="space-y-6">
            {/* Action Necessary */}
            <div className="bg-[#0b6e3a] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -z-10"></div>

              <h3 className="text-green-300 font-medium mb-4">Ação Necessária</h3>
              <p className="text-lg font-medium leading-snug mb-8">
                Existem <span className="font-bold">{actionNecessary} cobranças</span> que vencem amanhã via Pix. Enviar lembrete em massa?
              </p>

              <Link href="/dashboard/cobrancas" className="w-full bg-white text-[#0b6e3a] font-bold py-3.5 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <IconZap className="w-4 h-4 fill-current" />
                VER COBRANÇAS
              </Link>
            </div>

            {/* Top Clientes */}
            <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Top Clientes</h3>

              <div className="space-y-5">
                {topClients.length === 0 ? (
                  <p className="text-sm text-zinc-400">Nenhum cliente com pendências.</p>
                ) : (
                  topClients.map((client: any, i: number) => (
                    <div key={client.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${i % 2 === 0 ? 'bg-[#c9e038] text-[#4d5c0b]' : 'bg-[#d6e4ff] text-[#1b3d8c]'}`}>
                          {client.initials}
                        </div>
                        <span className="font-medium text-sm text-zinc-900">{client.name}</span>
                      </div>
                      <span className="font-bold text-sm text-zinc-900">{formatMoney(client.totalAmount)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Atividade Recente Table */}
        <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 mb-1">Atividade Recente</h3>
              <p className="text-sm text-zinc-500">Gestão detalhada de entradas e pendências</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard?period=${period}`} className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${!status ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                Todos
              </Link>
              <Link href={`/dashboard?period=${period}&status=PENDING`} className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                Pendente
              </Link>
              <Link href={`/dashboard?period=${period}&status=OVERDUE`} className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                Atrasado
              </Link>
              <Link href={`/dashboard?period=${period}&status=PAID`} className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                Pago
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <RecentActivityClient recentActivity={recentActivity} />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
