'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  IconPlus, IconSearch, IconMoreVertical, IconTrash, IconExternalLink,
} from '@/components/ui/Icons';
import { formatMoney, maskPhone } from '@/lib/formatters';
import { deleteClientAction } from '@/app/actions/clients';
import { Input } from '@/components/ui/Input/Input';
import { NewClientModal } from '@/components/forms/NewClientModal';
import { ClientDetailsModal } from '@/components/dashboard/ClientDetailsModal';
import { NewChargeModal } from '@/components/forms/NewChargeModal';
import { ChargeDetailsDrawer } from '@/components/dashboard/ChargeDetailsDrawer';

type Client = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  initials: string;
  totalCharges: number;
  totalPending: number;
  createdAt: string;
};

const columnHelper = createColumnHelper<Client>();

export function ClientsClient({
  initialData,
  plan,
}: {
  initialData: Client[];
  plan: 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED';
}) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [newChargeOpen, setNewChargeOpen] = useState(false);
  const [chargePreFill, setChargePreFill] = useState<{ name: string; phone: string } | undefined>();
  const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null);

  useEffect(() => { setData(initialData); }, [initialData]);

  const filteredData = useMemo(() =>
    data.filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery.replace(/\D/g, ''))),
    [data, searchQuery]
  );

  const COLORS = [
    'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
    'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400',
    'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
    'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
  ];

  const columns = [
    columnHelper.accessor('name', {
      header: 'Cliente',
      cell: info => {
        const idx = data.findIndex(c => c.id === info.row.original.id) % COLORS.length;
        return (
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${COLORS[idx]}`}>
              {info.row.original.initials}
            </div>
            <div>
              <div className="font-bold text-zinc-700 dark:text-zinc-200">{info.getValue()}</div>
              {info.row.original.email && (
                <div className="text-xs text-zinc-400 dark:text-zinc-500">{info.row.original.email}</div>
              )}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('phone', {
      header: 'WhatsApp',
      cell: info => (
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {maskPhone(info.getValue().replace(/^55/, ''))}
        </span>
      ),
    }),
    columnHelper.accessor('totalCharges', {
      header: 'Cobranças',
      cell: info => (
        <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('totalPending', {
      header: 'Em Aberto',
      cell: info => (
        <span className={`text-sm font-bold ${info.getValue() > 0 ? 'text-red-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
          {info.getValue() > 0 ? formatMoney(info.getValue()) : '—'}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Cadastrado em',
      cell: info => (
        <span className="text-sm text-zinc-400 dark:text-zinc-500">
          {format(new Date(info.getValue()), "dd 'de' MMM, yyyy", { locale: ptBR })}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                <IconMoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end" className="min-w-[180px] bg-surface dark:bg-[#1a2d42] rounded-xl shadow-xl border border-zinc-200/80 dark:border-white/8 p-1.5 text-sm z-50 animate-in fade-in zoom-in-95">
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg text-zinc-600 dark:text-zinc-300 font-medium"
                  onClick={() => setSelectedClientId(row.original.id)}
                >
                  <IconExternalLink className="w-4 h-4 text-zinc-400" /> Ver Detalhes
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg text-zinc-600 dark:text-zinc-300 font-medium"
                  onClick={() => {
                    setChargePreFill({ name: row.original.name, phone: row.original.phone });
                    setNewChargeOpen(true);
                  }}
                >
                  <IconPlus className="w-4 h-4 text-zinc-400" /> Nova Cobrança
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-zinc-200/80 dark:bg-white/6 my-1" />
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-600 dark:text-red-400 font-medium"
                  onClick={async () => {
                    const res = await deleteClientAction(row.original.id);
                    if (res.success) {
                      setData(prev => prev.filter(c => c.id !== row.original.id));
                      toast.success('Cliente removido.');
                    } else {
                      toast.error(res.error || 'Erro ao remover.');
                    }
                  }}
                >
                  <IconTrash className="w-4 h-4 text-red-500" /> Remover Cliente
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-800 dark:text-zinc-100 tracking-tight">Clientes</h1>
          <p className="text-zinc-400 dark:text-zinc-500 mt-1">Gerencie sua base de clientes.</p>
        </div>
        <button
          onClick={() => setNewClientOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold bg-zinc-900 dark:bg-green-500 text-white shadow-lg shadow-zinc-900/20 dark:shadow-green-500/20 hover:bg-zinc-800 dark:hover:bg-green-600 active:scale-95 transition-all"
        >
          <IconPlus className="w-5 h-5" /> Novo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="w-full sm:w-80">
        <Input
          icon={<IconSearch className="w-4 h-4" />}
          placeholder="Buscar por nome ou telefone..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-surface dark:bg-surface rounded-2xl border border-zinc-200/80 dark:border-white/7 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id} className="border-b border-zinc-200/80 dark:border-white/6 bg-zinc-100/50 dark:bg-white/2">
                  {hg.headers.map(h => (
                    <th key={h.id} className="px-5 py-4 text-xs font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase whitespace-nowrap">
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-100 dark:border-white/4 hover:bg-zinc-100/60 dark:hover:bg-white/3 transition-colors cursor-pointer"
                  onClick={e => {
                    if ((e.target as HTMLElement).closest('[role="menuitem"]') || (e.target as HTMLElement).closest('button')) return;
                    setSelectedClientId(row.original.id);
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
                      <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 mb-1">Nenhum cliente encontrado</h3>
                      <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-6">
                        {searchQuery ? 'Tente outro termo de busca.' : 'Sua base de clientes está vazia. Adicione seu primeiro cliente!'}
                      </p>
                      {!searchQuery && (
                        <button
                          onClick={() => setNewClientOpen(true)}
                          className="px-4 py-2 font-bold text-sm rounded-lg bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors"
                        >
                          Adicionar meu primeiro cliente
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewClientModal
        open={newClientOpen}
        onClose={() => setNewClientOpen(false)}
        onSuccess={() => { setNewClientOpen(false); router.refresh(); }}
      />

      <ClientDetailsModal
        clientId={selectedClientId}
        onClose={() => setSelectedClientId(null)}
        onNewCharge={(name, phone) => {
          setSelectedClientId(null);
          setChargePreFill({ name, phone });
          setNewChargeOpen(true);
        }}
        onChargeClick={chargeId => {
          setSelectedClientId(null);
          setSelectedChargeId(chargeId);
        }}
      />

      <NewChargeModal
        open={newChargeOpen}
        onClose={() => { setNewChargeOpen(false); setChargePreFill(undefined); }}
        planType={plan}
        prefilledDebtor={chargePreFill}
        onSuccess={() => { setNewChargeOpen(false); setChargePreFill(undefined); }}
      />

      <ChargeDetailsDrawer
        chargeId={selectedChargeId}
        onClose={() => setSelectedChargeId(null)}
      />
    </div>
  );
}


