'use client';

import React, { useState, useEffect } from 'react';
import { 
  IconTrendingUp, 
  IconUsers, 
  IconChartBar, 
  IconArrowUpRight, 
  IconArrowDownRight,
  IconLock,
  IconDownload,
  IconCalendar,
  IconMessageCircle
} from '@/components/ui/Icons';
import { UpgradeModal } from '@/components/ui/UpgradeModal';
import { api } from '@/services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

interface RelatoriosClientProps {
  isUnlimited: boolean;
  plan: string;
  token: string;
}

export function RelatoriosClient({ isUnlimited, plan, token }: RelatoriosClientProps) {
  const [showUpgrade, setShowUpgrade] = useState(!isUnlimited);
  const [loading, setLoading] = useState(isUnlimited);
  const [summary, setSummary] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    if (isUnlimited) {
      loadData();
    }
  }, [isUnlimited]);

  async function loadData() {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      
      const [sumRes, perfRes, custRes] = await Promise.all([
        api.get('/reports/summary', { headers }),
        api.get('/reports/performance', { headers }),
        api.get('/reports/customers', { headers }),
      ]);

      setSummary(sumRes.data);
      setPerformance(perfRes.data);
      setCustomers(custRes.data);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  }

  // Dados mockados para os gráficos se não houver dados reais suficientes
  const forecastData = [
    { name: 'Hoje', valor: 1200 },
    { name: '+7d', valor: 4500 },
    { name: '+15d', valor: 8900 },
    { name: '+30d', valor: 15600 },
  ];

  if (!isUnlimited) {
    return (
      <div className="p-8">
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-12 border border-zinc-200/60 dark:border-white/5 shadow-xl shadow-zinc-200/40 dark:shadow-none text-center max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <IconLock className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
            Relatórios Avançados & Inteligência de Negócio
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Tenha acesso a métricas de recuperação, projeção de fluxo de caixa e ranking de inadimplência. Exclusivo para o plano <strong>Unlimited</strong>.
          </p>
          <button 
            onClick={() => setShowUpgrade(true)}
            className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 dark:shadow-purple-900/20 flex items-center gap-2 mx-auto"
          >
            <IconTrendingUp className="w-5 h-5" />
            Fazer Upgrade para Unlimited
          </button>
        </div>
        {showUpgrade && (
          <UpgradeModal 
            onClose={() => setShowUpgrade(false)} 
            moduleName="REPORTS"
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Inteligência de Dados</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1">Insights detalhados sobre sua operação financeira.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">
            <IconCalendar className="w-4 h-4" />
            Últimos 30 dias
          </div>
          <button className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-2xl flex items-center gap-2 text-sm font-bold hover:bg-zinc-800 dark:hover:bg-white transition-colors">
            <IconDownload className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
              <IconTrendingUp className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
              <IconArrowUpRight className="w-3 h-3" />
              12%
            </div>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">Taxa de Recuperação</p>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
            {performance?.recoveryRate || '0'}%
          </h3>
          <p className="text-zinc-400 dark:text-zinc-500 text-[10px] mt-2 font-medium">Conversão de lembretes em pagamentos</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <IconChartBar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">Recebido via Automação</p>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
            R$ {(performance?.recoveredAmount || 0).toLocaleString('pt-BR')}
          </h3>
          <p className="text-zinc-400 dark:text-zinc-500 text-[10px] mt-2 font-medium">Total recuperado por réguas ativas</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
              <IconMessageCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">Churn Evitado</p>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
            {performance?.avoidedChurn || '0'} clientes
          </h3>
          <p className="text-zinc-400 dark:text-zinc-500 text-[10px] mt-2 font-medium">Alunos/clientes recuperados este mês</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
              <IconUsers className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-red-500 dark:text-red-400 text-xs font-bold bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-full">
              <IconArrowDownRight className="w-3 h-3" />
              5%
            </div>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">Tempo Médio p/ Pagar</p>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
            {performance?.averageDaysToPay || '0'} dias
          </h3>
          <p className="text-zinc-400 dark:text-zinc-500 text-[10px] mt-2 font-medium">Média após o vencimento</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfico de Forecast */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Projeção de Fluxo de Caixa</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Estimativa de recebimentos futuros</p>
            </div>
            <div className="bg-zinc-50 dark:bg-white/5 px-3 py-1 rounded-full text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Previsão 30 dias</div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-zinc-100 dark:text-white/5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(val) => `R$ ${val}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#18181b',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#8b5cf6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValor)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranking de Piores Pagadores */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-white/5 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Fila de Inadimplência</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Clientes com maior saldo vencido</p>
          </div>

          <div className="flex-1 space-y-4">
            {customers.length > 0 ? (
              customers.map((c, idx) => (
                <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50/50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 group hover:border-red-100 dark:hover:border-red-900/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-400 font-bold text-xs group-hover:text-red-500 transition-colors">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-800 dark:text-zinc-200">{c.name}</p>
                      <p className="text-[10px] font-bold text-red-500 uppercase">{c.overdueCount} faturas atrasadas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">R$ {c.totalOverdueAmount.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-40">
                <IconUsers className="w-12 h-12 text-zinc-400" />
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Nenhum devedor crítico</p>
              </div>
            )}
          </div>

          <button className="w-full mt-6 py-3 rounded-xl border border-zinc-200 dark:border-white/10 text-xs font-black text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
            VER LISTA COMPLETA
          </button>
        </div>
      </div>
    </div>
  );
}
