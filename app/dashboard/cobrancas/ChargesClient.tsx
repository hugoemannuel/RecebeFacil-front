'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getFilteredRowModel,
  getSortedRowModel
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconMoreVertical,
  IconCopy,
  IconExternalLink,
  IconBot,
  IconLock,
  IconCheckCircle,
  IconClock,
  IconAlertCircle,
  IconSend,
  IconTrash
} from '@/components/ui/Icons';
import { formatMoney, maskPhone } from '@/lib/formatters';
import { NewChargeDrawer } from '@/components/forms/NewChargeDrawer';
import { toast } from 'sonner';
import { api } from '@/services/api';

type Charge = {
  id: string;
  debtorName: string;
  phone: string;
  amount: number;
  dueDate: string;
  status: string;
  automationEnabled: boolean;
};

const columnHelper = createColumnHelper<Charge>();

export function ChargesClient({
  initialData,
  plan,
  usage
}: {
  initialData: Charge[],
  plan: 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED',
  usage: { count: number, limit: number }
}) {
  const [data, setData] = useState(initialData);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const [rowSelection, setRowSelection] = useState({});
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchParams = useSearchParams();

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      // Small timeout to ensure the UI is loaded before opening the drawer
      setTimeout(() => setDrawerOpen(true), 100);
    }
  }, [searchParams]);

  const filteredData = useMemo(() => {
    return data.filter(c => {
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (dateFilter && !c.dueDate.startsWith(dateFilter)) return false;
      if (searchQuery && !c.debtorName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [data, statusFilter, dateFilter, searchQuery]);

  const columns = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center w-full">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-zinc-300 text-green-600 focus:ring-green-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            disabled={plan === 'FREE' || plan === 'STARTER'}
            title={plan === 'FREE' || plan === 'STARTER' ? 'Ação em massa disponível no plano PRO' : 'Selecionar todos'}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center w-full">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-zinc-300 text-green-600 focus:ring-green-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            disabled={plan === 'FREE' || plan === 'STARTER'}
          />
        </div>
      ),
      size: 40,
    }),
    columnHelper.accessor('debtorName', {
      header: 'Cliente',
      cell: info => (
        <div>
          <div className="font-bold text-zinc-900">{info.getValue()}</div>
          <div className="text-xs text-zinc-500">{maskPhone(info.row.original.phone.replace(/^55/, ''))}</div>
        </div>
      )
    }),
    columnHelper.accessor('amount', {
      header: 'Valor',
      cell: info => <div className="font-semibold text-zinc-700">{formatMoney(info.getValue())}</div>
    }),
    columnHelper.accessor('dueDate', {
      header: 'Vencimento',
      cell: info => <div className="text-sm text-zinc-600">{format(new Date(info.getValue()), "dd 'de' MMM, yyyy", { locale: ptBR })}</div>
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        if (status === 'PAID') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800"><IconCheckCircle className="w-3 h-3" /> Pago</span>;
        if (status === 'OVERDUE') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800"><IconAlertCircle className="w-3 h-3" /> Atrasado</span>;
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800"><IconClock className="w-3 h-3" /> Pendente</span>;
      }
    }),
    columnHelper.accessor('automationEnabled', {
      header: 'Automação',
      cell: info => {
        const isEnabled = info.getValue();
        if (plan === 'FREE') {
          return (
            <button
              onClick={() => toast.error('O plano FREE não possui automação. Faça upgrade para o plano STARTER.')}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 text-zinc-400 hover:bg-zinc-200 transition-colors relative"
              title="Automação bloqueada no plano Free"
            >
              <IconBot className="w-4 h-4" />
              <IconLock className="w-3 h-3 absolute -bottom-1 -right-1 text-zinc-500 bg-zinc-100 rounded-full border border-white" />
            </button>
          );
        }
        return (
          <button
            onClick={() => {
              // Mock toggle
              toast.success(`Automação ${!isEnabled ? 'ativada' : 'desativada'} para esta cobrança.`);
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${isEnabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
            title={isEnabled ? 'Robô ativo' : 'Robô inativo'}
          >
            <IconBot className="w-4 h-4" />
          </button>
        );
      }
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end gap-2">
            {plan === 'FREE' && row.original.status !== 'PAID' && (
              <button
                onClick={() => {
                  const text = `Olá ${row.original.debtorName}, a cobrança no valor de ${formatMoney(row.original.amount)} vence dia ${format(new Date(row.original.dueDate), 'dd/MM/yyyy')}.`;
                  window.open(`https://wa.me/${row.original.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                  toast.success('Redirecionando para WhatsApp Web...');
                }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <IconSend className="w-3 h-3" /> Cobrar
              </button>
            )}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">
                  <IconMoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="end" className="min-w-[180px] bg-white rounded-xl shadow-xl border border-zinc-100 p-1.5 text-sm z-50 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95">
                  <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer hover:bg-zinc-50 rounded-lg text-zinc-700 font-medium">
                    <IconExternalLink className="w-4 h-4 text-zinc-400" /> Ver Detalhes
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer hover:bg-zinc-50 rounded-lg text-zinc-700 font-medium" onClick={() => {
                    navigator.clipboard.writeText(`https://recebefacil.com/p/${row.original.id}`);
                    toast.success('Link de pagamento copiado!');
                  }}>
                    <IconCopy className="w-4 h-4 text-zinc-400" /> Copiar Link
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-zinc-100 my-1" />
                  <DropdownMenu.Item 
                    className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer hover:bg-red-50 rounded-lg text-red-600 font-medium"
                    onClick={async () => {
                      try {
                        await api.delete(`/charges/${row.original.id}`);
                        setData(prev => prev.map(c => c.id === row.original.id ? { ...c, status: 'CANCELED' } : c));
                        toast.success('Cobrança cancelada.');
                      } catch {
                        toast.error('Erro ao cancelar.');
                      }
                    }}
                  >
                    <IconTrash className="w-4 h-4 text-red-500" /> Cancelar Cobrança
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        );
      }
    })
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { rowSelection },
    enableRowSelection: plan !== 'FREE' && plan !== 'STARTER',
    onRowSelectionChange: setRowSelection,
    getRowId: row => row.id,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const showBulkActions = selectedRows.length > 0;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Cobranças</h1>
          <p className="text-zinc-500 mt-1">Gerencie seus recebimentos e automações.</p>
        </div>
        <button
          onClick={() => {
            if (usage.count >= usage.limit) {
              toast.error(`Você atingiu o limite de ${usage.limit} cobranças do plano ${plan}. Faça upgrade para continuar!`);
            } else {
              setDrawerOpen(true);
            }
          }}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${usage.count >= usage.limit ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 active:scale-95'}`}
        >
          <IconPlus className="w-5 h-5" /> Nova Cobrança
        </button>
      </div>

      {/* UPSELL / USAGE CARD (Apenas para FREE e STARTER) */}
      {(plan === 'FREE' || plan === 'STARTER') && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">PLANO {plan}</span>
              {usage.count >= usage.limit && <span className="bg-red-100 text-red-700 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">Limite Atingido</span>}
            </div>
            <h3 className="text-zinc-900 font-bold mb-3">Você usou {usage.count} das {usage.limit} cobranças deste mês.</h3>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-1000 ${usage.count >= usage.limit ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min((usage.count / usage.limit) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button className="w-full md:w-auto px-6 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold hover:bg-green-100 transition-colors shadow-sm">
              Fazer Upgrade
            </button>
          </div>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative">
          <IconSearch className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <input 
            type="date" 
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-white text-zinc-600 border border-zinc-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm mr-2"
          />
          <button onClick={() => setStatusFilter('ALL')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap shadow-sm ${statusFilter === 'ALL' ? 'bg-zinc-900 text-white shadow-zinc-900/20' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'}`}>Todas</button>
          <button onClick={() => setStatusFilter('PENDING')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap shadow-sm ${statusFilter === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'}`}>Pendentes</button>
          <button onClick={() => setStatusFilter('OVERDUE')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap shadow-sm ${statusFilter === 'OVERDUE' ? 'bg-red-100 text-red-800' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'}`}>Atrasadas</button>
          <button onClick={() => setStatusFilter('PAID')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap shadow-sm ${statusFilter === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'}`}>Pagas</button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-zinc-200 bg-zinc-50/50">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-5 py-4 text-xs font-bold tracking-wider text-zinc-500 uppercase whitespace-nowrap">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className={`border-b border-zinc-100 transition-colors hover:bg-zinc-50/80 cursor-pointer ${row.getIsSelected() ? 'bg-green-50/40' : ''}`}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('input[type="checkbox"]')) return;
                    router.push(`/dashboard/charges/${row.original.id}`);
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-5 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-24 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                        <IconSearch className="w-8 h-8 text-zinc-300" />
                      </div>
                      <h3 className="text-lg font-bold text-zinc-900 mb-1">Nenhuma cobrança encontrada</h3>
                      <p className="text-sm text-zinc-500 mb-6">Você ainda não possui cobranças que correspondam a este filtro. Que tal criar uma nova?</p>
                      <button 
                        onClick={() => {
                          if (usage.count >= usage.limit) {
                            toast.error('Limite de cobranças atingido.');
                          } else {
                            setDrawerOpen(true);
                          }
                        }} 
                        className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors ${usage.count >= usage.limit ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                      >
                        Nova Cobrança
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bulk Actions Lock State (STARTER/FREE) */}
        {(plan === 'FREE' || plan === 'STARTER') && (
          <div className="bg-zinc-50/80 border-t border-zinc-200 p-4 flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500 flex items-center gap-2">
              <IconLock className="w-4 h-4 text-zinc-400" /> Seleção em massa bloqueada no plano {plan}.
            </p>
            <button className="text-sm font-bold text-green-600 hover:text-green-700 underline underline-offset-2">Conhecer PRO</button>
          </div>
        )}
      </div>

      {/* FLOATING ACTION BAR (Bulk Actions para PRO/UNLIMITED) */}
      {showBulkActions && (plan === 'PRO' || plan === 'UNLIMITED') && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90vw] md:w-auto max-w-2xl bg-zinc-900 text-white rounded-2xl shadow-2xl shadow-zinc-900/30 px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row items-center gap-3 md:gap-6 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex items-center gap-3 md:border-r border-zinc-700 md:pr-6">
            <span className="flex items-center justify-center bg-green-500 text-zinc-900 w-6 h-6 rounded-full text-xs font-bold">
              {selectedRows.length}
            </span>
            <span className="font-semibold text-sm">Selecionados</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                const ids = selectedRows.map(r => r.original.id);
                try {
                  await api.post('/charges/bulk/remind', { chargeIds: ids });
                  toast.success(`${ids.length} lembretes disparados via WhatsApp!`);
                  table.resetRowSelection();
                } catch {
                  toast.error('Erro ao disparar.');
                }
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg transition-colors"
            >
              Enviar Lembretes
            </button>
            <button 
              onClick={async () => {
                const ids = selectedRows.map(r => r.original.id);
                try {
                  await api.post('/charges/bulk/cancel', { chargeIds: ids });
                  setData(prev => prev.map(c => ids.includes(c.id) ? { ...c, status: 'CANCELED' } : c));
                  toast.success(`${ids.length} cobranças canceladas.`);
                  table.resetRowSelection();
                } catch {
                  toast.error('Erro ao cancelar.');
                }
              }}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-lg transition-colors"
            >
              Cancelar Cobranças
            </button>
          </div>
        </div>
      )}

      <NewChargeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        planType={plan}
        onSuccess={() => {
          setDrawerOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}
