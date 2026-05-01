'use client';

import { useState, useRef, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { WhatsAppPreview } from '@/components/ui/WhatsAppPreview';
import { Chip } from '@/components/ui/Chip';
import { RHFInput } from '@/components/forms/rhf/RHFInput';
import { RHFSelect } from '@/components/forms/rhf/RHFSelect';
import { RHFTextarea } from '@/components/forms/rhf/RHFTextarea';
import { IconBot, IconX, IconCheck } from '@/components/ui/Icons';
import { interpolateTemplate, formatMoney } from '@/lib/formatters';
import { updateRecurringAction, getRecurringChargeAction } from '@/app/actions/charges';
import { DEFAULT_TEMPLATE, TEMPLATE_OPTIONS, VARIABLES } from '@/components/forms/NewChargeModal/interfaces';

const schema = z.object({
  frequency: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY']),
  description: z.string().min(1, 'Informe uma descrição'),
  next_generation_date: z.string().min(1, 'Informe a data do próximo envio'),
  custom_message: z.string().min(5, 'Mensagem muito curta'),
});

type FormData = z.infer<typeof schema>;

interface AutomacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  recurringChargeId: string;
  onSuccess?: () => void;
}

const FREQUENCY_OPTIONS = [
  { label: 'Semanal', value: 'WEEKLY' },
  { label: 'Mensal', value: 'MONTHLY' },
  { label: 'Anual', value: 'YEARLY' },
];

const toDateInput = (iso: string) => {
  try { return new Date(iso).toISOString().split('T')[0]; } catch { return ''; }
};

