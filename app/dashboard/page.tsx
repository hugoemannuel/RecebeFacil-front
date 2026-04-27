import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { api } from '@/services/api';
import {
  IconWallet,
  IconAlertTriangle,
  IconSend,
  IconMessageCircle,
  IconZap,
  IconEye,
  IconMoreVertical,
  IconFilter
} from '@/components/ui/Icons';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('recebefacil_token')?.value;

  if (!token) {
    redirect('/login');
  }

  let metrics = null;
  try {
    const res = await api.get('/dashboard/metrics', {
      headers: { Authorization: `Bearer ${token}` }
    });
    metrics = res.data;
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
  }

  const summary = metrics?.summary || { totalPending: 0, totalOverdue: 0, sentThisMonth: 0, conversionRate: '0.0' };
  const actionNecessary = metrics?.actionNecessary || 0;
  const topClients = metrics?.topClients || [];
  const recentActivity = metrics?.recentActivity || [];
  const userName = metrics?.user?.name || 'Usuário';

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100);
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-[1600px] mx-auto space-y-6">

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
              <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">+8% hoje</span>
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
                <IconMessageCircle className="w-5 h-5" />
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
                <select className="bg-slate-100 border-none text-sm font-medium text-slate-600 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-green-500/20">
                  <option>Últimos 7 dias</option>
                  <option>Este mês</option>
                </select>
              </div>


              <div className="h-48 flex items-end justify-between gap-2 mt-10">
                <div className="w-full bg-green-100 hover:bg-green-200 transition-colors rounded-t-lg h-[30%] relative group">
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">SEG</span>
                </div>
                <div className="w-full bg-green-200 hover:bg-green-300 transition-colors rounded-t-lg h-[45%] relative group">
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">TER</span>
                </div>
                <div className="w-full bg-green-100 hover:bg-green-200 transition-colors rounded-t-lg h-[35%] relative group">
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">QUA</span>
                </div>
                <div className="w-full bg-green-300 hover:bg-green-400 transition-colors rounded-t-lg h-[80%] relative group">
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">QUI</span>
                </div>
                <div className="w-full bg-green-300 hover:bg-green-400 transition-colors rounded-t-lg h-[65%] relative group">
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">SEX</span>
                </div>
                <div className="w-full bg-green-100 hover:bg-green-200 transition-colors rounded-t-lg h-[25%] relative group">
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">SÁB</span>
                </div>
                <div className="w-full bg-green-100 hover:bg-green-200 transition-colors rounded-t-lg h-[20%] relative group">
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">DOM</span>
                </div>
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

              <button className="w-full bg-white text-[#0b6e3a] font-bold py-3.5 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <IconZap className="w-4 h-4 fill-current" />
                DISPARAR AGORA
              </button>
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
            <div className="flex gap-3">
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-sm transition-colors">
                Ver Todos
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-sm transition-colors flex items-center gap-2">
                <IconFilter className="w-4 h-4" /> Filtros
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-zinc-100">Cliente</th>
                  <th className="py-4 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-zinc-100">Valor</th>
                  <th className="py-4 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-zinc-100">Vencimento</th>
                  <th className="py-4 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-zinc-100">Status</th>
                  <th className="py-4 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-zinc-100 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      Nenhuma atividade recente encontrada.
                    </td>
                  </tr>
                ) : (
                  recentActivity.map((activity: any) => {
                    const isPaid = activity.status === 'PAID';
                    const isOverdue = activity.status === 'OVERDUE';
                    const isPending = activity.status === 'PENDING';

                    return (
                      <tr key={activity.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                              {activity.debtorName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900">{activity.debtorName}</p>
                              <p className="text-[11px] text-zinc-400">{activity.debtorEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-8">
                          <span className="font-bold text-zinc-900 text-base">{formatMoney(activity.amount)}</span>
                        </td>
                        <td className="py-5 px-8 text-slate-500">
                          {new Date(activity.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-5 px-8">
                          {isPaid && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Pago
                            </span>
                          )}
                          {isOverdue && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-600 text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Atrasado
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#eaf0c1] text-[#718210] text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#95a81e]"></span> Pendente
                            </span>
                          )}
                        </td>
                        <td className="py-5 px-8 text-right flex justify-end items-center gap-2">
                          {isOverdue && (
                            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors">
                              Cobrar
                            </button>
                          )}
                          <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
                            <IconMoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
