"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { IconLock } from '@/components/ui/Icons';

interface UpgradeModalProps {
  moduleName: string;
  onClose: () => void;
}

const MODULE_LABELS: Record<string, { label: string; requiredPlan: string }> = {
  CLIENTS: { label: 'Gerenciar Clientes', requiredPlan: 'STARTER' },
  REPORTS: { label: 'Relatórios Detalhados', requiredPlan: 'STARTER' },
  EXCEL_IMPORT: { label: 'Importação via Excel', requiredPlan: 'STARTER' },
  LIMIT_REACHED: { label: 'Limite de cobranças atingido', requiredPlan: 'STARTER' },
};


export function UpgradeModal({ moduleName, onClose }: UpgradeModalProps) {
  const info = MODULE_LABELS[moduleName] ?? { label: moduleName, requiredPlan: 'STARTER' };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-700 transition-colors text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
          <IconLock className="w-7 h-7 text-amber-500" />
        </div>

        <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-2">
          Módulo bloqueado
        </h2>
        <p className="text-zinc-500 mb-6 leading-relaxed">
          <span className="font-bold text-zinc-800">{info.label}</span> está disponível a partir do plano{' '}
          <span className="font-bold text-green-600">{info.requiredPlan}</span>. Faça upgrade e desbloqueie mais poder para seu negócio.
        </p>

        <div className="space-y-3">
          <Link
            href="/planos"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center transition-all hover:scale-[1.02] shadow-lg shadow-green-500/20"
            onClick={onClose}
          >
            Ver planos e fazer upgrade →
          </Link>
          <button
            onClick={onClose}
            className="w-full text-zinc-500 hover:text-zinc-700 font-medium py-2 text-sm transition-colors"
          >
            Continuar no plano atual
          </button>
        </div>
      </div>
    </div>
  );
}
