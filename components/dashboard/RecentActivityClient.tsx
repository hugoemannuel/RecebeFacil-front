'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatMoney } from '@/lib/formatters';
import { IconCheckCircle, IconAlertCircle, IconClock, IconSend } from '@/components/ui/Icons';
import { ChargeDetailsDrawer } from '@/components/dashboard/ChargeDetailsDrawer';

interface Props {
  recentActivity: any[];
}

export function RecentActivityClient({ recentActivity }: Props) {
  const [detailsChargeId, setDetailsChargeId] = useState<string | null>(null);

  return (
    <>
      {/* MOBILE VIEW (CARDS) */}
      <div className="md:hidden divide-y divide-zinc-100 dark:divide-white/5">
        {recentActivity.map((activity: any) => (
          <div
            key={activity.id}
            className="p-6 active:bg-zinc-50 dark:active:bg-white/5 transition-colors"
            onClick={() => setDetailsChargeId(activity.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-white/10 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-bold text-xs">
                  {activity.debtorName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-zinc-700 dark:text-zinc-200">{activity.debtorName}</p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    {new Date(activity.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div>
                {activity.status === 'PAID' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400">
                    Pago
                  </span>
                )}
                {activity.status === 'OVERDUE' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400">
                    Atrasado
                  </span>
                )}
                {activity.status === 'PENDING' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400">
                    Pendente
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-zinc-700 dark:text-zinc-200 text-lg">
                {formatMoney(activity.amount)}
              </span>
            </div>
          </div>
        ))}
        {recentActivity.length === 0 && (
          <div className="py-12 text-center text-sm text-zinc-400">Nenhuma atividade recente.</div>
        )}
      </div>

      <table className="hidden md:table w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-100/50 dark:bg-white/2">
            <th className="py-4 px-8 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-200/80 dark:border-white/6">Cliente</th>
            <th className="py-4 px-8 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-200/80 dark:border-white/6">Valor</th>
            <th className="py-4 px-8 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-200/80 dark:border-white/6">Vencimento</th>
            <th className="py-4 px-8 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-200/80 dark:border-white/6">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-white/5 text-sm">
          {recentActivity.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-16 text-center">
                <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <IconSend className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 mb-1">Nenhuma atividade recente</h3>
                  <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-6">Você ainda não tem cobranças movimentadas no período selecionado.</p>
                  <Link href="/dashboard/cobrancas?new=true" className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 font-bold text-sm rounded-lg transition-colors">
                    Nova Cobrança
                  </Link>
                </div>
              </td>
            </tr>
          ) : (
            recentActivity.map((activity: any) => {
              const isPaid = activity.status === 'PAID';
              const isOverdue = activity.status === 'OVERDUE';
              const isPending = activity.status === 'PENDING';

              return (
                <tr 
                  key={activity.id} 
                  className="hover:bg-zinc-100/60 dark:hover:bg-white/3 transition-colors cursor-pointer"
                  onClick={() => setDetailsChargeId(activity.id)}
                >
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-white/10 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-bold text-xs">
                        {activity.debtorName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-700 dark:text-zinc-200">{activity.debtorName}</p>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{activity.debtorEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <span className="font-bold text-zinc-700 dark:text-zinc-200 text-base">{formatMoney(activity.amount)}</span>
                  </td>
                  <td className="py-5 px-8 text-zinc-400 dark:text-zinc-500">
                    {new Date(activity.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-5 px-8">
                    {isPaid && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400">
                        <IconCheckCircle className="w-3 h-3" /> Pago
                      </span>
                    )}
                    {isOverdue && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400">
                        <IconAlertCircle className="w-3 h-3" /> Atrasado
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400">
                        <IconClock className="w-3 h-3" /> Pendente
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <ChargeDetailsDrawer
        chargeId={detailsChargeId}
        onClose={() => setDetailsChargeId(null)}
      />
    </>
  );
}

