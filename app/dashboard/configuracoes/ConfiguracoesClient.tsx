'use client';

import { useState, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/layout/ThemeToggle/ThemeToggle';
import {
  IconUser, IconMail, IconPhone, IconCamera, IconShieldCheck,
  IconCreditCard, IconTrash, IconCheck,
  IconAlertOctagon, IconSun, IconMoon,
} from '@/components/ui/Icons';
import {
  updateProfileAction,
  uploadAvatarAction,
  updatePasswordAction,
  deleteAccountAction,
} from '@/app/actions/profile';
import { RHFInput } from '@/components/forms/rhf/RHFInput';
import { RHFPasswordInput } from '@/components/forms/rhf/RHFPasswordInput';
import { Input } from '@/components/ui/Input/Input';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

// ─── Tipos ────────────────────────────────────────────────────────────
interface Props {
  profile: { id: string; name: string; email: string; phone: string; avatar_url?: string } | null;
  subscription: { plan: string; status: string; sentThisMonth?: number; current_period_end?: string } | null;
}

const PLAN_LIMIT: Record<string, number> = { FREE: 10, STARTER: 100, PRO: 500, UNLIMITED: Infinity };
const PLAN_COLOR: Record<string, string> = {
  FREE: 'from-zinc-700 to-zinc-900',
  STARTER: 'from-blue-600 to-blue-900',
  PRO: 'from-green-600 to-green-900',
  UNLIMITED: 'from-purple-600 to-purple-900',
};
const PLAN_LABEL: Record<string, string> = { FREE: 'Free', STARTER: 'Starter', PRO: 'Pro', UNLIMITED: 'Unlimited' };

// ─── Schemas ──────────────────────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Informe sua senha atual'),
  new_password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirm_password: z.string(),
}).refine(d => d.new_password === d.confirm_password, {
  message: 'As senhas não coincidem',
  path: ['confirm_password'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

// ─── Componente ───────────────────────────────────────────────────────
export function ConfiguracoesClient({ profile, subscription }: Props) {
  const [tab, setTab] = useState<'perfil' | 'plano' | 'seguranca'>('perfil');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url ?? null);
  const [showDelete, setShowDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const plan = subscription?.plan ?? 'FREE';
  const sent = subscription?.sentThisMonth ?? 0;
  const limit = PLAN_LIMIT[plan] ?? 10;
  const usagePct = limit === Infinity ? 5 : Math.min((sent / limit) * 100, 100);

  // ── Perfil Form ───────────────────────────────────────────────────
  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile?.name ?? '', email: profile?.email ?? '' },
  });

  function onSaveProfile(data: ProfileForm) {
    startTransition(async () => {
      const res = await updateProfileAction(data);
      if (res.success) toast.success('Perfil atualizado com sucesso!');
      else toast.error(res.error ?? 'Ops, algo deu errado. Tente novamente.');
    });
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    startTransition(async () => {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadAvatarAction(fd);
      if (res.success) toast.success('Foto atualizada!');
      else toast.error(res.error ?? 'Erro ao enviar foto.');
    });
  }

  // ── Senha Form ────────────────────────────────────────────────────
  const pwForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: '', new_password: '', confirm_password: '' },
  });

  function onChangePassword(data: PasswordForm) {
    startTransition(async () => {
      const res = await updatePasswordAction({ current_password: data.current_password, new_password: data.new_password });
      if (res.success) { toast.success('Senha alterada com sucesso!'); pwForm.reset(); }
      else toast.error(res.error ?? 'Ops, algo deu errado. Tente novamente.');
    });
  }

  // ── Delete Account ────────────────────────────────────────────────
  function onDeleteAccount() {
    startTransition(async () => {
      await deleteAccountAction();
    });
  }

  // ─── Render ────────────────────────────────────────────────────────
  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: IconUser },
    { id: 'plano', label: 'Plano', icon: IconCreditCard },
    { id: 'seguranca', label: 'Segurança', icon: IconShieldCheck },
  ] as const;

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-200">Configurações</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Gerencie sua conta e preferências</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Dark mode hint card */}
      <div className="flex items-center gap-3 bg-zinc-50 dark:bg-[#152336] border border-zinc-200 dark:border-white/5 rounded-2xl px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-300">
        {theme === 'light'
          ? <IconMoon className="w-4 h-4 shrink-0" />
          : <IconSun className="w-4 h-4 shrink-0 text-amber-400" />}
        <span>
          Modo <strong className="text-zinc-700 dark:text-zinc-200">{theme === 'light' ? 'claro' : 'escuro'}</strong> ativo — alterne pelo botão acima ou no cabeçalho.
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100/70 dark:bg-[#0f1c2b] p-1 rounded-2xl border border-zinc-200/60 dark:border-white/[0.06] transition-colors duration-300">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${tab === id
              ? 'bg-white dark:bg-[#1a2d42] text-zinc-800 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── ABA: PERFIL ─────────────────────────────────────────────── */}
      {tab === 'perfil' && (
        <div className="bg-white dark:bg-[#152336] border border-zinc-100 dark:border-white/[0.06] rounded-3xl p-6 md:p-8 space-y-6 transition-colors duration-300">

          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative group w-20 h-20 shrink-0">
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Avatar" fill className="rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl font-extrabold text-green-700 dark:text-green-400">
                  {(profile?.name ?? 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
              >
                <IconCamera className="w-5 h-5 text-white" />
              </button>
            </div>
            <div>
              <p className="font-bold text-zinc-800 dark:text-zinc-200">{profile?.name ?? 'Usuário'}</p>
              <button
                onClick={() => fileRef.current?.click()}
                className="text-sm text-green-600 dark:text-green-400 hover:underline mt-0.5"
              >
                Alterar foto
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
            <RHFInput<ProfileForm>
              name="name"
              control={profileForm.control}
              label="Nome"
              icon={<IconUser className="w-4 h-4" />}
              placeholder="Seu nome completo"
            />

            <RHFInput<ProfileForm>
              name="email"
              control={profileForm.control}
              label="E-mail"
              type="email"
              icon={<IconMail className="w-4 h-4" />}
              placeholder="seu@email.com"
            />

            <div>
              <Input
                label="Telefone"
                value={profile?.phone ?? ''}
                readOnly
                icon={<IconPhone className="w-4 h-4" />}
                className="bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">Telefone vinculado à autenticação — não pode ser alterado.</p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-500/20 hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              {isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <IconCheck className="w-4 h-4" />
              )}
              Salvar alterações
            </button>
          </form>
        </div>
      )}

      {/* ── ABA: PLANO ──────────────────────────────────────────────── */}
      {tab === 'plano' && (
        <div className="space-y-4">

          <div className={`bg-gradient-to-br ${PLAN_COLOR[plan]} rounded-3xl p-6 md:p-8 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Seu plano atual</p>
            <p className="text-4xl font-extrabold tracking-tight">{PLAN_LABEL[plan]}</p>
            {subscription?.current_period_end && (
              <p className="text-sm text-white/60 mt-1">
                Renova em {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-[#152336] border border-zinc-100 dark:border-white/[0.06] rounded-3xl p-6 space-y-3 transition-colors duration-300">
            <div className="flex justify-between items-baseline">
              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">Cobranças este mês</p>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {sent} <span className="text-zinc-400 font-normal">/ {limit === Infinity ? '∞' : limit}</span>
              </p>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-white/10 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${usagePct >= 90 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
            {usagePct >= 90 && (
              <p className="text-xs text-red-500 font-medium">Você está próximo do limite. Considere fazer upgrade.</p>
            )}
          </div>

          <div className="bg-white dark:bg-[#152336] border border-zinc-100 dark:border-white/[0.06] rounded-3xl p-6 space-y-3 transition-colors duration-300">
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Incluído no seu plano</p>
            {[
              plan !== 'FREE' && 'Clientes ilimitados',
              plan !== 'FREE' && 'Relatórios avançados',
              plan !== 'FREE' && 'Importação de Excel',
              ['PRO', 'UNLIMITED'].includes(plan) && 'Cobranças recorrentes',
              plan === 'UNLIMITED' && 'Suporte prioritário',
            ].filter(Boolean).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <IconCheck className="w-4 h-4 text-green-500 shrink-0" />
                {item}
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <IconCheck className="w-4 h-4 text-green-500 shrink-0" />
              Cobranças via WhatsApp
            </div>
          </div>

          {plan !== 'UNLIMITED' && (
            <Link
              href="/planos"
              className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-green-500/20 hover:scale-[1.01]"
            >
              Fazer upgrade de plano →
            </Link>
          )}
        </div>
      )}

      {/* ── ABA: SEGURANÇA ──────────────────────────────────────────── */}
      {tab === 'seguranca' && (
        <div className="space-y-4">

          <div className="bg-white dark:bg-[#152336] border border-zinc-100 dark:border-white/[0.06] rounded-3xl p-6 md:p-8 transition-colors duration-300">
            <p className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">Alterar senha</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">Use uma senha forte com pelo menos 8 caracteres.</p>

            <form onSubmit={pwForm.handleSubmit(onChangePassword)} className="space-y-4">
              <RHFPasswordInput<PasswordForm>
                name="current_password"
                control={pwForm.control}
                label="Senha atual"
                placeholder="••••••••"
              />

              <RHFPasswordInput<PasswordForm>
                name="new_password"
                control={pwForm.control}
                label="Nova senha"
                placeholder="••••••••"
              />

              <RHFPasswordInput<PasswordForm>
                name="confirm_password"
                control={pwForm.control}
                label="Confirmar nova senha"
                placeholder="••••••••"
              />

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-500/20 hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                {isPending
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <IconShieldCheck className="w-4 h-4" />}
                Alterar senha
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-[#152336] border border-red-200 dark:border-red-500/20 rounded-3xl p-6 md:p-8 transition-colors duration-300">
            <div className="flex items-start gap-3 mb-4">
              <IconAlertOctagon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-600 dark:text-red-400">Zona de perigo</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Ao excluir sua conta, seus dados pessoais serão anonimizados. O histórico de cobranças é mantido para fins financeiros (LGPD).
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2.5 rounded-xl transition-colors border border-red-200 dark:border-red-500/30"
            >
              <IconTrash className="w-4 h-4" />
              Excluir minha conta
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={showDelete}
        title="Excluir conta?"
        description={
          <>
            Esta ação é <strong>irreversível</strong>. Seus dados pessoais serão anonimizados, mas o histórico de cobranças permanece para fins contábeis.
          </>
        }
        confirmLabel="Sim, excluir"
        variant="danger"
        loading={isPending}
        icon={
          <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-2xl flex items-center justify-center">
            <IconAlertOctagon className="w-6 h-6 text-red-500" />
          </div>
        }
        onConfirm={onDeleteAccount}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
