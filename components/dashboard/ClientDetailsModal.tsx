'use client';

import { useState, useEffect } from 'react';
import { getClientDetailsAction } from '@/app/actions/clients';
import { formatMoney, maskPhone } from '@/lib/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  IconX, IconPhone, IconMail, IconPlus, IconRefreshCcw,
  IconCheckCircle, IconAlertCircle, IconClock,
} from '@/components/ui/Icons';

interface Props {
  clientId: string | null;
  onClose: () => void;
  onNewCharge: (name: string, phone: string) => void;
  onChargeClick: (chargeId: string) => void;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'PAID') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400">
      <IconCheckCircle className="w-3 h-3" /> Pago
    </span>
  );
  if (status === 'OVERDUE') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400">
      <IconAlertCircle className="w-3 h-3" /> Atrasado
    </span>
  );
  if (status === 'CANCELED') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-zinc-200 text-zinc-600 dark:bg-zinc-700/50 dark:text-zinc-400">
      <IconX className="w-3 h-3" /> Cancelado
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400">
      <IconClock className="w-3 h-3" /> Pendente
    </span>
  );
}

export function ClientDetailsModal({ clientId, onClose, onNewCharge, onChargeClick }: Props) {
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    if (!clientId) { setClient(null); return; }
    setLoading(true);
    getClientDetailsAction(clientId)
      .then(res => setClient(res.success ? res.data : null))
      .finally(() => setLoading(false));
  }, [clientId]);

  if (!clientId) return null;

  const displayPhone = client?.phone
    ? maskPhone(client.phone.replace(/^55/, ''))
    : '—';

  return (
    <div
      className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-zinc-50 dark:bg-[#0f1c2b] rounded-[2rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-white/[0.07]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-white/[0.07] bg-white dark:bg-[#152336]">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Detalhes do Cliente</h2>
            {client && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                ID: {client.id?.split('-')[0].toUpperCase()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {client && (
              <button
                onClick={() => onNewCharge(client.name, client.phone)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-green-500 hover:bg-green-600 text-white transition-all shadow-md shadow-green-500/20"
              >
                <IconPlus className="w-4 h-4" /> Nova Cobrança
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-[#0b1521]/50 p-6 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <IconRefreshCcw className="w-8 h-8 text-green-500 animate-spin" />
            </div>
          ) : client ? (
            <>
              {/* Perfil */}
              <div className="bg-white dark:bg-[#152336] border border-zinc-200 dark:border-white/[0.07] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-2xl shrink-0">
                    {client.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 truncate">{client.name}</h3>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <IconPhone className="w-3.5 h-3.5" /> {displayPhone}
                      </p>
                      {client.email && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                          <IconMail className="w-3.5 h-3.5" /> {client.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {client.notes && (
                  <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-white/[0.07]">
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Observações</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{client.notes}</p>
                  </div>
                )}
              </div>

              {/* Resumo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-[#152336] border border-zinc-200 dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Total de Cobranças</p>
                  <p className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{client.charges?.length ?? 0}</p>
                </div>
                <div className="bg-white dark:bg-[#152336] border border-zinc-200 dark:border-white/[0.07] rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Em Aberto</p>
                  <p className="text-2xl font-extrabold text-red-500">
                    {formatMoney(
                      client.charges
                        ?.filter((c: any) => c.status === 'PENDING' || c.status === 'OVERDUE')
                        .reduce((acc: number, c: any) => acc + c.amount, 0) ?? 0
                    )}
                  </p>
                </div>
              </div>

              {/* Cobranças */}
              <div className="bg-white dark:bg-[#152336] border border-zinc-200 dark:border-white/[0.07] rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/[0.07]">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Histórico de Cobranças</h4>
                </div>
                {client.charges?.length === 0 ? (
                  <div className="px-6 py-10 text-center">
                    <p className="text-sm text-zinc-400 dark:text-zinc-500">Nenhuma cobrança para este cliente.</p>
                    <button
                      onClick={() => onNewCharge(client.name, client.phone)}
                      className="mt-3 text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1 mx-auto"
                    >
                      <IconPlus className="w-4 h-4" /> Criar primeira cobrança
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-white/[0.06] bg-zinc-50 dark:bg-white/[0.02]">
                          <th className="px-5 py-3 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Descrição</th>
                          <th className="px-5 py-3 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Valor</th>
                          <th className="px-5 py-3 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Vencimento</th>
                          <th className="px-5 py-3 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {client.charges.map((charge: any) => (
                          <tr
                            key={charge.id}
                            className="border-b border-zinc-100 dark:border-white/[0.04] hover:bg-zinc-50 dark:hover:bg-white/[0.03] cursor-pointer transition-colors"
                            onClick={() => onChargeClick(charge.id)}
                          >
                            <td className="px-5 py-3.5 text-sm text-zinc-700 dark:text-zinc-200 font-medium truncate max-w-[200px]">{charge.description}</td>
                            <td className="px-5 py-3.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200">{formatMoney(charge.amount)}</td>
                            <td className="px-5 py-3.5 text-sm text-zinc-500 dark:text-zinc-400">
                              {format(new Date(charge.dueDate), "dd 'de' MMM, yyyy", { locale: ptBR })}
                            </td>
                            <td className="px-5 py-3.5">
                              <StatusBadge status={charge.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-zinc-500 py-12">Cliente não encontrado.</div>
          )}
        </div>
      </div>
    </div>
  );
}
