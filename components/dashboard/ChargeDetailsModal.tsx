'use client';

import { useState, useEffect } from 'react';
import { getChargeDetailsAction, bulkCancelAction, bulkRemindAction } from '@/app/actions/charges';
import {
  IconX, IconUser, IconPhone, IconCalendar, IconCheckCircle,
  IconAlertCircle, IconClock, IconMessageCircle, IconRefreshCcw,
  IconCopy, IconSend, IconTrash
} from '@/components/ui/Icons';
import { formatMoney, maskPhone } from '@/lib/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface Props {
  chargeId: string | null;
  onClose: () => void;
  onCancel?: (id: string) => void;
}

const RECURRENCE_LABEL: Record<string, string> = {
  ONCE: 'Única',
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensal',
  YEARLY: 'Anual',
};

export function StatusBadge({ status }: { status: string }) {
  if (status === 'PAID')
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">
        <IconCheckCircle className="w-4 h-4" /> Pago
      </span>
    );
  if (status === 'OVERDUE')
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400">
        <IconAlertCircle className="w-4 h-4" /> Atrasado
      </span>
    );
  if (status === 'PENDING')
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400">
        <IconClock className="w-4 h-4" /> Pendente
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-400">
      <IconX className="w-4 h-4" /> Cancelado
    </span>
  );
}

