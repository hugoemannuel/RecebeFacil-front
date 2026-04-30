'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  IconPlus,
  IconSearch,
  IconMoreVertical,
  IconTrash,
  IconEdit,
  IconCheckCircle,
  IconArrowLeft,
  IconSparkles,
  IconLock,
  IconX
} from '@/components/ui/Icons';
import Link from 'next/link';
import { Input } from '@/components/ui/Input/Input';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { UpgradeModal } from '@/components/ui/UpgradeModal';
import { 
  createTemplateAction, 
  updateTemplateAction, 
  deleteTemplateAction 
} from '@/app/actions/templates';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Chip } from '@/components/ui/Chip';

interface Template {
  id: string;
  name: string;
  body: string;
  trigger: string;
  is_default: boolean;
  is_system?: boolean;
}

export function TemplatesClient({ 
  initialData, 
  plan 
}: { 
  initialData: Template[], 
  plan: string 
}) {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [upgradeModule, setUpgradeModule] = useState<string | null>(null);
  
  const router = useRouter();

  const filteredData = data.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLocked = plan === 'FREE';

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      body: formData.get('body') as string,
      is_default: formData.get('is_default') === 'on',
    };

    if (!payload.name || !payload.body) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    setActionLoading(true);
    try {
      if (editingTemplate && !editingTemplate.is_system) {
        const res = await updateTemplateAction(editingTemplate.id, payload);
        if (res.success) {
          toast.success('Template atualizado!');
          setData(prev => prev.map(t => t.id === editingTemplate.id ? { ...t, ...payload } : t));
          setIsModalOpen(false);
        } else {
          toast.error(res.error || 'Erro ao atualizar.');
        }
      } else {
        const res = await createTemplateAction(payload);
        if (res.success) {
          toast.success('Template criado!');
          setData(prev => [...prev, res.data]);
          setIsModalOpen(false);
        } else {
          toast.error(res.error || 'Erro ao criar.');
        }
      }
    } catch {
      toast.error('Erro de conexão.');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    setActionLoading(true);
    try {
      const res = await deleteTemplateAction(deletingId);
      if (res.success) {
        toast.success('Template excluído.');
        setData(prev => prev.filter(t => t.id !== deletingId));
        setDeletingId(null);
      } else {
        toast.error(res.error || 'Erro ao excluir.');
      }
    } catch {
      toast.error('Erro de conexão.');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/dashboard/cobrancas" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors text-sm font-bold mb-2">
            <IconArrowLeft className="w-4 h-4" /> Voltar para Cobranças
          </Link>
          <h1 className="text-3xl font-extrabold text-zinc-800 dark:text-zinc-100 tracking-tight">Templates de Mensagem</h1>
          <p className="text-zinc-400 dark:text-zinc-500 mt-1">Personalize os textos enviados via WhatsApp.</p>
        </div>
        <button
          onClick={() => {
            if (isLocked) {
              setUpgradeModule('CUSTOM_TEMPLATES');
            } else {
              setEditingTemplate(null);
              setIsModalOpen(true);
            }
          }}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isLocked ? 'bg-zinc-100 dark:bg-white/5 text-zinc-400' : 'bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600 active:scale-95'}`}
        >
          {isLocked ? <IconLock className="w-5 h-5" /> : <IconPlus className="w-5 h-5" />}
          Novo Template
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="w-full sm:w-80">
        <Input
          icon={<IconSearch className="w-4 h-4" />}
          placeholder="Buscar nos templates..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map(template => (
          <div key={template.id} className={`group relative flex flex-col bg-surface dark:bg-surface border ${template.is_default ? 'border-green-500/30' : 'border-zinc-200/80 dark:border-white/7'} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-zinc-800 dark:text-zinc-100 line-clamp-1">{template.name}</h3>
                  {template.is_default && (
                    <span className="bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400 text-[10px] uppercase px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                      <IconCheckCircle className="w-3 h-3" /> Padrão
                    </span>
                  )}
                  {template.is_system && (
                    <span className="bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400 text-[10px] uppercase px-2 py-0.5 rounded-full font-extrabold">Sistema</span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-widest">{template.trigger}</p>
              </div>

              {!template.is_system && (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                      <IconMoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content align="end" className="min-w-[160px] bg-surface dark:bg-[#1a2d42] rounded-xl shadow-xl border border-zinc-200/80 dark:border-white/8 p-1.5 text-sm z-50">
                      <DropdownMenu.Item
                        className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg text-zinc-600 dark:text-zinc-300 font-medium"
                        onClick={() => {
                          setEditingTemplate(template);
                          setIsModalOpen(true);
                        }}
                      >
                        <IconEdit className="w-4 h-4" /> Editar
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-600 dark:text-red-400 font-medium"
                        onClick={() => setDeletingId(template.id)}
                      >
                        <IconTrash className="w-4 h-4" /> Excluir
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              )}
            </div>

            <div className="flex-1 bg-zinc-50 dark:bg-black/20 rounded-xl p-4 mb-4 overflow-hidden">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap line-clamp-6 italic leading-relaxed">
                "{template.body}"
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['{{nome}}', '{{valor}}', '{{vencimento}}'].map(v => (
                <span key={v} className="text-[10px] bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded font-mono">
                  {v}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <IconSparkles className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
          </div>
          <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-200 mb-1">Nenhum template encontrado</h3>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-xs mx-auto">
            {searchQuery ? 'Tente mudar o termo de busca.' : 'Você ainda não possui templates personalizados.'}
          </p>
        </div>
      )}

      {/* MODAL EDIT/CREATE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-surface dark:bg-surface rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100 dark:border-white/7">
              <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                {editingTemplate ? 'Editar Template' : 'Novo Template'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <IconX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div>
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-2">Nome do Template</label>
                <input
                  name="name"
                  defaultValue={editingTemplate?.name}
                  placeholder="Ex: Lembrete de Atraso"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/7 bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-100 focus:ring-2 focus:ring-green-500/30 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-2">Corpo da Mensagem</label>
                <textarea
                  name="body"
                  defaultValue={editingTemplate?.body}
                  rows={8}
                  placeholder="Use {{nome}}, {{valor}}, {{vencimento}}..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/7 bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-100 focus:ring-2 focus:ring-green-500/30 transition-all outline-none resize-none text-sm leading-relaxed"
                  required
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {['{{nome}}', '{{valor}}', '{{vencimento}}', '{{descricao}}'].map(v => (
                    <Chip key={v} label={v} onClick={() => {
                      const el = document.querySelector('textarea[name="body"]') as HTMLTextAreaElement;
                      if (el) {
                        const start = el.selectionStart;
                        const end = el.selectionEnd;
                        el.value = el.value.slice(0, start) + v + el.value.slice(end);
                        el.focus();
                      }
                    }} />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_default"
                  id="is_default"
                  defaultChecked={editingTemplate?.is_default}
                  className="w-4 h-4 rounded border-zinc-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="is_default" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
                  Definir como template padrão para cobranças manuais
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Salvando...' : 'Salvar Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      <ConfirmModal
        open={!!deletingId}
        title="Excluir Template?"
        description="Esta ação removerá o template permanentemente. Você não poderá mais selecioná-lo para novas cobranças."
        confirmLabel="Sim, excluir"
        variant="danger"
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />

      {/* UPGRADE MODAL */}
      {upgradeModule && (
        <UpgradeModal
          moduleName={upgradeModule}
          onClose={() => setUpgradeModule(null)}
        />
      )}
    </div>
  );
}
