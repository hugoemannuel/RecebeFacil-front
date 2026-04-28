'use client';

import Link from 'next/link';
import { IconX } from '@/components/ui/Icons';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DemoBlockedModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-sm mx-4 relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
        >
          <IconX className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎉</span>
        </div>
        <h2 className="text-lg font-bold text-zinc-900 mb-2">Você já testou o RecebeFácil!</h2>
        <p className="text-sm text-zinc-500 mb-8">
          Que tal criar sua conta grátis e começar a cobrar de verdade?
        </p>
        <Link
          href="/cadastro"
          className="block w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-bold text-base transition-all hover:scale-[1.02] shadow-lg shadow-green-500/20 text-center mb-3"
        >
          Criar conta — é grátis
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
