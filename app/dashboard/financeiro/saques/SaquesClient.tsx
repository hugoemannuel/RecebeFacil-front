'use client';

import { 
  IconWallet, 
  IconArrowLeft, 
  IconLock, 
  IconPlus,
  IconAlertCircle
} from '@/components/ui/Icons';
import Link from 'next/link';
import { formatMoney } from '@/lib/formatters';

interface Props {
  isPremium: boolean;
  plan: string;
}

export function SaquesClient({ isPremium, plan }: Props) {
  if (!isPremium) {
    return (
        <div className="p-8 max-w-5xl mx-auto text-center py-20">
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <IconLock className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Gestão de Saques Premium</h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8">
                Transfira seu saldo acumulado na plataforma diretamente para sua conta bancária. Disponível apenas nos planos PRO e UNLIMITED.
            </p>
            <Link 
                href="/planos"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-2xl transition-all"
            >
                Ver planos para upgrade
            </Link>
        </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/financeiro" className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
          <IconArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Saques e Transferências
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Mova seu dinheiro para sua conta bancária com facilidade.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-surface p-8 rounded-4xl border border-zinc-100 dark:border-white/7 shadow-sm">
                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">Solicitar Novo Saque</h3>
                
                <div className="p-8 border-2 border-dashed border-zinc-100 dark:border-white/7 rounded-3xl flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center">
                        <IconAlertCircle className="w-6 h-6 text-amber-500" />
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                        Para solicitar saques, você precisa primeiro configurar sua conta bancária nas configurações do perfil.
                    </p>
                    <Link href="/dashboard/configuracoes" className="text-green-600 font-bold hover:underline">
                        Configurar agora →
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-surface rounded-4xl border border-zinc-100 dark:border-white/7 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-zinc-100 dark:border-white/7">
                    <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Histórico de Saques</h3>
                </div>
                <div className="py-20 text-center text-zinc-400 dark:text-zinc-500 italic">
                    Nenhum saque realizado até o momento.
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-zinc-900 dark:bg-green-500 p-8 rounded-4xl text-white shadow-xl">
                <p className="text-sm font-bold text-white/50 uppercase tracking-widest mb-2">Disponível para Saque</p>
                <p className="text-4xl font-extrabold tracking-tight mb-8">R$ 0,00</p>
                <button className="w-full bg-white text-zinc-900 font-bold py-4 rounded-2xl hover:bg-zinc-100 transition-all flex items-center justify-center gap-2">
                    <IconPlus className="w-4 h-4" />
                    Solicitar Transferência
                </button>
            </div>

            <div className="bg-white dark:bg-surface p-6 rounded-3xl border border-zinc-100 dark:border-white/7">
                <h4 className="font-bold text-zinc-800 dark:text-zinc-100 mb-4">Regras de Saque</h4>
                <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                    <li className="flex gap-2">
                        <span className="text-green-500 font-bold">•</span>
                        Saques realizados até as 12h são processados no mesmo dia.
                    </li>
                    <li className="flex gap-2">
                        <span className="text-green-500 font-bold">•</span>
                        Taxa fixa de R$ 1,90 por transferência bancária.
                    </li>
                    <li className="flex gap-2">
                        <span className="text-green-500 font-bold">•</span>
                        Limite diário conforme seu plano PRO.
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
}
