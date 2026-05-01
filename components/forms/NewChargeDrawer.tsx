'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-day-picker/style.css';

import { WhatsAppPreview } from '@/components/ui/WhatsAppPreview';
import { createChargeAction } from '@/app/actions/charges';
import {
  maskMoney, parseMoney, maskPhone, formatDate, interpolateTemplate,
} from '@/lib/formatters';
import { MessageTemplate } from '@/services/templates';
import { getTemplatesAction } from '@/app/actions/templates';
import {
  IconX, IconUser, IconPhone, IconDollarSign, IconCalendar,
  IconRepeat, IconSparkles, IconSend, IconChevronRight, IconLock
} from '@/components/ui/Icons';
import { RHFTextarea } from './rhf/RHFTextarea';
import { RHFInput } from './rhf/RHFInput';
import { RHFSelect } from './rhf/RHFSelect';
import { DatePickerField } from '../patterns/DatePickerField/DatePickerField';
import { Select } from '../ui/Select/Select';
import { Chip } from '../ui/Chip';
import { UpgradeModal } from '@/components/ui/UpgradeModal';

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
  save_as_template: z.boolean().default(false),
  template_name: z.string().optional(),
}).refine((data) => {
  if (data.save_as_template && !data.template_name) return false;
  return true;
}, {
  message: "Nome do template é obrigatório para salvar",
  path: ["template_name"],
});

export type ChargeFormData = z.infer<typeof baseSchema>;

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
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [upgradeModule, setUpgradeModule] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    resolver: zodResolver(schema) as any,
    defaultValues: {
      debtor_name: '', debtor_phone: '', amount_display: '',
      description: '', recurrence: 'ONCE',
      custom_message: '',
      send_pix_button: true,
      pix_key: '', pix_key_type: 'CPF',
      save_as_template: false,
      template_name: '',
    },
  });

  const { watch, setValue, handleSubmit, reset } = form;
  const values = watch();

  useEffect(() => {
    if (open) {
      setLoadingTemplates(true);
      getTemplatesAction()
        .then((res) => {
          if (res.success) {
            const data = res.data;
            setTemplates(data);
            const defaultTmpl = data.find((t: any) => t.is_default) || data[0];
            if (defaultTmpl && !form.getValues('custom_message')) {
              setValue('custom_message', defaultTmpl.body);
            }
          } else {
            toast.error(res.error || 'Erro ao carregar templates');
          }
        })
        .finally(() => setLoadingTemplates(false));
    }
  }, [open, setValue, form]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() { reset(); setStep(0); setShowCalendar(false); onClose(); }

  const previewMessage = interpolateTemplate(values.custom_message || '', {
    nome: values.debtor_name || 'Cliente',
    valor: values.amount_display || 'R$ 0,00',
    vencimento: values.due_date ? formatDate(values.due_date) : '--/--/----',
    descricao: values.description || '',
    nome_empresa: userName,
  });

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

  async function onSubmit(data: any) {
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
        save_as_template: data.save_as_template,
        template_name: data.template_name,
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
    const fieldsPerStep: (keyof ChargeFormData)[][] = [
      ['debtor_name', 'debtor_phone'],
      ['amount_display', 'due_date', 'description'],
      ['custom_message', 'pix_key', 'pix_key_type'],
    ];
    form.trigger(fieldsPerStep[step] as any).then((ok) => { if (ok) setStep((s) => s + 1); });
  }

  if (!open) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
      />

      <div className={`fixed top-0 right-0 h-full z-50 flex transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: '100%', maxWidth: step === 2 ? '1000px' : '520px' }}>

        <div className="flex-1 bg-surface dark:bg-surface flex flex-col shadow-2xl overflow-hidden transition-colors duration-300">

          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200/80 dark:border-white/7 shrink-0">
            <div>
              <h2 className="text-xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight">Nova Cobrança</h2>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Etapa {step + 1} de {STEPS.length} • {STEPS[step]}</p>
            </div>
            <button onClick={handleClose} className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors">
              <IconX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-1.5 px-6 pt-4 shrink-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${i <= step ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-zinc-200 dark:bg-white/10'}`} />
              </div>
            ))}
          </div>

          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                  {step === 0 && <StepDebtor />}
                  {step === 1 && <StepChargeDetails planType={planType} onUpgrade={setUpgradeModule} />}
                  {step === 2 && (
                    <StepMessage
                      hasPixKey={hasPixKey}
                      textareaRef={textareaRef}
                      insertVariable={insertVariable}
                      templates={templates}
                      loadingTemplates={loadingTemplates}
                      planType={planType}
                      onUpgrade={setUpgradeModule}
                    />
                  )}
                  {step === 3 && <StepConfirm hasPixKey={hasPixKey} />}
                </div>

                {step === 2 && (
                  <div className="w-full md:w-[420px] border-t md:border-t-0 md:border-l border-zinc-100 dark:border-white/7 flex flex-col bg-zinc-50 dark:bg-background shrink-0">
                    <div className="px-5 py-4 border-b border-zinc-100 dark:border-white/7">
                      <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <IconSparkles className="w-3.5 h-3.5 text-green-500" /> Preview ao vivo
                      </p>
                    </div>
                    <div className="flex-1 p-6 overflow-hidden">
                      <div className="h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-zinc-200 dark:border-white/10">
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

              <div className="px-6 py-5 border-t border-zinc-100 dark:border-white/7 flex gap-3 shrink-0 bg-white dark:bg-surface">
                {step > 0 && (
                  <button type="button" onClick={() => setStep((s) => s - 1)}
                    className="flex-1 border border-zinc-200 dark:border-white/8 text-zinc-600 dark:text-zinc-300 font-bold py-3.5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-sm">
                    Voltar
                  </button>
                )}

                {step < 3 ? (
                  <button type="button" onClick={nextStep}
                    className="flex-1 bg-zinc-900 dark:bg-green-500 hover:bg-zinc-800 dark:hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10 dark:shadow-green-500/10 active:scale-[0.98]">
                    Próximo <IconChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleSubmit(onSubmit)} disabled={sending}
                    className="flex-1 bg-green-500 hover:bg-green-600 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 text-white font-bold py-3.5 rounded-2xl transition-all text-sm flex items-center justify-center gap-2 shadow-xl shadow-green-500/20 active:scale-[0.98]">
                    {sending ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enviando...</>
                    ) : (
                      <><IconSend className="w-4 h-4" /> Enviar via WhatsApp</>
                    )}
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      {upgradeModule && (
        <UpgradeModal
          moduleName={upgradeModule}
          onClose={() => setUpgradeModule(null)}
        />
      )}
    </>
  );
}