export function ChargeDetailsModal({ chargeId, onClose, onCancel }: Props) {
  const [charge, setCharge] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [reminding, setReminding] = useState(false);

  useEffect(() => {
    if (!chargeId) { setCharge(null); return; }
    setLoading(true);
    getChargeDetailsAction(chargeId)
      .then(res => { if (res.success) setCharge(res.data); })
      .finally(() => setLoading(false));
  }, [chargeId]);

  if (!chargeId) return null;

  const getRealMessage = (tpl: string) => {
    if (!tpl || !charge) return tpl;
    return tpl
      .replace(/\{\{nome\}\}/g, charge.debtor?.name || '')
      .replace(/\{\{valor\}\}/g, formatMoney(charge.amount))
      .replace(/\{\{vencimento\}\}/g, new Date(charge.due_date).toLocaleDateString('pt-BR'))
      .replace(/\{\{descricao\}\}/g, charge.description || '')
      .replace(/\{\{link_pagamento\}\}/g, `https://recebefacil.com/p/${charge.id}`);
  };

  const canAct = charge && charge.status !== 'PAID' && charge.status !== 'CANCELED';

  async function handleRemind() {
    setReminding(true);
    try {
      const res = await bulkRemindAction([charge.id]);
      if (res.success) toast.success('Lembrete enviado via WhatsApp!');
      else toast.error(res.error || 'Erro ao enviar lembrete.');
    } finally {
      setReminding(false);
    }
  }

  async function handleCancel() {
    setCanceling(true);
    try {
      const res = await bulkCancelAction([charge.id]);
      if (res.success) {
        toast.success('Cobrança cancelada.');
        onCancel?.(charge.id);
        onClose();
      } else {
        toast.error(res.error || 'Erro ao cancelar.');
      }
    } finally {
      setCanceling(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 transition-colors duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-[#f8fafc] dark:bg-[#0f1c2b] rounded-[2rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-white/[0.07]"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#152336] shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            {loading && (
              <div className="h-8 w-48 bg-zinc-100 dark:bg-white/10 rounded-lg animate-pulse" />
            )}
            {!loading && charge && (
              <>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">
                    #{charge.id?.split('-')[0].toUpperCase()}
                  </p>
                  <p className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {formatMoney(charge.amount)}
                  </p>
                </div>
                <StatusBadge status={charge.status} />
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-full transition-colors duration-300 shrink-0"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-40 bg-zinc-100 dark:bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : charge ? (
            <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6 items-start">

              {/* COLUNA ESQUERDA */}
              <div className="space-y-5">

                {/* Detalhes financeiros */}
                <div className="bg-white dark:bg-[#152336] border border-zinc-200 dark:border-white/[0.07] rounded-2xl p-6 shadow-sm">
                  <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-5">
                    Detalhes financeiros
                  </h4>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-1 flex items-center gap-1">
                        <IconCalendar className="w-3.5 h-3.5" /> Vencimento
                      </p>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {format(new Date(charge.due_date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-1">Recorrência</p>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {RECURRENCE_LABEL[charge.recurrence] ?? charge.recurrence}
                      </p>
                    </div>
                    {charge.description && (
                      <div className="col-span-2">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-1">Descrição</p>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{charge.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cliente */}
                <div className="bg-white dark:bg-[#152336] border border-zinc-200 dark:border-white/[0.07] rounded-2xl p-6 shadow-sm">
                  <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <IconUser className="w-3.5 h-3.5" /> Cliente
                  </h4>
                  <div className="flex items-center gap-4 bg-zinc-50 dark:bg-white/5 p-4 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                      {charge.debtor.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">{charge.debtor.name}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                        <IconPhone className="w-3.5 h-3.5" /> {maskPhone(charge.debtor.phone)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="bg-white dark:bg-[#152336] border border-zinc-200 dark:border-white/[0.07] rounded-2xl p-6 shadow-sm">
                  <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Ações</h4>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://recebefacil.com/p/${charge.id}`);
                        toast.success('Link de pagamento copiado!');
                      }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors duration-300"
                    >
                      <IconCopy className="w-4 h-4 text-zinc-400" /> Copiar link de pagamento
                    </button>
                    {canAct && (
                      <>
                        <button
                          onClick={handleRemind}
                          disabled={reminding}
                          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-semibold text-sm hover:bg-green-100 dark:hover:bg-green-500/20 hover:scale-[1.02] transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                          {reminding
                            ? <IconRefreshCcw className="w-4 h-4 animate-spin" />
                            : <IconSend className="w-4 h-4" />}
                          Enviar lembrete via WhatsApp
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={canceling}
                          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {canceling
                            ? <IconRefreshCcw className="w-4 h-4 animate-spin" />
                            : <IconTrash className="w-4 h-4" />}
                          Cancelar cobrança
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* COLUNA DIREITA — Timeline */}
              <div className="bg-white dark:bg-[#152336] border border-zinc-200 dark:border-white/[0.07] rounded-2xl p-6 shadow-sm">
                <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <IconMessageCircle className="w-3.5 h-3.5" /> Timeline do WhatsApp
                </h4>

                <div className="relative border-l-2 border-zinc-100 dark:border-white/[0.07] ml-3 space-y-8">
                  {/* Criação */}
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-600 border-2 border-white dark:border-[#152336]" />
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mb-1">
                      {new Date(charge.created_at).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Cobrança gerada no sistema</p>
                    {charge.custom_message && (
                      <div className="mt-3 bg-[#e1ffd4] text-zinc-800 p-3 rounded-2xl rounded-tl-sm text-sm border border-[#c4e8b5] shadow-sm w-11/12">
                        <p className="whitespace-pre-wrap">{getRealMessage(charge.custom_message)}</p>
                        <p className="text-[10px] text-zinc-500 text-right mt-1 font-medium">Mensagem real</p>
                      </div>
                    )}
                  </div>

                  {/* Mensagens */}
                  {charge.messages?.length === 0 ? (
                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-500/20 border-2 border-white dark:border-[#152336]" />
                      <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">Nenhuma mensagem disparada ainda.</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">A automação assumirá no momento certo.</p>
                    </div>
                  ) : (
                    charge.messages?.map((msg: any) => (
                      <div key={msg.id} className="relative pl-6">
                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#152336] ${msg.status === 'SENT' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mb-1">
                          {new Date(msg.sent_at).toLocaleString('pt-BR')}
                        </p>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                          {msg.trigger_type === 'MANUAL' ? 'Disparo Manual' : 'Lembrete Automático'}
                        </p>
                        <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/[0.06] rounded-lg p-3">
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                            {msg.status === 'SENT'
                              ? <><IconCheckCircle className="w-3.5 h-3.5 text-green-500" /> Entregue via Z-API</>
                              : <><IconAlertCircle className="w-3.5 h-3.5 text-red-500" /> Falha: {msg.error_details || 'Erro desconhecido'}</>}
                          </p>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Pagamento confirmado */}
                  {charge.status === 'PAID' && charge.payment_date && (
                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#152336]" />
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                        {new Date(charge.payment_date).toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Pagamento Confirmado!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto py-24">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <IconAlertCircle className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Cobrança não encontrada</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">Não foi possível carregar os detalhes desta cobrança.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
