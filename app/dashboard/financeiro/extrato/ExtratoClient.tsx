'use client';

import { 
  IconFilter, 
  IconFileText, 
  IconArrowLeft, 
  IconLock, 
  IconTrendingUp,
  IconArrowRight
} from '@/components/ui/Icons';
import Link from 'next/link';

interface Props {
  isPremium: boolean;
  plan: string;
}

export function ExtratoClient({ isPremium, plan }: Props) {
  if (!isPremium) {
    return (
        <div className="p-8 max-w-5xl mx-auto text-center py-20">
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <IconLock className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Extrato Premium</h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8">
                O histórico detalhado de todas as suas movimentações financeiras está disponível apenas nos planos PRO e UNLIMITED.
            </p>
            <Link 
                href="/planos"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-2xl transition-all"
            >
                Ver planos para upgrade
            </Link>
        </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/financeiro" className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
            <IconArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Extrato Detalhado
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              Filtre e exporte todo o histórico de transações da sua conta.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-white/10 transition-all">
                <IconFilter className="w-4 h-4" />
                Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-green-500 text-white font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-green-600 transition-all">
                <IconFileText className="w-4 h-4" />
                Exportar
            </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface rounded-4xl border border-zinc-100 dark:border-white/7 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50 dark:bg-white/2">
              <th className="py-5 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">Data</th>
              <th className="py-5 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">Descrição</th>
              <th className="py-5 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">Valor</th>
              <th className="py-5 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
            <tr>
              <td colSpan={4} className="py-32 text-center">
                <div className="flex flex-col items-center space-y-3 opacity-30">
                  <IconFileText className="w-12 h-12" />
                  <p className="font-bold text-lg">Nenhuma transação encontrada</p>
                  <p className="text-sm">As transações da Asaas aparecerão aqui em breve.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
