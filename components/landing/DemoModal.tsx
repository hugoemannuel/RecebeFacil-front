'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { RHFInput } from '@/components/forms/rhf/RHFInput';
import { RHFTextarea } from '@/components/forms/rhf/RHFTextarea';
import { WhatsAppPreview } from '@/components/ui/WhatsAppPreview';
import { Select } from '@/components/ui/Select/Select';
import { IconX, IconCheckCircle, IconUser, IconPhone, IconSparkles, IconSend } from '@/components/ui/Icons';
import { maskPhone, interpolateTemplate } from '@/lib/formatters';
import { sendDemo } from '@/app/actions/demo';

const DEMO_TEMPLATE = `Olá *{{nome}}*! 👋

Essa mensagem foi enviada em tempo real pelo *RecebeFácil*.

É assim que seus clientes recebem as cobranças — automático, no WhatsApp, com link PIX.

👉 Crie sua conta grátis: recebefacil.com.br/cadastro`;

const TEMPLATE_OPTIONS = [
  { label: 'Demo Padrão', value: DEMO_TEMPLATE },
  {
    label: 'Lembrete Amigável',
    value: `Oi *{{nome}}*! 😊\n\nVeja como o *RecebeFácil* funciona — seus clientes recebem cobranças assim, no WhatsApp, com link de pagamento.\n\n👉 Experimente grátis: recebefacil.com.br/cadastro`,
  },
  {
    label: 'Direto ao Ponto',
    value: `*{{nome}}*, imagine receber pagamentos pelo WhatsApp de forma automática.\n\nEssa mensagem é um exemplo real do *RecebeFácil*.\n\n👉 Crie sua conta grátis agora.`,
  },
];

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  phone: z.string().regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Telefone inválido'),
  message: z.string().min(10, 'Mensagem obrigatória'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onBlocked: () => void;
}

export function DemoModal({ open, onClose, onBlocked }: Props) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { control, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', message: DEMO_TEMPLATE },
  });

  const values = watch();
  const previewMessage = interpolateTemplate(values.message || '', {
    nome: values.name || 'Você',
  });

  function handleClose() {
    reset();
    setSent(false);
    onClose();
  }

  async function onSubmit(data: FormData) {
    setSending(true);
    try {
      const result = await sendDemo({
        name: data.name,
        phone: data.phone.replace(/\D/g, ''),
        message: data.message,
      });
      if (result.blocked) {
        reset();
        onBlocked();
      } else {
        setSent(true);
      }
    } catch {
      toast.error('Erro ao enviar. Tente novamente.');
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex flex-col items-center justify-center px-6 py-5 border-b border-zinc-100 shrink-0">
          <h2 className="text-lg font-extrabold text-zinc-800 tracking-tight">Teste ao vivo</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Receba uma mensagem real no seu WhatsApp agora
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          /* ── Success ── */
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <IconCheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Mensagem enviada! 📲</h2>
            <p className="text-zinc-500 mb-1">Confira seu WhatsApp agora.</p>
            <p className="text-zinc-500 mb-10 max-w-sm">
              Gostou? Crie sua conta e seus clientes vão receber cobranças assim, automaticamente.
            </p>
            <Link
              href="/cadastro"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-green-500/20 mb-4"
            >
              Criar conta grátis →
            </Link>
            <button
              type="button"
              onClick={handleClose}
              className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

              {/* Left — campos + editor */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                <p className="text-sm text-zinc-500">
                  Preencha seus dados e personalize a mensagem que vai chegar no seu WhatsApp.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <RHFInput<FormData>
                    name="name"
                    control={control}
                    label="Seu nome"
                    placeholder="Ex: João Silva"
                    icon={<IconUser className="w-4 h-4" />}
                  />
                  <RHFInput<FormData>
                    name="phone"
                    control={control}
                    label="WhatsApp (com DDD)"
                    placeholder="(11) 99999-9999"
                    type="tel"
                    mask={maskPhone}
                    icon={<IconPhone className="w-4 h-4" />}
                  />
                </div>

                <Select
                  label="Template base"
                  value={values.message}
                  onChange={(value) => setValue('message', value, { shouldValidate: true })}
                  options={TEMPLATE_OPTIONS}
                />

                <RHFTextarea<FormData>
                  name="message"
                  control={control}
                  label="Mensagem"
                  inputRef={textareaRef}
                  rows={9}
                />

                <p className="text-xs text-zinc-400">
                  Enviamos apenas 1 mensagem. Sem spam.
                </p>
              </div>

              {/* Right — preview (só no desktop) */}
              <div className="hidden md:flex w-[340px] border-l border-zinc-100 flex-col bg-zinc-50 shrink-0">
                <div className="px-5 py-4 border-b border-zinc-100">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <IconSparkles className="w-3.5 h-3.5 text-green-500" /> Preview ao vivo
                  </p>
                </div>
                <div className="flex-1 p-4 overflow-hidden">
                  <div className="h-full rounded-2xl overflow-hidden shadow-md">
                    <WhatsAppPreview
                      senderName="RecebeFácil"
                      message={previewMessage}
                      showQrCode={false}
                      showPixButton={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-zinc-100 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={handleClose}
                className="border border-zinc-200 text-zinc-600 font-bold py-3 px-6 rounded-xl hover:bg-zinc-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={sending}
                className="flex-1 bg-green-500 hover:bg-green-600 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
              >
                {sending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <IconSend className="w-4 h-4" /> Enviar no WhatsApp
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