function StepDebtor() {
  const { control } = useFormContext<ChargeFormData>();

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-1">Dados do Cliente</h3>
      <p className="text-sm text-zinc-500 mb-6">Quem vai receber a cobrança?</p>
      
      <div className="space-y-4">
        <RHFInput
          name="debtor_name"
          control={control}
          label="Nome completo ou Razão Social"
          placeholder="Ex: João Silva"
          icon={<IconUser />}
        />
        <RHFInput
          name="debtor_phone"
          control={control}
          label="Número do WhatsApp"
          placeholder="(11) 99999-9999"
          icon={<IconPhone />}
          mask={maskPhone}
        />
      </div>
    </div>
  );
}

function StepChargeDetails({ planType, onUpgrade }: { 
  planType: string,
  onUpgrade?: (mod: string) => void
}) {
  const { control, watch, setValue } = useFormContext<ChargeFormData>();
  const values = watch();

  const allowedRecurrences = ({
    FREE: ['ONCE'],
    STARTER: ['ONCE', 'WEEKLY'],
    PRO: ['ONCE', 'WEEKLY', 'MONTHLY', 'YEARLY'],
    UNLIMITED: ['ONCE', 'WEEKLY', 'MONTHLY', 'YEARLY'],
  } as Record<string, string[]>)[planType as any] || ['ONCE'];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-1">Valores e Prazos</h3>
      <p className="text-sm text-zinc-500 mb-6">Defina o valor e quando vence.</p>

      <div className="space-y-5">
        <RHFInput
          name="amount_display"
          control={control}
          label="Valor da cobrança"
          placeholder="R$ 0,00"
          icon={<IconDollarSign />}
          mask={maskMoney}
        />

        <DatePickerField
          name="due_date"
          control={control}
          label="Data de Vencimento"
          icon={<IconCalendar />}
          disabled={{ before: new Date() }}
        />

        <RHFTextarea
          name="description"
          control={control}
          label="Descrição do serviço/produto"
          rows={2}
          placeholder="Ex: Consultoria de Marketing — Março"
        />

        <div>
          <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-2.5">Recorrência</label>
          <div className="grid grid-cols-2 gap-2">
            {(['ONCE', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const).map((r) => {
              const labels = { ONCE: 'Única', WEEKLY: 'Semanal', MONTHLY: 'Mensal', YEARLY: 'Anual' };
              const isAllowed = allowedRecurrences.includes(r);

              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    if (isAllowed) setValue('recurrence', r);
                    else onUpgrade?.('RECURRENCE');
                  }}
                  className={`relative flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-sm font-bold transition-all ${!isAllowed ? 'opacity-60 bg-zinc-50 dark:bg-white/2 border-zinc-200 dark:border-white/5 text-zinc-400' : values.recurrence === r ? 'bg-green-50 dark:bg-green-500/10 border-green-400 text-green-700 dark:text-green-400 shadow-sm' : 'border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/2'}`}>
                  <IconRepeat className="w-4 h-4" />
                  {labels[r]}
                  {!isAllowed && <IconLock className="w-3 h-3 ml-auto text-zinc-300" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepMessage({
  hasPixKey,
  textareaRef,
  insertVariable,
  templates,
  loadingTemplates,
  planType,
  onUpgrade
}: {
  hasPixKey: boolean,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  insertVariable: (v: string) => void,
  templates: MessageTemplate[],
  loadingTemplates: boolean,
  planType?: string,
  onUpgrade?: (mod: string) => void
}) {
  const { control, watch, setValue } = useFormContext<ChargeFormData>();
  const values = watch();

  const templateOptions = templates.map(t => ({
    label: t.name,
    value: t.body,
    is_system: t.is_system
  }));

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-1">Mensagem de Cobrança</h3>
      <p className="text-sm text-zinc-500 mb-6">Como o cliente receberá no WhatsApp.</p>

      <div className="space-y-6">
        <div className="relative">
          <Select
            label="Escolher um Template"
            value={values.custom_message}
            onChange={(value) => setValue("custom_message", value, { shouldValidate: true })}
            options={templateOptions}
            disabled={loadingTemplates}
          />
          {loadingTemplates && (
            <div className="absolute right-3 top-[38px]">
              <div className="w-4 h-4 border-2 border-zinc-200 border-t-green-500 rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div>
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2.5">Variáveis Dinâmicas</p>
          <div className="flex flex-wrap gap-1.5">
            {VARIABLES.map((v) => (
              <Chip key={v} label={v} onClick={() => insertVariable(v)} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Editor de Mensagem</label>
            <div className="flex gap-1.5 bg-zinc-100 dark:bg-white/5 p-1 rounded-lg">
              <button type="button" onClick={() => insertVariable('*')} className="w-6 h-6 flex items-center justify-center font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 rounded hover:bg-white dark:hover:bg-white/10 transition-colors text-xs" title="Negrito">B</button>
              <button type="button" onClick={() => insertVariable('_')} className="w-6 h-6 flex items-center justify-center italic font-serif text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 rounded hover:bg-white dark:hover:bg-white/10 transition-colors text-xs" title="Itálico">I</button>
              <div className="w-px h-3 bg-zinc-200 dark:bg-white/10 my-auto mx-0.5" />
              {['💰', '📅', '✅', '⚠️'].map(emoji => (
                <button key={emoji} type="button" onClick={() => insertVariable(emoji)} className="w-6 h-6 flex items-center justify-center hover:bg-white dark:hover:bg-white/10 rounded transition-colors text-xs">{emoji}</button>
              ))}
            </div>
          </div>
          <RHFTextarea
            name="custom_message"
            control={control}
            inputRef={textareaRef}
            rows={8}
            className="font-mono text-sm"
          />
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              if (planType === 'FREE') {
                onUpgrade?.('CUSTOM_TEMPLATES');
              } else {
                setValue('save_as_template', !values.save_as_template);
              }
            }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${values.save_as_template ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30' : 'border-zinc-200 dark:border-white/10 bg-white dark:bg-surface hover:border-zinc-300 dark:hover:border-white/20'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${values.save_as_template ? 'bg-amber-100 text-amber-600' : 'bg-zinc-100 text-zinc-400 dark:bg-white/5'}`}>
              <IconSparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-bold ${values.save_as_template ? 'text-amber-800 dark:text-amber-400' : 'text-zinc-600 dark:text-zinc-300'}`}>Salvar como novo template</p>
                {planType === 'FREE' && <IconLock className="w-3 h-3 text-zinc-400" />}
              </div>
              <p className="text-[11px] text-zinc-500">Reutilize esta mensagem em cobranças futuras</p>
            </div>
            <div className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${values.save_as_template ? 'bg-amber-500' : 'bg-zinc-200 dark:bg-white/10'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${values.save_as_template ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </button>

          {values.save_as_template && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <RHFInput
                name="template_name"
                control={control}
                label="Nome do template"
                placeholder="Ex: Cobrança de Varejo"
              />
            </div>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <button type="button" onClick={() => setValue('send_pix_button', !values.send_pix_button)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${values.send_pix_button ? 'bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/30' : 'border-zinc-200 dark:border-white/10 bg-white dark:bg-surface hover:border-zinc-300 dark:hover:border-white/20'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${values.send_pix_button ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-400 dark:bg-white/5'}`}>
              <IconDollarSign className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-bold ${values.send_pix_button ? 'text-green-800 dark:text-green-400' : 'text-zinc-600 dark:text-zinc-300'}`}>Incluir Pagamento via PIX</p>
              <p className="text-[11px] text-zinc-500">Adiciona o código Copia e Cola automaticamente</p>
            </div>
            <div className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${values.send_pix_button ? 'bg-green-500' : 'bg-zinc-200 dark:bg-white/10'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${values.send_pix_button ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </button>

          {values.send_pix_button && !hasPixKey && (
            <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/7 p-5 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-2.5">
                <IconSparkles className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">Você ainda não configurou uma chave PIX global. Informe abaixo para onde este valor deve ser enviado:</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <RHFSelect
                    name="pix_key_type"
                    control={control}
                    label="Tipo"
                    options={[
                      { label: 'CPF', value: 'CPF' },
                      { label: 'CNPJ', value: 'CNPJ' },
                      { label: 'WhatsApp', value: 'PHONE' },
                      { label: 'E-mail', value: 'EMAIL' },
                      { label: 'Chave Aleat.', value: 'EVP' },
                    ]}
                  />
                </div>
                <div className="col-span-2">
                  <RHFInput
                    name="pix_key"
                    control={control}
                    label="Chave PIX"
                    placeholder="Sua chave aqui"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepConfirm({ hasPixKey }: { hasPixKey: boolean }) {
  const { watch } = useFormContext<ChargeFormData>();
  const values = watch();

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-1">Confirmar Envio</h3>
      <p className="text-sm text-zinc-500 mb-6">Confira os detalhes antes de disparar.</p>

      <div className="bg-zinc-50 dark:bg-white/5 rounded-4xl p-6 space-y-4 border border-zinc-100 dark:border-white/5 shadow-inner">
        {[
          { label: 'Cliente', value: values.debtor_name },
          { label: 'WhatsApp', value: values.debtor_phone },
          { label: 'Valor Total', value: values.amount_display, highlight: true },
          { label: 'Vencimento', value: values.due_date ? format(values.due_date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : '-' },
          { label: 'Frequência', value: { ONCE: 'Única', WEEKLY: 'Semanal', MONTHLY: 'Mensal', YEARLY: 'Anual' }[values.recurrence as string] || values.recurrence },
        ].map(({ label, value, highlight }) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{label}</span>
            <span className={`text-sm font-bold ${highlight ? 'text-green-600 dark:text-green-400 text-base' : 'text-zinc-800 dark:text-zinc-200'}`}>{value}</span>
          </div>
        ))}
        
        {values.send_pix_button && (
          <div className="pt-4 border-t border-zinc-200 dark:border-white/10">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Recebimento</span>
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <IconDollarSign className="w-3 h-3" /> Pix Ativo
                </span>
             </div>
          </div>
        )}
      </div>

      <div className="bg-green-500/10 rounded-2xl p-4 flex gap-3 border border-green-500/20">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
          <IconSend className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-green-700 dark:text-green-400">Disparo Imediato</p>
          <p className="text-xs text-green-600/80">O cliente receberá a notificação em instantes após a confirmação.</p>
        </div>
      </div>
    </div>
  );
}
