'use client';

import { IconChevronRight, IconSend } from '@/components/ui/Icons';

interface ModalFooterProps {
  step: number;
  totalSteps: number;
  sending: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function ModalFooter({ step, totalSteps, sending, onBack, onNext, onSubmit }: ModalFooterProps) {
  return (
    <div className="px-6 py-5 border-t border-zinc-100 dark:border-white/7 flex gap-3 shrink-0">
      {step > 0 && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-zinc-200 dark:border-white/8 text-zinc-600 dark:text-zinc-300 font-bold py-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-sm"
        >
          Voltar
        </button>
      )}
      {step < totalSteps - 1 ? (
        <button
          type="button"
          onClick={onNext}
          className="flex-1 bg-[#0b1521] hover:bg-surface-dark text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
        >
          Próximo <IconChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={sending}
          className="flex-1 bg-green-500 hover:bg-green-600 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
        >
          {sending ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enviando...</>
          ) : (
            <><IconSend className="w-4 h-4" /> Enviar via WhatsApp</>
          )}
        </button>
      )}
    </div>
  );
}


