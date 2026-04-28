'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

import { WhatsAppPreview } from '@/components/ui/WhatsAppPreview';
import { createChargeAction } from '@/app/actions/charges';
import {
  maskMoney, parseMoney, maskPhone, formatDate, interpolateTemplate,
} from '@/lib/formatters';
import {
  IconX, IconUser, IconPhone, IconDollarSign, IconCalendar,
  IconRepeat, IconSparkles, IconSend, IconChevronRight,
} from '@/components/ui/Icons';
import { FormField } from './FormField/FormField';
import { RHFTextarea } from './rhf/RHFTextarea';
import { RHFInput } from './rhf/RHFInput';
import { DatePickerField } from '../patterns/DatePickerField/DatePickerField';
import { Select } from '../ui/Select/Select';
import { Chip } from '../ui/Chip';

const DEFAULT_TEMPLATE = `Olá *{{nome}}*! 👋

Passando para lembrar da sua cobrança:

💰 Valor: *{{valor}}*
📅 Vencimento: *{{vencimento}}*
📝 Referência: {{descricao}}

Para pagar via PIX, clique no botão abaixo! ✅`;

const TEMPLATE_OPTIONS = [
  { label: 'Cobrança Inicial', value: DEFAULT_TEMPLATE },
  { label: 'Lembrete Amigável', value: `Oi *{{nome}}*! 😊\n\nSua cobrança de *{{valor}}* vence em *{{vencimento}}*.\n\nPague via PIX rapidinho! 💳` },
  { label: 'Urgente', value: `⚠️ *{{nome}}*, sua cobrança de *{{valor}}* vence *hoje*!\n\nEvite atrasos — pague agora via PIX.` },
];

const VARIABLES = ['{{nome}}', '{{valor}}', '{{vencimento}}', '{{descricao}}', '{{nome_empresa}}'];

const STEPS = ['Devedor', 'Cobrança', 'Mensagem', 'Confirmar'];

