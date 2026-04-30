'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  IconTrash,
  IconRepeat,
  IconFileText,
  IconSparkles,
  IconX
} from '@/components/ui/Icons';
import Link from 'next/link';
import { formatMoney, maskPhone } from '@/lib/formatters';
import { NewChargeModal } from '@/components/forms/NewChargeModal';
import { ChargeDetailsDrawer } from '@/components/dashboard/ChargeDetailsDrawer';
import { Input } from '@/components/ui/Input/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { toast } from 'sonner';
import { bulkCancelAction, bulkRemindAction, deleteChargeAction, updateChargeStatusAction } from '@/app/actions/charges';
import { UpgradeModal } from '@/components/ui/UpgradeModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { AutomacaoModal } from '@/components/forms/AutomacaoModal';

type Charge = {
  id: string;
  debtorName: string;
  phone: string;
  amount: number;
  dueDate: string;
  status: string;
  recurrence: 'ONCE' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  automationEnabled: boolean;
  recurringChargeId: string | null;
};

const columnHelper = createColumnHelper<Charge>();

export function ChargesClient({
  initialData,
  plan,
  usage,
  creditorProfile
}: {
  initialData: Charge[],
  plan: 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED',
  usage: { count: number, limit: number },
  creditorProfile?: any
}) {
  const [data, setData] = useState(initialData);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsChargeId, setDetailsChargeId] = useState<string | null>(null);
  const router = useRouter();
  const [rowSelection, setRowSelection] = useState({});
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [upgradeModule, setUpgradeModule] = useState<string | null>(null);
  const [automacaoModalOpen, setAutomacaoModalOpen] = useState(false);
  const [selectedRecurringId, setSelectedRecurringId] = useState<string | null>(null);
  const [automacaoChargePreview, setAutomacaoChargePreview] = useState<{ debtorName: string; amount: number; dueDate: string } | null>(null);
  const [deletingChargeId, setDeletingChargeId] = useState<string | null>(null);
  const [cancelingChargeId, setCancelingChargeId] = useState<string | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<{ chargeId: string; status: string; label: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
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
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            indeterminate={table.getIsSomeRowsSelected()}
            disabled={plan === 'FREE' || plan === 'STARTER'}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center w-full">
          <Checkbox
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
          <div className="font-bold text-zinc-700 dark:text-zinc-200">{info.getValue()}</div>
          <div className="text-xs text-zinc-400 dark:text-zinc-500">{maskPhone(info.row.original.phone.replace(/^55/, ''))}</div>
        </div>
      )
    }),
    columnHelper.accessor('amount', {
      header: 'Valor',
      cell: info => <div className="font-semibold text-zinc-600 dark:text-zinc-300">{formatMoney(info.getValue())}</div>
    }),
    columnHelper.accessor('dueDate', {
      header: 'Vencimento',
      cell: info => <div className="text-sm text-zinc-500 dark:text-zinc-400">{format(new Date(info.getValue()), "dd 'de' MMM, yyyy", { locale: ptBR })}</div>
    }),
    columnHelper.accessor('recurrence', {
      header: 'Recorrência',
      cell: info => {
        const labels = { ONCE: '1× Única', WEEKLY: 'Semanal', MONTHLY: 'Mensal', YEARLY: 'Anual' };
        return <div className="text-sm text-zinc-500 dark:text-zinc-400">{labels[info.getValue()] ?? info.getValue()}</div>;
      }
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        if (status === 'PAID') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400"><IconCheckCircle className="w-3 h-3" /> Pago</span>;
        if (status === 'OVERDUE') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400"><IconAlertCircle className="w-3 h-3" /> Atrasado</span>;
        if (status === 'CANCELED') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-500 dark:bg-white/8 dark:text-zinc-400"><IconX className="w-3 h-3" /> Cancelada</span>;
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400"><IconClock className="w-3 h-3" /> Pendente</span>;
      }
    }),
    columnHelper.accessor('automationEnabled', {
      header: 'Automação',
      cell: info => {
        const isEnabled = info.getValue();
        const isLocked = plan === 'FREE' || plan === 'STARTER';
        const recurringId = info.row.original.recurringChargeId;
        const hasAutomation = !!recurringId;
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isLocked) {
                setUpgradeModule('RECURRENCE');
              } else if (!hasAutomation) {
                toast.info('Esta cobrança não possui recorrência configurada.');
              } else {
                setSelectedRecurringId(recurringId);
                setAutomacaoChargePreview({
                  debtorName: info.row.original.debtorName,
                  amount: info.row.original.amount,
                  dueDate: info.row.original.dueDate,
                });
                setAutomacaoModalOpen(true);
              }
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${isEnabled ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30' : 'bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'} relative`}
            title={isLocked ? 'Requer plano PRO ou superior' : isEnabled ? 'Editar automação' : 'Sem automação'}
          >
            <IconBot className="w-4 h-4" />
            {isLocked && (
              <IconLock className="w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 text-zinc-500 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-white/10" />
            )}
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
                <button className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <IconMoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="end" className="min-w-[190px] bg-surface dark:bg-surface border border-zinc-200/80 dark:border-white/10 shadow-2xl p-1.5 text-sm z-50 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95">
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg text-zinc-600 dark:text-zinc-300 font-medium"
                    onClick={() => setDetailsChargeId(row.original.id)}
                  >
                    <IconExternalLink className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> Ver Detalhes
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg text-zinc-600 dark:text-zinc-300 font-medium" onClick={() => {
                    navigator.clipboard.writeText(`https://recebefacil.com/p/${row.original.id}`);
                    toast.success('Link de pagamento copiado!');
                  }}>
                    <IconCopy className="w-4 h-4 text-zinc-400" /> Copiar Link
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="h-px bg-zinc-200/80 dark:bg-white/6 my-1" />

                  {/* Alterar status */}
                  {(['PENDING', 'PAID', 'OVERDUE'] as const)
                    .filter(s => s !== row.original.status)
                    .map(s => {
                      const labels: Record<string, string> = { PENDING: 'Marcar como Pendente', PAID: 'Marcar como Pago', OVERDUE: 'Marcar como Atrasado' };
                      const colors: Record<string, string> = {
                        PENDING: 'hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-600 dark:text-amber-400',
                        PAID: 'hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                        OVERDUE: 'hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400',
                      };
                      const icons: Record<string, React.ReactNode> = {
                        PENDING: <IconClock className="w-4 h-4" />,
                        PAID: <IconCheckCircle className="w-4 h-4" />,
                        OVERDUE: <IconAlertCircle className="w-4 h-4" />,
                      };
                      return (
                        <DropdownMenu.Item
                          key={s}
                          className={`flex items-center gap-2 px-3 py-2 outline-none cursor-pointer rounded-lg font-medium ${colors[s]}`}
                          onClick={() => setStatusUpdate({ chargeId: row.original.id, status: s, label: labels[s] })}
                        >
                          {icons[s]} {labels[s]}
                        </DropdownMenu.Item>
                      );
                    })
                  }

                  <DropdownMenu.Separator className="h-px bg-zinc-200/80 dark:bg-white/6 my-1" />

                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg text-zinc-500 dark:text-zinc-400 font-medium"
                    onClick={() => setCancelingChargeId(row.original.id)}
                  >
                    <IconTrash className="w-4 h-4" /> Cancelar Cobrança
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-600 dark:text-red-400 font-medium"
                    onClick={() => setDeletingChargeId(row.original.id)}
                  >
                    <IconX className="w-4 h-4" /> Excluir Permanentemente
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
          <h1 className="text-3xl font-extrabold text-zinc-800 dark:text-zinc-100 tracking-tight">Cobranças</h1>
          <p className="text-zinc-400 dark:text-zinc-500 mt-1">Gerencie seus recebimentos e automações.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold border border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-white/5 cursor-not-allowed opacity-70">
            <IconFileText className="w-5 h-5" />
            Importar Excel
            <span className="bg-zinc-200 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">Breve</span>
          </div>
          <Link
            href="/dashboard/cobrancas/templates"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all"
          >
            <IconSparkles className="w-5 h-5" />
            Templates
          </Link>
          <Link
            href={plan === 'FREE' || plan === 'STARTER' ? '#' : "/dashboard/cobrancas/recorrentes"}
            onClick={(e) => {
              if (plan === 'FREE' || plan === 'STARTER') {
                e.preventDefault();
                setUpgradeModule('RECURRENCE');
              }
            }}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold border border-zinc-200 dark:border-white/10 transition-all ${(plan === 'FREE' || plan === 'STARTER') ? 'bg-zinc-50 dark:bg-white/5 text-zinc-400' : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5'}`}
          >
            {(plan === 'FREE' || plan === 'STARTER') ? <IconLock className="w-5 h-5" /> : <IconRepeat className="w-5 h-5" />}
            Regras de Recorrência
          </Link>
          <button
            onClick={() => {
              if (usage.count >= usage.limit) {
                toast.error(`Você atingiu o limite de ${usage.limit} cobranças do plano ${plan}. Faça upgrade para continuar!`);
              } else {
                setDrawerOpen(true);
              }
            }}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${usage.count >= usage.limit ? 'bg-zinc-200 dark:bg-white/10 text-zinc-400 dark:text-zinc-600 cursor-not-allowed' : 'bg-zinc-900 dark:bg-green-500 text-white shadow-lg shadow-zinc-900/20 dark:shadow-green-500/20 hover:bg-zinc-800 dark:hover:bg-green-600 active:scale-95'}`}
          >
            <IconPlus className="w-5 h-5" /> Nova Cobrança
          </button>
        </div>
      </div>

      {/* UPSELL / USAGE CARD (Apenas para FREE e STARTER) */}
      {(plan === 'FREE' || plan === 'STARTER') && (
        <div className="bg-surface dark:bg-surface border border-zinc-200/80 dark:border-white/7 rounded-2xl p-5 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">PLANO {plan}</span>
              {usage.count >= usage.limit && <span className="bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">Limite Atingido</span>}
            </div>
            <h3 className="text-zinc-700 dark:text-zinc-200 font-bold mb-3">Você usou {usage.count} das {usage.limit} cobranças deste mês.</h3>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-200 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-1000 ${usage.count >= usage.limit ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min((usage.count / usage.limit) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button className="w-full md:w-auto px-6 py-2.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30 rounded-xl font-bold hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors shadow-sm">
              Fazer Upgrade
            </button>
          </div>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="w-full sm:w-80">
          <Input
            icon={<IconSearch className="w-4 h-4" />}
            placeholder="Buscar cliente..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="mr-2"
          />
          <button onClick={() => setStatusFilter('ALL')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap shadow-sm ${statusFilter === 'ALL' ? 'bg-zinc-900 text-white shadow-zinc-900/20' : 'bg-surface dark:bg-surface-soft text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-white/7 hover:bg-zinc-100 dark:hover:bg-white/5'}`}>Todas</button>
          <button onClick={() => setStatusFilter('PENDING')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap shadow-sm ${statusFilter === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400' : 'bg-surface dark:bg-surface-soft text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-white/7 hover:bg-zinc-100 dark:hover:bg-white/5'}`}>Pendentes</button>
          <button onClick={() => setStatusFilter('OVERDUE')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap shadow-sm ${statusFilter === 'OVERDUE' ? 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400' : 'bg-surface dark:bg-surface-soft text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-white/7 hover:bg-zinc-100 dark:hover:bg-white/5'}`}>Atrasadas</button>
          <button onClick={() => setStatusFilter('PAID')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap shadow-sm ${statusFilter === 'PAID' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-surface dark:bg-surface-soft text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-white/7 hover:bg-zinc-100 dark:hover:bg-white/5'}`}>Pagas</button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-surface dark:bg-surface rounded-2xl border border-zinc-200/80 dark:border-white/7 shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-zinc-200/80 dark:border-white/6 bg-zinc-100/50 dark:bg-white/2">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-5 py-4 text-xs font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase whitespace-nowrap">
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
                  className={`border-b border-zinc-100 dark:border-white/4 transition-colors hover:bg-zinc-100/60 dark:hover:bg-white/3 cursor-pointer ${row.getIsSelected() ? 'bg-green-50/40 dark:bg-green-500/5' : ''}`}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button, a, input, [role="menuitem"], [data-radix-collection-item]')) return;
                    setDetailsChargeId(row.original.id);
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
                      <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <IconSearch className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                      </div>
                      <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 mb-1">Nenhuma cobrança encontrada</h3>
                      <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-6">Você ainda não possui cobranças que correspondam a este filtro. Que tal criar uma nova?</p>
                      <button 
                        onClick={() => {
                          if (usage.count >= usage.limit) {
                            toast.error('Limite de cobranças atingido.');
                          } else {
                            setDrawerOpen(true);
                          }
                        }} 
                        className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors ${usage.count >= usage.limit ? 'bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-600 cursor-not-allowed' : 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20'}`}
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
          <div className="bg-zinc-100/60 dark:bg-white/2 border-t border-zinc-200/80 dark:border-white/6 p-4 flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
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
                  const res = await bulkRemindAction(ids);
                  if (res.success) {
                    toast.success(`${ids.length} lembretes disparados via WhatsApp!`);
                    table.resetRowSelection();
                  } else {
                    toast.error(res.error || 'Erro ao disparar.');
                  }
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
                  const res = await bulkCancelAction(ids);
                  if (res.success) {
                    setData(prev => prev.map(c => ids.includes(c.id) ? { ...c, status: 'CANCELED' } : c));
                    toast.success(`${ids.length} cobranças canceladas.`);
                    table.resetRowSelection();
                  } else {
                    toast.error(res.error || 'Erro ao cancelar.');
                  }
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

      <NewChargeModal
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        planType={plan}
        creditorProfile={creditorProfile}
        userName={creditorProfile?.business_name || 'Minha Empresa'}
        onSuccess={() => {
          setDrawerOpen(false);
          router.refresh();
        }}
      />

      <ChargeDetailsDrawer
        chargeId={detailsChargeId}
        onClose={() => setDetailsChargeId(null)}
      />

      {upgradeModule && (
        <UpgradeModal
          moduleName={upgradeModule}
          onClose={() => setUpgradeModule(null)}
        />
      )}

      {/* Cancelar cobrança */}
      <ConfirmModal
        open={!!cancelingChargeId}
        title="Cancelar cobrança?"
        description="A cobrança será marcada como cancelada. Cobranças canceladas não geram novas notificações."
        confirmLabel="Sim, cancelar"
        variant="danger"
        loading={actionLoading}
        onConfirm={async () => {
          if (!cancelingChargeId) return;
          setActionLoading(true);
          const res = await bulkCancelAction([cancelingChargeId]);
          setActionLoading(false);
          if (res.success) {
            toast.success('Cobrança cancelada.');
            setData(prev => prev.map(c => c.id === cancelingChargeId ? { ...c, status: 'CANCELED' } : c));
            setCancelingChargeId(null);
          } else {
            toast.error(res.error || 'Erro ao cancelar.');
          }
        }}
        onCancel={() => setCancelingChargeId(null)}
      />

      {/* Alterar status */}
      <ConfirmModal
        open={!!statusUpdate}
        title={statusUpdate?.label ?? 'Alterar status?'}
        description="O status da cobrança será atualizado imediatamente."
        confirmLabel="Confirmar"
        variant="primary"
        loading={actionLoading}
        onConfirm={async () => {
          if (!statusUpdate) return;
          setActionLoading(true);
          const res = await updateChargeStatusAction(statusUpdate.chargeId, statusUpdate.status);
          setActionLoading(false);
          if (res.success) {
            toast.success('Status atualizado.');
            setData(prev => prev.map(c => c.id === statusUpdate.chargeId ? { ...c, status: statusUpdate.status } : c));
            setStatusUpdate(null);
          } else {
            toast.error(res.error || 'Erro ao atualizar status.');
          }
        }}
        onCancel={() => setStatusUpdate(null)}
      />

      {/* Excluir permanentemente */}
      <ConfirmModal
        open={!!deletingChargeId}
        title="Excluir cobrança permanentemente?"
        description="Esta ação não pode ser desfeita. A cobrança e todo seu histórico de mensagens serão removidos."
        confirmLabel="Sim, excluir"
        variant="danger"
        loading={actionLoading}
        onConfirm={async () => {
          if (!deletingChargeId) return;
          setActionLoading(true);
          const res = await deleteChargeAction(deletingChargeId);
          setActionLoading(false);
          if (res.success) {
            toast.success('Cobrança excluída.');
            setData(prev => prev.filter(c => c.id !== deletingChargeId));
            setDeletingChargeId(null);
          } else {
            toast.error(res.error || 'Erro ao excluir.');
          }
        }}
        onCancel={() => setDeletingChargeId(null)}
      />

      {automacaoModalOpen && selectedRecurringId && (
        <AutomacaoModal
          isOpen={automacaoModalOpen}
          onClose={() => { setAutomacaoModalOpen(false); setSelectedRecurringId(null); setAutomacaoChargePreview(null); }}
          recurringChargeId={selectedRecurringId}
          initialData={automacaoChargePreview ? {
            frequency: 'MONTHLY',
            description: '',
            nextGenerationDate: automacaoChargePreview.dueDate,
            debtorName: automacaoChargePreview.debtorName,
            amount: automacaoChargePreview.amount,
          } : undefined}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
}


