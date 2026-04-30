'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { 
  IconRepeat, IconCalendar, IconUser, IconTrash, 
  IconCheckCircle, IconAlertCircle, IconArrowLeft 
} from '@/components/ui/Icons';
import { cancelRecurringChargeAction } from '@/app/actions/charges';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import Link from 'next/link';

interface RecurringRule {
  id: string;
  amount: number;
  description: string;
  frequency: string;
  nextGenerationDate: string;
  active: boolean;
  debtorName: string;
  totalGenerated: number;
}

interface Props {
  initialData: RecurringRule[];
}

export function RecorrentesClient({ initialData }: Props) {
  const [rules, setRules] = useState<RecurringRule[]>(initialData);
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  };

  const translateFrequency = (freq: string) => {
    const map: Record<string, string> = {
      WEEKLY: 'Semanal',
      MONTHLY: 'Mensal',
      YEARLY: 'Anual',
    };
    return map[freq] || freq;
  };

  function handleCancelRule() {
    if (!selectedRule) return;

    startTransition(async () => {
      const res = await cancelRecurringChargeAction(selectedRule);
      if (res.success) {
        toast.success('Regra de recorrência cancelada!');
        setRules(prev => prev.map(r => r.id === selectedRule ? { ...r, active: false } : r));
        setSelectedRule(null);
      } else {
        toast.error(res.error || 'Erro ao cancelar.');
      }
    });
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            href="/dashboard/cobrancas" 
            className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors mb-2"
          >
            <IconArrowLeft className="w-4 h-4" />
            Voltar para cobranças
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-200">
            Regras de Recorrência
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Gerencie as automações que geram cobranças periódicas
          </p>
        </div>
      </div>

      {rules.length === 0 ? (
        <div className="bg-white dark:bg-surface border border-dashed border-zinc-200 dark:border-white/10 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-zinc-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IconRepeat className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
          </div>
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Nenhuma regra ativa</h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mt-2">
            Crie uma nova cobrança e selecione uma frequência para iniciar uma automação.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div 
              key={rule.id}
              className={`bg-white dark:bg-surface border ${rule.active ? 'border-zinc-100 dark:border-white/6' : 'border-zinc-100 dark:border-white/6 opacity-60'} rounded-3xl p-6 transition-all hover:shadow-xl hover:shadow-black/5 group`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rule.active ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-zinc-100 dark:bg-white/5 text-zinc-400'}`}>
                    <IconRepeat className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200 line-clamp-1">{rule.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${rule.active ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-zinc-100 dark:bg-white/5 text-zinc-400'}`}>
                        {translateFrequency(rule.frequency)}
                      </span>
                      {rule.active ? (
                        <span className="flex items-center gap-1 text-[10px] text-green-500 font-bold">
                          <IconCheckCircle className="w-3 h-3" /> ATIVA
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold">
                          <IconAlertCircle className="w-3 h-3" /> CANCELADA
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {rule.active && (
                  <button 
                    onClick={() => setSelectedRule(rule.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Cancelar recorrência"
                  >
                    <IconTrash className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-50 dark:border-white/5">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Valor</p>
                  <p className="text-lg font-extrabold text-zinc-800 dark:text-zinc-100">{formatCurrency(rule.amount)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Cliente</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <IconUser className="w-3.5 h-3.5 text-zinc-400" />
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{rule.debtorName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Próximo envio</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <IconCalendar className="w-3.5 h-3.5 text-zinc-400" />
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {rule.active ? new Date(rule.nextGenerationDate).toLocaleDateString('pt-BR') : '—'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Total gerado</p>
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200 mt-1">{rule.totalGenerated} cobranças</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!selectedRule}
        title="Parar recorrência?"
        description="Esta regra deixará de gerar novas cobranças automaticamente. Cobranças já enviadas não serão afetadas."
        confirmLabel="Sim, parar agora"
        variant="danger"
        loading={isPending}
        onConfirm={handleCancelRule}
        onCancel={() => setSelectedRule(null)}
      />
    </div>
  );
}
