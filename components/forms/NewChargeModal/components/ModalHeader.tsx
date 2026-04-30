'use client';

import { IconX } from '@/components/ui/Icons';

interface ModalHeaderProps {
  step: number;
  totalSteps: number;
  onClose: () => void;
}

export function ModalHeader({ step, totalSteps, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-white/7 bg-white dark:bg-surface shrink-0 rounded-t-[2rem]">
      <div>
        <h2 className="text-lg font-extrabold text-zinc-800 dark:text-zinc-100 tracking-tight">Nova Cobrança</h2>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Etapa {step + 1} de {totalSteps}</p>
      </div>
      <button
        onClick={onClose}
        className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors"
      >
        <IconX className="w-5 h-5" />
      </button>
    </div>
  );
}


