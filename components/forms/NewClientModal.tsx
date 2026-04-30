'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createClientAction } from '@/app/actions/clients';
import { maskPhone } from '@/lib/formatters';
import { IconX, IconUser, IconPhone, IconMail } from '@/components/ui/Icons';
import { RHFInput } from '@/components/forms/rhf/RHFInput';
import { RHFTextarea } from '@/components/forms/rhf/RHFTextarea';

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  phone: z.string().min(10, 'Telefone obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  notes: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function NewClientModal({ open, onClose, onSuccess }: Props) {
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', email: '', notes: '' },
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() { reset(); onClose(); }

  async function onSubmit(data: FormData) {
    const result = await createClientAction({
      name: data.name,
      phone: data.phone.replace(/\D/g, ''),
      email: data.email || undefined,
      notes: data.notes || undefined,
    });

    if (result.success) {
      toast.success('Cliente cadastrado com sucesso!');
      handleClose();
      if (onSuccess) onSuccess();
    } else {
      toast.error(result.error ?? 'Ops, algo deu errado. Tente novamente.');
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg bg-zinc-50 dark:bg-surface-soft rounded-4xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-white/7"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-white/7 bg-white dark:bg-surface">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Novo Cliente</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Cadastre um cliente na sua base</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto flex flex-col">
          <div className="px-6 py-6 space-y-5 flex-1">
            <RHFInput<FormData>
              name="name"
              control={control}
              label="Nome Completo"
              placeholder="Ex: João Silva"
              icon={<IconUser className="w-4 h-4" />}
            />
            <RHFInput<FormData>
              name="phone"
              control={control}
              label="WhatsApp"
              type="tel"
              placeholder="(00) 00000-0000"
              icon={<IconPhone className="w-4 h-4" />}
              mask={maskPhone}
            />
            <RHFInput<FormData>
              name="email"
              control={control}
              label="E-mail (opcional)"
              type="email"
              placeholder="email@exemplo.com"
              icon={<IconMail className="w-4 h-4" />}
            />
            <RHFTextarea<FormData>
              name="notes"
              control={control}
              label="Observações (opcional)"
              placeholder="Ex: prefere contato às manhãs"
              rows={3}
            />
          </div>

          <div className="px-6 py-4 border-t border-zinc-100 dark:border-white/7 bg-white dark:bg-surface flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-green-500 hover:bg-green-600 text-white transition-all shadow-lg shadow-green-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


