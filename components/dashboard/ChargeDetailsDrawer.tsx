'use client';

import { useState, useEffect } from 'react';
import { getChargeDetailsAction } from '@/app/actions/charges';
import { IconX, IconUser, IconPhone, IconCalendar, IconCheckCircle, IconAlertCircle, IconClock, IconMessageCircle, IconRefreshCcw } from '@/components/ui/Icons';
import { formatMoney, maskPhone } from '@/lib/formatters';

interface Props {
  chargeId: string | null;
  onClose: () => void;
}

export function ChargeDetailsDrawer({ chargeId, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [charge, setCharge] = useState<any>(null);

  useEffect(() => {
    if (chargeId) {
      getChargeDetailsAction(chargeId).then(res => {
        if (res.success) {
          setCharge(res.data);
        } else {
          console.error(res.error);
          setCharge(null);
        }
      }).finally(() => setLoading(false));
    } else {
      setCharge(null);
    }
  }, [chargeId]);

  const getRealMessage = (messageTemplate: string) => {
    if (!messageTemplate || !charge) return messageTemplate;
    return messageTemplate
      .replace(/\{\{nome\}\}/g, charge.debtor?.name || '')
      .replace(/\{\{valor\}\}/g, formatMoney(charge.amount))
      .replace(/\{\{vencimento\}\}/g, new Date(charge.due_date).toLocaleDateString('pt-BR'))
      .replace(/\{\{descricao\}\}/g, charge.description || '')
      .replace(/\{\{link_pagamento\}\}/g, `https://recebefacil.com/p/${charge.id}`);
  };

  if (!chargeId) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6" 
        onClick={onClose}
      >
        <div 
          className="w-full max-w-3xl bg-zinc-50 rounded-[2rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-white z-10 relative">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Detalhes da Cobrança</h2>
            <p className="text-sm text-zinc-500">ID: {charge?.id?.split('-')[0].toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 bg-zinc-50 hover:bg-zinc-100 rounded-full transition-colors">
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto bg-zinc-50/50 p-6 space-y-8">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <IconRefreshCcw className="w-8 h-8 text-green-500 animate-spin" />
            </div>
          ) : charge ? (
            <>
              {/* Resumo Card */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div>
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-1">Valor a Receber</p>
                    <h3 className="text-4xl font-extrabold text-zinc-900 tracking-tight">{formatMoney(charge.amount)}</h3>
                  </div>
                  {charge.status === 'PAID' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-emerald-100 text-emerald-800">
                      <IconCheckCircle className="w-4 h-4" /> Pago
                    </span>
                  )}
                  {charge.status === 'OVERDUE' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-red-100 text-red-800">
                      <IconAlertCircle className="w-4 h-4" /> Atrasado
                    </span>
                  )}
                  {charge.status === 'PENDING' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-amber-100 text-amber-800">
                      <IconClock className="w-4 h-4" /> Pendente
                    </span>
                  )}
                  {charge.status === 'CANCELED' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-zinc-200 text-zinc-600">
                      <IconX className="w-4 h-4" /> Cancelado
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-xs text-zinc-500 font-medium mb-1 flex items-center gap-1">
                      <IconCalendar className="w-3.5 h-3.5" /> Vencimento
                    </p>
                    <p className="font-semibold text-zinc-900">
                      {new Date(charge.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium mb-1">Descrição</p>
                    <p className="font-semibold text-zinc-900 truncate" title={charge.description}>{charge.description}</p>
                  </div>
                </div>
              </div>

              {/* Cliente Card */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <IconUser className="w-4 h-4 text-zinc-400" /> Dados do Cliente
                </h4>
                <div className="flex items-center gap-4 bg-zinc-50 p-4 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                    {charge.debtor.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{charge.debtor.name}</p>
                    <p className="text-sm text-zinc-500 flex items-center gap-1 mt-0.5">
                      <IconPhone className="w-3.5 h-3.5" /> {maskPhone(charge.debtor.phone)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Linha do Tempo (Timeline do WhatsApp) */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <IconMessageCircle className="w-4 h-4 text-zinc-400" /> Timeline do WhatsApp
                </h4>

                <div className="relative border-l-2 border-zinc-100 ml-3 space-y-8">
                  {/* Criação sempre existe */}
                  <div className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-zinc-200 border-2 border-white"></div>
                    <p className="text-xs font-bold text-zinc-400 mb-1">
                      {new Date(charge.created_at).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm font-semibold text-zinc-900">Cobrança Gerada no Sistema</p>

                    {/* Chat Bubble para a mensagem enviada */}
                    {charge.custom_message && (
                      <div className="mt-3 bg-[#e1ffd4] text-zinc-800 p-3 rounded-2xl rounded-tl-sm text-sm border border-[#c4e8b5] shadow-sm relative w-11/12">
                        <p className="whitespace-pre-wrap">{getRealMessage(charge.custom_message)}</p>
                        <p className="text-[10px] text-zinc-500 text-right mt-1 font-medium">Visualização Real (Variáveis Preenchidas)</p>
                      </div>
                    )}
                  </div>

                  {charge.messages?.length === 0 ? (
                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-100 border-2 border-white"></div>
                      <p className="text-sm font-semibold text-amber-600">Nenhuma mensagem disparada ainda.</p>
                      <p className="text-xs text-zinc-500 mt-1">A automação assumirá no momento certo.</p>
                    </div>
                  ) : (
                    charge.messages?.map((msg: any) => (
                      <div key={msg.id} className="relative pl-6">
                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${msg.status === 'SENT' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <p className="text-xs font-bold text-zinc-400 mb-1">
                          {new Date(msg.sent_at).toLocaleString('pt-BR')}
                        </p>
                        <p className="text-sm font-bold text-zinc-900 mb-1">
                          {msg.trigger_type === 'MANUAL' ? 'Disparo Manual' : 'Lembrete Automático'}
                        </p>
                        <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3 mt-2 relative">
                          <div className="absolute -left-2 top-3 w-3 h-3 bg-zinc-50 border-t border-l border-zinc-100 rotate-45"></div>
                          <p className="text-xs text-zinc-600 relative z-10 flex items-center gap-2">
                            {msg.status === 'SENT' ? (
                              <><IconCheckCircle className="w-3.5 h-3.5 text-green-500" /> Entregue com sucesso via Z-API</>
                            ) : (
                              <><IconAlertCircle className="w-3.5 h-3.5 text-red-500" /> Falha no envio: {msg.error_details || 'Erro desconhecido'}</>
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  )}

                  {charge.status === 'PAID' && charge.payment_date && (
                     <div className="relative pl-6">
                     <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></div>
                     <p className="text-xs font-bold text-emerald-600 mb-1">
                       {new Date(charge.payment_date).toLocaleString('pt-BR')}
                     </p>
                     <p className="text-sm font-semibold text-zinc-900">Pagamento Confirmado! 🎉</p>
                   </div>
                  )}

                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-zinc-500 py-12">Cobrança não encontrada.</div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