export function AutomacaoModal({ isOpen, onClose, recurringChargeId, onSuccess }: AutomacaoModalProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [debtorName, setDebtorName] = useState('Cliente');
  const [amount, setAmount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { handleSubmit, watch, setValue, control, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      frequency: 'MONTHLY',
      description: '',
      next_generation_date: '',
      custom_message: DEFAULT_TEMPLATE,
    },
  });

  const values = watch();

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setServerError(null);

    getRecurringChargeAction(recurringChargeId).then((res) => {
      if (res.success && res.data) {
        const d = res.data;
        reset({
          frequency: d.frequency,
          description: d.description,
          next_generation_date: d.nextGenerationDate ? toDateInput(d.nextGenerationDate) : '',
          custom_message: d.custom_message ?? DEFAULT_TEMPLATE,
        });
        setDebtorName(d.debtorName ?? 'Cliente');
        setAmount(d.amount ?? 0);
      } else {
        toast.error('Não foi possível carregar a automação.');
        onClose();
      }
      setLoading(false);
    });
  }, [isOpen, recurringChargeId]);

  const valor = amount ? formatMoney(amount) : 'R$ 0,00';
  const nextDate = values.next_generation_date
    ? new Date(values.next_generation_date + 'T00:00:00').toLocaleDateString('pt-BR')
    : '--/--/----';

  const previewMessage = interpolateTemplate(values.custom_message || '', {
    nome: debtorName,
    valor,
    vencimento: nextDate,
    descricao: values.description,
    nome_empresa: 'RecebeFácil',
  });

  function insertVariable(variable: string) {
    const el = textareaRef.current;
    if (!el) {
      setValue('custom_message', (values.custom_message || '') + variable, { shouldValidate: true });
      return;
    }
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const current = values.custom_message || '';
    const newValue = current.slice(0, start) + variable + current.slice(end);
    setValue('custom_message', newValue, { shouldValidate: true });
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  }

  if (!isOpen) return null;

  function onSubmit(data: FormData) {
    setServerError(null);
    startTransition(async () => {
      const res = await updateRecurringAction(recurringChargeId, data);
      if (res.success) {
        toast.success('Automação atualizada com sucesso!');
        onSuccess?.();
        onClose();
      } else {
        setServerError(res.error ?? 'Erro ao salvar. Tente novamente.');
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-surface rounded-3xl shadow-2xl border border-zinc-100 dark:border-white/6 animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-white/6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-500/20 rounded-xl flex items-center justify-center">
              <IconBot className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-zinc-800 dark:text-zinc-100">Configurar Automação</h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {debtorName !== 'Cliente' ? `${debtorName} • ` : ''}
                {FREQUENCY_OPTIONS.find(f => f.value === values.frequency)?.label ?? values.frequency}
                {amount ? ` • ${valor}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="flex-1 p-6 space-y-4 animate-pulse">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-zinc-100 dark:bg-white/5 rounded-xl" />
              <div className="h-12 bg-zinc-100 dark:bg-white/5 rounded-xl" />
            </div>
            <div className="h-12 bg-zinc-100 dark:bg-white/5 rounded-xl" />
            <div className="h-40 bg-zinc-100 dark:bg-white/5 rounded-xl" />
          </div>
        ) : (
          <>
            {/* Body */}
            <div className="flex flex-1 overflow-hidden min-h-0">
              {/* Left — form */}
              <div className="flex-1 p-6 space-y-5 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <RHFSelect
                    name="frequency"
                    control={control}
                    label="Frequência"
                    options={FREQUENCY_OPTIONS}
                  />
                  <RHFInput
                    name="next_generation_date"
                    control={control}
                    label="Próximo envio"
                    type="date"
                  />
                </div>

                <RHFInput
                  name="description"
                  control={control}
                  label="Descrição da cobrança"
                  placeholder="Ex: Mensalidade academia"
                />

                {/* Template selector */}
                <div>
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1.5">
                    Template base
                  </label>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) setValue('custom_message', e.target.value, { shouldValidate: true });
                    }}
                    className="w-full px-4 py-2.5 border border-zinc-200/80 dark:border-white/7 bg-white dark:bg-surface-soft text-zinc-700 dark:text-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all"
                  >
                    <option value="">Selecionar template...</option>
                    {TEMPLATE_OPTIONS.map(t => (
                      <option key={t.label} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Variable chips */}
                <div>
                  <p className="text-xs text-zinc-400 mb-2">Clique para inserir no cursor:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {VARIABLES.map(v => <Chip key={v} label={v} onClick={() => insertVariable(v)} />)}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Mensagem</label>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => insertVariable('*')} className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 px-1.5 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-white/10">N</button>
                      <button type="button" onClick={() => insertVariable('_')} className="text-xs italic font-serif text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 px-1.5 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-white/10">I</button>
                      <div className="w-px h-3.5 bg-zinc-200 dark:bg-white/10 my-auto mx-1" />
                      {['💰', '📅', '✅', '⚠️'].map(emoji => (
                        <button key={emoji} type="button" onClick={() => insertVariable(emoji)} className="text-xs px-1 hover:bg-zinc-100 dark:hover:bg-white/10 rounded">{emoji}</button>
                      ))}
                    </div>
                  </div>
                  <RHFTextarea
                    name="custom_message"
                    control={control}
                    inputRef={textareaRef}
                    rows={9}
                    placeholder="Olá {{nome}}, sua cobrança de {{valor}} vence em {{vencimento}}..."
                  />
                </div>

                {serverError && (
                  <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-2.5">{serverError}</p>
                )}
              </div>

              {/* Right — WhatsApp preview (desktop only) */}
              <div className="hidden md:flex w-80 flex-col border-l border-zinc-100 dark:border-white/6 bg-zinc-50/50 dark:bg-white/[0.02] p-5">
                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Pré-visualização</p>
                <div className="flex-1 rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 min-h-0">
                  <WhatsAppPreview
                    senderName="RecebeFácil"
                    message={previewMessage}
                    showQrCode={false}
                    showPixButton={false}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-zinc-100 dark:border-white/6 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 font-bold text-sm hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20"
              >
                {isPending
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <IconCheck className="w-4 h-4" />}
                Salvar automação
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
