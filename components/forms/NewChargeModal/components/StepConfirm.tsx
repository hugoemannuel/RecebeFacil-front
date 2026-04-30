'use client';

import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import type { ChargeFormData } from '../interfaces';

export function StepConfirm({ hasPixKey }: { hasPixKey: boolean }) {
  const { watch } = useFormContext<ChargeFormData>();
  const values = watch();

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">Revise e confirme o envio</p>
      <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-5 space-y-3 border border-transparent dark:border-white/6">
        {[
          { label: 'Para', value: `${values.debtor_name} • ${values.debtor_phone}` },
          { label: 'Valor', value: values.amount_display },
          { label: 'Vencimento', value: values.due_date ? format(values.due_date, 'dd/MM/yyyy') : '-' },
          { label: 'Descrição', value: values.description },
          { label: 'Recorrência', value: { ONCE: 'Única', WEEKLY: 'Semanal', MONTHLY: 'Mensal', YEARLY: 'Anual' }[values.recurrence as string] || values.recurrence },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-4">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 pt-0.5">{label}</span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 text-right">{value}</span>
          </div>
        ))}
        {values.send_pix_button && !hasPixKey && values.pix_key && (
          <div className="flex items-start justify-between gap-4 border-t border-zinc-200 dark:border-white/7 pt-3 mt-1">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 pt-0.5">Pagamento para</span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 text-right">{values.pix_key_type}: {values.pix_key}</span>
          </div>
        )}
      </div>
      <div className="bg-[#e5ddd5] rounded-2xl p-4 space-y-1.5 text-[11px] text-zinc-600">
        <p className="font-bold text-zinc-700">📱 Mensagens que serão enviadas:</p>
        <p className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Mensagem de texto personalizada</p>
        {values.send_pix_button && <p className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Botão e código de pagamento PIX</p>}
      </div>
      <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 border border-amber-100">
        <p className="font-bold mb-0.5">⚡ Envio imediato</p>
        <p>A mensagem será disparada assim que você confirmar.</p>
      </div>
    </div>
  );
}

