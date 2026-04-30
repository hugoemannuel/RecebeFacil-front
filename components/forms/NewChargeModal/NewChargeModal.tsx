'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { maskPhone } from '@/lib/formatters';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { WhatsAppPreview } from '@/components/ui/WhatsAppPreview';
import { createChargeAction } from '@/app/actions/charges';
import { parseMoney, formatDate, interpolateTemplate } from '@/lib/formatters';
import { IconSparkles } from '@/components/ui/Icons';
import { baseSchema, STEPS, DEFAULT_TEMPLATE, type ChargeFormData, type NewChargeModalProps } from './interfaces';
import { ModalHeader } from './components/ModalHeader';
import { StepProgressBar } from './components/StepProgressBar';
import { StepDebtor } from './components/StepDebtor';
import { StepChargeDetails } from './components/StepChargeDetails';
import { StepMessage } from './components/StepMessage';
import { StepConfirm } from './components/StepConfirm';
import { ModalFooter } from './components/ModalFooter';

import { UpgradeModal } from '@/components/ui/UpgradeModal';

export function NewChargeModal({
  open,
  onClose,
  userName = 'Minha Empresa',
  hasPixKey = false,
  planType = 'FREE',
  onSuccess,
  prefilledDebtor,
  creditorProfile,
}: NewChargeModalProps) {
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [upgradeModule, setUpgradeModule] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const schema = baseSchema;

  const form = useForm<ChargeFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      debtor_name: '', debtor_phone: '', amount_display: '',
      description: '', recurrence: 'ONCE',
      custom_message: DEFAULT_TEMPLATE,
      send_pix_button: true,
      pix_key: creditorProfile?.pix_key || '', 
      pix_key_type: (creditorProfile?.pix_key_type as any) || 'CPF',
      save_as_template: false,
      template_name: '',
    },
  });

  const { watch, handleSubmit, reset } = form;
  const values = watch();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (open && prefilledDebtor) {
      reset({
        debtor_name: prefilledDebtor.name,
        debtor_phone: maskPhone(prefilledDebtor.phone.replace(/^55/, '')),
        amount_display: '', description: '', recurrence: 'ONCE',
        custom_message: DEFAULT_TEMPLATE, send_pix_button: true,
        pix_key: '', pix_key_type: 'CPF',
        save_as_template: false,
        template_name: '',
      });
      setStep(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, prefilledDebtor]);

  function handleClose() { reset(); setStep(0); onClose(); }

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
    form.setValue('custom_message', current.slice(0, start) + variable + current.slice(end));
    setTimeout(() => { el.selectionStart = el.selectionEnd = start + variable.length; el.focus(); }, 0);
  }

  function nextStep() {
    const fieldsPerStep: (keyof ChargeFormData)[][] = [
      ['debtor_name', 'debtor_phone'],
      ['amount_display', 'due_date', 'description'],
      ['custom_message', 'pix_key', 'pix_key_type', 'save_as_template', 'template_name' as any],
    ];
    form.trigger(fieldsPerStep[step] as (keyof ChargeFormData)[]).then((ok) => { if (ok) setStep((s) => s + 1); });
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

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
        onClick={handleClose}
      >
        <div
          className={`w-full ${step === 2 ? 'max-w-5xl' : 'max-w-3xl'} bg-zinc-50 dark:bg-surface-soft rounded-4xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-white/7`}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader step={step} totalSteps={STEPS.length} onClose={handleClose} />
          <StepProgressBar steps={STEPS} currentStep={step} />

          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
              <div className={`flex-1 overflow-hidden flex ${step === 2 ? 'flex-col md:flex-row' : 'flex-col'}`}>
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                  {step === 0 && <StepDebtor />}
                  {step === 1 && <StepChargeDetails planType={planType!} />}
                  {step === 2 && (
                    <StepMessage 
                      hasPixKey={hasPixKey} 
                      textareaRef={textareaRef} 
                      insertVariable={insertVariable} 
                      plan={planType!} 
                      onUpgrade={setUpgradeModule}
                    />
                  )}
                  {step === 3 && <StepConfirm hasPixKey={hasPixKey} plan={planType!} />}
                </div>

                {step === 2 && (
                  <div className="w-full md:w-[380px] border-t md:border-t-0 md:border-l border-zinc-100 dark:border-white/7 flex flex-col bg-zinc-50 dark:bg-background shrink-0">
                    <div className="px-5 py-4 border-b border-zinc-100 dark:border-white/7">
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

              <ModalFooter
                step={step}
                totalSteps={STEPS.length}
                sending={sending}
                onBack={() => setStep((s) => s - 1)}
                onNext={nextStep}
                onSubmit={handleSubmit(onSubmit)}
              />
            </form>
          </FormProvider>
        </div>
      </div>

      {upgradeModule && (
        <UpgradeModal
          onClose={() => setUpgradeModule(null)}
          moduleName={upgradeModule}
        />
      )}
    </>
  );
}


