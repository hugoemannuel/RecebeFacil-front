'use client';

import { useState } from 'react';
import { 
  IconWallet, 
  IconTrendingUp, 
  IconArrowRight, 
  IconLock, 
  IconCalendar,
  IconArrowLeft,
  IconFilter,
  IconFileText,
  IconPlus
} from '@/components/ui/Icons';
import Link from 'next/link';
import { formatMoney } from '@/lib/formatters';
import { UpgradeModal } from '@/components/ui/UpgradeModal';

interface Props {
  isPremium: boolean;
  plan: string;
}

export function FinanceiroClient({ isPremium, plan }: Props) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!isPremium) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-white dark:bg-surface rounded-4xl border border-zinc-100 dark:border-white/7 shadow-xl overflow-hidden">
          <div className="p-12 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-500/10 rounded-3xl flex items-center justify-center animate-bounce">
              <IconLock className="w-10 h-10 text-amber-500" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                Módulo Financeiro Bloqueado
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto text-lg">
                Tenha controle total do seu fluxo de caixa, acompanhe recebimentos em tempo real e gerencie saques direto na plataforma.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl py-8">
              {[
                { title: 'Saldo Real', desc: 'Acompanhe seu saldo na Asaas', icon: '💰' },
                { title: 'Extrato Autônomo', desc: 'Conciliação automática de entradas', icon: '📊' },
                { title: 'Saques Diretos', desc: 'Transfira valores para seu banco', icon: '🏦' },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-50 dark:bg-white/5 p-6 rounded-2xl border border-transparent dark:border-white/5">
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Link 
                href="/planos"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Fazer Upgrade para PRO
                <IconArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/dashboard"
                className="flex-1 bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 font-bold py-4 rounded-2xl hover:bg-zinc-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 pb-20">
      {/* Header com Abas de Navegação */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Financeiro
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-lg">
            Gestão inteligente do seu capital e recebimentos.
          </p>
        </div>

        <div className="flex bg-zinc-100/50 dark:bg-white/5 p-1.5 rounded-2xl border border-zinc-200/50 dark:border-white/10">
          <Link href="/dashboard/financeiro" className="px-6 py-2.5 bg-white dark:bg-[#1a2d42] text-zinc-900 dark:text-zinc-50 rounded-xl font-bold text-sm shadow-sm transition-all">
            Visão Geral
          </Link>
          <Link href="/dashboard/financeiro/extrato" className="px-6 py-2.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl font-bold text-sm transition-all">
            Extrato
          </Link>
          <Link href="/dashboard/financeiro/saques" className="px-6 py-2.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl font-bold text-sm transition-all">
            Saques
          </Link>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-surface p-8 rounded-3xl border border-zinc-100 dark:border-white/7 shadow-sm group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center">
              <IconWallet className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-lg uppercase tracking-wider">
              Disponível
            </span>
          </div>
          <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Saldo na Carteira</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">R$ 0,00</p>
            <span className="text-xs text-zinc-400">Asaas Connect</span>
          </div>
        </div>

        <div className="bg-white dark:bg-surface p-8 rounded-3xl border border-zinc-100 dark:border-white/7 shadow-sm group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
              <IconCalendar className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-lg uppercase tracking-wider">
              Agendado
            </span>
          </div>
          <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">A Receber</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">R$ 0,00</p>
            <span className="text-xs text-zinc-400">Próx. 30 dias</span>
          </div>
        </div>

        <div className="bg-[#0b1521] dark:bg-surface-dark p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -z-10" />
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-white/5 text-white rounded-2xl flex items-center justify-center">
              <IconTrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-white/40 uppercase tracking-widest mb-1">Total Recebido (Mês)</p>
          <p className="text-3xl font-extrabold text-white tracking-tight">R$ 0,00</p>
          <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-bold">
            <IconTrendingUp className="w-4 h-4" />
            0% em relação ao mês anterior
          </div>
        </div>
      </div>

      {/* Seção Principal: Gráfico e Últimas Transações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico Placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-surface p-8 rounded-4xl border border-zinc-100 dark:border-white/7 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Fluxo de Caixa</h3>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">Entradas e saídas nos últimos 7 dias</p>
            </div>
            <button className="p-2.5 bg-zinc-50 dark:bg-white/5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
              <IconFilter className="w-5 h-5" />
            </button>
          </div>

          <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-zinc-100 dark:border-white/5 rounded-3xl">
            <div className="w-12 h-12 bg-zinc-50 dark:bg-white/5 rounded-full flex items-center justify-center">
              <IconTrendingUp className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
            </div>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-xs font-medium">
              Conecte sua conta Asaas para visualizar o gráfico de performance financeira.
            </p>
          </div>
        </div>

        {/* Últimas Transações Widget */}
        <div className="bg-white dark:bg-surface p-8 rounded-4xl border border-zinc-100 dark:border-white/7 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Últimas Atividades</h3>
            <Link href="/dashboard/financeiro/extrato" className="text-xs font-bold text-green-600 dark:text-green-400 hover:underline">
              Ver tudo
            </Link>
          </div>

          <div className="flex-1 space-y-4">
            <div className="py-20 flex flex-col items-center text-center space-y-3">
              <IconFileText className="w-10 h-10 text-zinc-200 dark:text-zinc-700" />
              <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">Nenhuma transação<br/>recente encontrada.</p>
            </div>
          </div>

          <button className="w-full bg-zinc-900 dark:bg-white/5 text-white dark:text-zinc-300 font-bold py-4 rounded-2xl hover:bg-zinc-800 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <IconPlus className="w-4 h-4" />
            Solicitar Saque
          </button>
        </div>
      </div>

      {/* Banner de Status de Conexão */}
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0 mx-auto md:mx-0">
            <IconWallet className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 dark:text-amber-300">Conexão Pendente</h4>
            <p className="text-sm text-amber-800/60 dark:text-amber-400/60">Sua conta Asaas ainda não está vinculada ao RecebeFácil para recebimento automático.</p>
          </div>
        </div>
        <Link 
          href="/dashboard/configuracoes" 
          className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold px-6 py-2.5 rounded-xl hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-all text-sm whitespace-nowrap"
        >
          Configurar Conexão
        </Link>
      </div>

      {showUpgrade && (
        <UpgradeModal moduleName="FINANCE" onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  );
}