const baseSchema = z.object({
  debtor_name: z.string().min(2, 'Nome obrigatório'),
  debtor_phone: z.string().min(10, 'Telefone obrigatório'),
  amount_display: z.string().min(1, 'Valor obrigatório').refine((val) => parseMoney(val) >= 100, { message: 'Valor mínimo R$ 1,00' }),
  due_date: z.date({ error: 'Data obrigatória' }).refine((val) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return val >= today;
  }, { message: 'A data deve ser futura ou hoje' }),
  description: z.string().min(3, 'Descrição obrigatória').max(200),
  recurrence: z.enum(['ONCE', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  custom_message: z.string().min(5, 'Mensagem obrigatória'),
  send_pix_button: z.boolean(),
  pix_key: z.string().optional(),
  pix_key_type: z.enum(['CPF', 'CNPJ', 'PHONE', 'EMAIL', 'EVP']).optional(),
});

export type ChargeFormData = z.infer<typeof baseSchema>;

// ── Component ────────────────────────────────────────────────────────────────
interface Props {
  open: boolean;
  onClose: () => void;
  userName?: string;
  hasPixKey?: boolean;
  planType?: 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED';
  onSuccess?: () => void;
}

export function NewChargeDrawer({ open, onClose, userName = 'Minha Empresa', hasPixKey = false, planType = 'FREE', onSuccess }: Props) {
  const [step, setStep] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Schema gerado dinamicamente para validar os campos de PIX apenas se necessário
  const schema = baseSchema.superRefine((data, ctx) => {
    if (data.send_pix_button && !hasPixKey) {
      if (!data.pix_key || data.pix_key.length < 5) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "A chave PIX é obrigatória", path: ["pix_key"] });
      }
      if (!data.pix_key_type) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Tipo da chave é obrigatório", path: ["pix_key_type"] });
      }
    }
  });

  const form = useForm<ChargeFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      debtor_name: '', debtor_phone: '', amount_display: '',
      description: '', recurrence: 'ONCE',
      custom_message: DEFAULT_TEMPLATE,
      send_pix_button: true,
      pix_key: '', pix_key_type: 'CPF',
    },
  });

  const { register, watch, setValue, handleSubmit, reset, formState: { errors } } = form;
  const values = watch();

  // Fecha com ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  function handleClose() { reset(); setStep(0); setShowCalendar(false); onClose(); }

  // Interpolação ao vivo
  const previewMessage = interpolateTemplate(values.custom_message || '', {
    nome: values.debtor_name || 'Cliente',
    valor: values.amount_display || 'R$ 0,00',
    vencimento: values.due_date ? formatDate(values.due_date) : '--/--/----',
    descricao: values.description || '',
    nome_empresa: userName,
  });

  // Inserir variável no cursor do textarea
  function insertVariable(variable: string) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const current = values.custom_message || '';
    const next = current.slice(0, start) + variable + current.slice(end);
    setValue('custom_message', next);
    setTimeout(() => { el.selectionStart = el.selectionEnd = start + variable.length; el.focus(); }, 0);
  }

  async function onSubmit(data: ChargeFormData) {
    setSending(true);
    try {
      const result = await createChargeAction({
        debtor_name: data.debtor_name,
        debtor_phone: data.debtor_phone.replace(/\D/g, ''),
        amount: parseMoney(data.amount_display),
        due_date: data.due_date.toISOString(),
        description: data.description,
        recurrence: data.recurrence,
        custom_message: data.custom_message,
        send_pix_button: data.send_pix_button,
        pix_key: data.send_pix_button && !hasPixKey ? data.pix_key : undefined,
        pix_key_type: data.send_pix_button && !hasPixKey ? data.pix_key_type : undefined,
      });
      if (result.success) {
        toast.success('Cobrança enviada via WhatsApp! ✅');
        handleClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error ?? 'Erro ao enviar. Tente novamente.');
      }
    } finally {
      setSending(false);
    }
  }

  function nextStep() {
    // Validação por step antes de avançar
    const fieldsPerStep: (keyof ChargeFormData)[][] = [
      ['debtor_name', 'debtor_phone'],
      ['amount_display', 'due_date', 'description'],
      ['custom_message', 'pix_key', 'pix_key_type'],
    ];
    form.trigger(fieldsPerStep[step] as any).then((ok) => { if (ok) setStep((s) => s + 1); });
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full z-50 flex transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: '100%', maxWidth: step === 2 ? '900px' : '480px' }}>

        <div className="flex-1 bg-[#f8fafc] dark:bg-[#152336] flex flex-col shadow-2xl overflow-hidden transition-colors duration-300">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200/80 dark:border-white/[0.07] shrink-0">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-800 dark:text-zinc-100 tracking-tight">Nova Cobrança</h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Etapa {step + 1} de {STEPS.length}</p>
            </div>
            <button onClick={handleClose} className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors">
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1 px-6 pt-4 shrink-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center gap-1">
                <div className={`h-1.5 w-full rounded-full transition-all duration-300 ${i <= step ? 'bg-green-500' : 'bg-zinc-200 dark:bg-white/10'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${i === step ? 'text-green-600 dark:text-green-400' : 'text-zinc-300 dark:text-zinc-600'}`}>{s}</span>
              </div>
            ))}
          </div>

          {/* Body */}
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex">

              {/* ── Step content + preview ── */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                {/* Steps */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

                  {/* STEP 0 — Devedor */}
                  {step === 0 && <StepDebtor />}

                  {/* STEP 1 — Cobrança */}
                  {step === 1 && (
                    <StepChargeDetails
                      showCalendar={showCalendar}
                      setShowCalendar={setShowCalendar}
                      planType={planType}
                    />
                  )}

                  {/* STEP 2 — Mensagem WhatsApp */}
                  {step === 2 && (
                    <StepMessage
                      hasPixKey={hasPixKey}
                      textareaRef={textareaRef}
                      insertVariable={insertVariable}
                    />
                  )}

                  {/* STEP 3 — Confirmar */}
                  {step === 3 && <StepConfirm hasPixKey={hasPixKey} />}
                </div>

                {/* Preview WhatsApp — só no step 2 */}
                {step === 2 && (
                  <div className="w-full md:w-[380px] border-t md:border-t-0 md:border-l border-zinc-100 dark:border-white/[0.07] flex flex-col bg-zinc-50 dark:bg-[#0b1521] shrink-0">
                    <div className="px-5 py-4 border-b border-zinc-100 dark:border-white/[0.07]">
                      <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <IconSparkles className="w-3.5 h-3.5 text-green-500" /> Preview ao vivo
                      </p>
                    </div>
                    <div className="flex-1 p-4 overflow-hidden">
                      <div className="h-full rounded-2xl overflow-hidden shadow-md">
                        <WhatsAppPreview
                          senderName={userName}
                          message={previewMessage}
                          showQrCode={false}
                          showPixButton={values.send_pix_button}
                          amount={values.amount_display}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </FormProvider>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-zinc-100 dark:border-white/[0.07] flex gap-3 shrink-0">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)}
                className="flex-1 border border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300 font-bold py-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-sm">
                Voltar
              </button>
            )}

            {step < 3 ? (
              <button type="button" onClick={nextStep}
                className="flex-1 bg-[#0b1521] hover:bg-[#152336] text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                Próximo <IconChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit(onSubmit)} disabled={sending}
                className="flex-1 bg-green-500 hover:bg-green-600 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
                {sending ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enviando...</>
                ) : (
                  <><IconSend className="w-4 h-4" /> Enviar via WhatsApp</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Sub-componentes dos Steps ───────────────────────────────────────────────

function StepDebtor() {
  const { control, watch, setValue, formState: { errors } } = useFormContext<ChargeFormData>();
  const values = watch();

  return (
    <>
      <p className="text-sm text-zinc-500">Quem vai receber a cobrança?</p>
      <div className="space-y-4">
        <RHFInput
          name="debtor_name"
          control={control}
          label="Nome"
          placeholder="Ex: João Silva"
          icon={<IconUser />}
        />
        <RHFInput
          name="debtor_phone"
          control={control}
          label="WhatsApp"
          placeholder="(11) 99999-9999"
          icon={<IconPhone />}
          mask={maskPhone}
        />
      </div>
    </>
  );
}

function StepChargeDetails({ showCalendar, setShowCalendar, planType }: { showCalendar: boolean, setShowCalendar: (v: boolean) => void, planType: 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED' }) {
  const { control, watch, setValue, formState: { errors } } = useFormContext<ChargeFormData>();
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
        <RHFInput
          name="amount_display"
          control={control}
          label="Valor"
          placeholder="R$ 0,00"
          icon={<IconDollarSign />}
          mask={maskMoney}
        />

        <DatePickerField
          name="due_date"
          control={control}
          label="Vencimento"
          icon={<IconCalendar />}
          disabled={{ before: new Date() }}
        />

        <FormField
          label="Descrição"
          error={errors.description?.message}
        >
          <RHFTextarea
            name="description"
            control={control}
            rows={2}
            placeholder="Ex: Corte de cabelo — Abril/2026"
          />
        </FormField>

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
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all overflow-hidden ${!isAllowed ? 'opacity-50 cursor-not-allowed bg-zinc-50 border-zinc-200 text-zinc-400' : values.recurrence === r ? 'bg-green-50 border-green-400 text-green-700' : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'}`}>
                  <IconRepeat className="w-3.5 h-3.5" />
                  {labels[r]}
                  {!isAllowed && <span className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[8px] uppercase px-1.5 py-0.5 rounded-bl-lg font-extrabold">Pro</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function StepMessage({ hasPixKey, textareaRef, insertVariable }: { hasPixKey: boolean, textareaRef: React.RefObject<HTMLTextAreaElement | null>, insertVariable: (v: string) => void }) {
  const { control, watch, setValue, formState: { errors } } = useFormContext<ChargeFormData>();
  const values = watch();

  return (
    <>
      <p className="text-sm text-zinc-500">Personalize a mensagem que será enviada</p>
      <div className="space-y-4">
        <Select
          label="Template base"
          value={values.custom_message}
          onChange={(value) =>
            setValue("custom_message", value, {
              shouldValidate: true,
            })
          }
          options={TEMPLATE_OPTIONS}
        />

        {/* Chips de variáveis */}
        <div>
          <p className="text-xs text-zinc-400 mb-2">
            Clique para inserir no cursor:
          </p>

          <div className="flex flex-wrap gap-1.5">
            {VARIABLES.map((v) => (
              <Chip
                key={v}
                label={v}
                onClick={() => insertVariable(v)}
              />
            ))}
          </div>
        </div>

        {/* Editor */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Mensagem</label>
            <div className="flex gap-1">
              <button type="button" onClick={() => insertVariable('*')} className="text-xs font-bold text-zinc-500 hover:text-zinc-800 px-1.5 py-0.5 rounded hover:bg-zinc-100">N</button>
              <button type="button" onClick={() => insertVariable('_')} className="text-xs italic font-serif text-zinc-500 hover:text-zinc-800 px-1.5 py-0.5 rounded hover:bg-zinc-100">I</button>
              <div className="w-px h-3.5 bg-zinc-200 my-auto mx-1"></div>
              {['💰', '📅', '✅', '⚠️'].map(emoji => (
                <button key={emoji} type="button" onClick={() => insertVariable(emoji)} className="text-xs px-1 hover:bg-zinc-100 rounded">{emoji}</button>
              ))}
            </div>
          </div>
          <Controller
            name="custom_message"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                ref={(e) => {
                  field.ref(e);
                  // @ts-ignore
                  textareaRef.current = e;
                }}
                rows={9}
                className="w-full px-4 py-3 border border-zinc-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0f1c2b] text-zinc-700 dark:text-zinc-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/60 dark:focus:border-green-500/40 transition-all resize-none leading-relaxed"
              />
            )}
          />
          {errors.custom_message && <p className="text-red-500 text-xs mt-1">{errors.custom_message.message}</p>}
        </div>

        {/* Toggles PIX Simples */}
        <div className="space-y-3 pt-2">
          <button type="button" onClick={() => setValue('send_pix_button', !values.send_pix_button)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${values.send_pix_button ? 'bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/30' : 'border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#0f1c2b] hover:border-zinc-300 dark:hover:border-white/[0.12]'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${values.send_pix_button ? 'bg-green-100' : 'bg-zinc-100'}`}>
              <IconDollarSign className={`w-4 h-4 ${values.send_pix_button ? 'text-green-600' : 'text-zinc-400'}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-bold ${values.send_pix_button ? 'text-green-800' : 'text-zinc-600'}`}>Incluir Pagamento via PIX</p>
              <p className="text-[11px] text-zinc-500">Gera um botão e linha digitável na mensagem</p>
            </div>
            <div className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${values.send_pix_button ? 'bg-green-500' : 'bg-zinc-200'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${values.send_pix_button ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* Campos de PIX Inline (se não tiver configurado globalmente) */}
          {values.send_pix_button && !hasPixKey && (
            <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.07] p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-2 mb-2">
                <IconSparkles className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Como você não possui uma chave salva, insira abaixo para onde o dinheiro deve ir nesta cobrança:</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Tipo</label>
                  <Controller
                    name="pix_key_type"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="w-full px-3 py-2 border border-zinc-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0f1c2b] text-zinc-700 dark:text-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30">
                        <option value="CPF">CPF</option>
                        <option value="CNPJ">CNPJ</option>
                        <option value="PHONE">Celular</option>
                        <option value="EMAIL">E-mail</option>
                        <option value="EVP">Aleatória</option>
                      </select>
                    )}
                  />
                  {errors.pix_key_type && <p className="text-red-500 text-[10px] mt-1">{errors.pix_key_type.message}</p>}
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Chave PIX</label>
                  <Controller
                    name="pix_key"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder="Ex: 123.456.789-00"
                        className="w-full px-3 py-2 border border-zinc-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0f1c2b] text-zinc-700 dark:text-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
                      />
                    )}
                  />
                  {errors.pix_key && <p className="text-red-500 text-[10px] mt-1">{errors.pix_key.message}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StepConfirm({ hasPixKey }: { hasPixKey: boolean }) {
  const { watch } = useFormContext<ChargeFormData>();
  const values = watch();

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">Revise e confirme o envio</p>
      <div className="bg-zinc-50 dark:bg-white/5 rounded-2xl p-5 space-y-3 border border-transparent dark:border-white/[0.06]">
        {[
          { label: 'Para', value: `${values.debtor_name} • ${values.debtor_phone}` },
          { label: 'Valor', value: values.amount_display },
          { label: 'Vencimento', value: values.due_date ? format(values.due_date, "dd/MM/yyyy") : '-' },
          { label: 'Descrição', value: values.description },
          { label: 'Recorrência', value: { ONCE: 'Única', WEEKLY: 'Semanal', MONTHLY: 'Mensal', YEARLY: 'Anual' }[values.recurrence as string] || values.recurrence },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-4">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 pt-0.5">{label}</span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 text-right">{value}</span>
          </div>
        ))}
        {values.send_pix_button && !hasPixKey && values.pix_key && (
          <div className="flex items-start justify-between gap-4 border-t border-zinc-200 dark:border-white/[0.07] pt-3 mt-1">
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
