'use client';

import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { RHFInput } from '@/components/forms/rhf/RHFInput';
import { RHFTextarea } from '@/components/forms/rhf/RHFTextarea';
import { DatePickerField } from '@/components/patterns/DatePickerField/DatePickerField';
import { IconDollarSign, IconCalendar, IconRepeat } from '@/components/ui/Icons';
import { maskMoney } from '@/lib/formatters';
import type { ChargeFormData, PlanType } from '../interfaces';

export function StepChargeDetails({ planType }: { planType: PlanType }) {
  const { control, watch, setValue } = useFormContext<ChargeFormData>();
  const values = watch();

  const allowedRecurrences = {
    FREE: ['ONCE'],
    STARTER: ['ONCE', 'WEEKLY'],
    PRO: ['ONCE', 'WEEKLY', 'MONTHLY', 'YEARLY'],
    UNLIMITED: ['ONCE', 'WEEKLY', 'MONTHLY', 'YEARLY'],
  }[planType] || ['ONCE'];

  return (
    <>
      <p className="text-sm text-zinc-500">Detalhes da cobrança</p>
      <div className="space-y-4">
        <RHFInput name="amount_display" control={control} label="Valor" placeholder="R$ 0,00" icon={<IconDollarSign />} mask={maskMoney} />
        <DatePickerField name="due_date" control={control} label="Vencimento" icon={<IconCalendar />} disabled={{ before: new Date() }} />
        <RHFTextarea name="description" control={control} label="Descrição" rows={2} placeholder="Ex: Corte de cabelo — Abril/2026" />
        <div>
          <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1.5">Recorrência</label>
          <div className="grid grid-cols-2 gap-2">
            {(['ONCE', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const).map((r) => {
              const labels = { ONCE: '1× Única', WEEKLY: 'Semanal', MONTHLY: 'Mensal', YEARLY: 'Anual' };
              const isAllowed = allowedRecurrences.includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    if (isAllowed) setValue('recurrence', r);
                    else toast.error(`O plano ${planType} não permite recorrência ${labels[r]}. Faça upgrade!`);
                  }}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all overflow-hidden ${!isAllowed ? 'opacity-50 cursor-not-allowed bg-zinc-50 border-zinc-200 text-zinc-400' : values.recurrence === r ? 'bg-green-50 border-green-400 text-green-700' : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'}`}
                >
                  <IconRepeat className="w-3.5 h-3.5" />
                  {labels[r]}
                  {!isAllowed && <span className="absolute top-0 right-0 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 text-[8px] uppercase px-1.5 py-0.5 rounded-bl-lg font-extrabold">Pro</span>}
                </button>
              );
            })}
          </div>
        </div>

        {values.recurrence !== 'ONCE' && (planType === 'PRO' || planType === 'UNLIMITED') && (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <RHFInput
              name="max_installments"
              control={control}
              label="Nº de parcelas"
              type="number"
              placeholder="Indefinido"
            />
            <div className="flex items-end pb-1">
              <p className="text-xs text-zinc-400 leading-snug">
                Deixe em branco para cobrar <span className="font-semibold text-zinc-500">sem limite</span>.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
