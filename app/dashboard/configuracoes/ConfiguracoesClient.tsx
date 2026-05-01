'use client';

import { useState, useRef, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeToggle } from '@/components/layout/ThemeToggle/ThemeToggle';
import {
  IconUser, IconMail, IconPhone, IconCamera, IconShieldCheck,
  IconCreditCard, IconTrash, IconCheck, IconWallet,
  IconAlertOctagon, IconSun, IconMoon, IconQrCode
} from '@/components/ui/Icons';
import {
  updateProfileAction,
  uploadAvatarAction,
  updatePasswordAction,
  deleteAccountAction,
  getCreditorProfileAction,
  updateCreditorProfileAction,
} from '@/app/actions/profile';
import { cancelSubscriptionAction } from '@/app/actions/subscription';
import { RHFInput } from '@/components/forms/rhf/RHFInput';
import { RHFPasswordInput } from '@/components/forms/rhf/RHFPasswordInput';
import { Input } from '@/components/ui/Input/Input';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useUserStore } from '@/store/useUserStore';

// ─── Tipos ────────────────────────────────────────────────────────────
interface Props {
  profile: { id: string; name: string; email: string; phone: string; avatar_url?: string } | null;
  subscription: { plan: string; status: string; sentThisMonth?: number; current_period_end?: string; cancel_at_period_end?: boolean } | null;
  creditorProfile: { business_name?: string; document?: string; pix_key?: string; pix_key_type?: string; pix_merchant_name?: string } | null;
}

const PLAN_LIMIT: Record<string, number> = { FREE: 10, STARTER: 50, PRO: 200, UNLIMITED: Infinity };
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

const creditorSchema = z.object({
  business_name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').optional().or(z.literal('')),
  document: z.string().optional().or(z.literal('')),
  pix_key: z.string().min(1, 'Chave PIX é obrigatória').optional().or(z.literal('')),
  pix_key_type: z.enum(['CPF', 'CNPJ', 'PHONE', 'EMAIL', 'EVP']).optional(),
  pix_merchant_name: z.string().max(25, 'Máximo 25 caracteres').optional().or(z.literal('')),
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;
type CreditorForm = z.infer<typeof creditorSchema>;

// ─── Componente ───────────────────────────────────────────────────────
export function ConfiguracoesClient({ profile, subscription, creditorProfile }: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const initialAvatar = profile?.avatar_url 
    ? (profile.avatar_url.startsWith('http') ? profile.avatar_url : `${apiUrl}${profile.avatar_url}`)
    : null;

  const [tab, setTab] = useState<'perfil' | 'recebimento' | 'plano' | 'seguranca'>('perfil');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatar);
  const [showDelete, setShowDelete] = useState(false);
  const [showCancelPlan, setShowCancelPlan] = useState(false);
  const [cancelPlanLoading, setCancelPlanLoading] = useState(false);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(subscription?.cancel_at_period_end ?? false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [creditorLoading, setCreditorLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  const { theme } = useThemeStore();
  const updateLocalUser = useUserStore(s => s.updateLocalUser);
  const updateLocalSubscription = useUserStore(s => s.updateLocalSubscription);
  const refreshStore = useUserStore(s => s.refresh);


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
    setProfileLoading(true);
    startTransition(async () => {
      if (avatarFile) {
        const fd = new FormData();
        fd.append('file', avatarFile);
        const avatarRes = await uploadAvatarAction(fd);
          if (!avatarRes.success) {
            toast.error(avatarRes.error ?? 'Erro ao enviar foto.');
            setAvatarPreview(initialAvatar);
            setAvatarFile(null);
            setProfileLoading(false);
            return;
          }
          if (avatarRes.data?.avatar_url) {
            updateLocalUser({ avatar_url: avatarRes.data.avatar_url });
          }
          setAvatarFile(null);
        }
      const res = await updateProfileAction(data);
      if (res.success) {
        updateLocalUser({ name: data.name });
        toast.success('Perfil atualizado com sucesso!');
        refreshStore(); // Garante sincronia total
      }
      else toast.error(res.error ?? 'Ops, algo deu errado. Tente novamente.');
      setProfileLoading(false);
    });
  }

  async function handleCancelPlan() {
    setCancelPlanLoading(true);
    const result = await cancelSubscriptionAction();
    if (result.success) {
      setCancelAtPeriodEnd(true);
      updateLocalSubscription({ cancel_at_period_end: true });
      toast.success('Plano cancelado. Acesso mantido até o fim do período.');
      refreshStore();
    } else {
      toast.error(result.error ?? 'Erro ao cancelar.');
    }
    setCancelPlanLoading(false);
    setShowCancelPlan(false);
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
    setAvatarFile(file);
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

  // ── Recebimento Form ─────────────────────────────────────────────
  const creditorForm = useForm<CreditorForm>({
    resolver: zodResolver(creditorSchema),
    defaultValues: {
      business_name: creditorProfile?.business_name ?? '',
      document: creditorProfile?.document ?? '',
      pix_key: creditorProfile?.pix_key ?? '',
      pix_key_type: (creditorProfile?.pix_key_type as any) ?? 'PHONE',
      pix_merchant_name: creditorProfile?.pix_merchant_name ?? '',
    },
  });

  function onSaveCreditor(data: CreditorForm) {
    setCreditorLoading(true);
    startTransition(async () => {
      const res = await updateCreditorProfileAction(data);
      if (res.success) toast.success('Configurações salvas!');
      else toast.error(res.error ?? 'Erro ao salvar.');
      setCreditorLoading(false);
    });
  }

  // ─── Render ────────────────────────────────────────────────────────
  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: IconUser },
    { id: 'recebimento', label: 'Recebimento', icon: IconWallet },
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
      <div className="flex items-center gap-3 bg-zinc-50 dark:bg-surface border border-zinc-200 dark:border-white/5 rounded-2xl px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-300">
        {!mounted ? (
          <div className="w-4 h-4 shrink-0" />
        ) : theme === 'light'
          ? <IconMoon className="w-4 h-4 shrink-0" />
          : <IconSun className="w-4 h-4 shrink-0 text-amber-400" />
        }
        <span>
          Modo <strong className="text-zinc-700 dark:text-zinc-200">{!mounted ? '...' : (theme === 'light' ? 'claro' : 'escuro')}</strong> ativo — alterne pelo botão acima ou no cabeçalho.
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100/70 dark:bg-surface-soft p-1 rounded-2xl border border-zinc-200/60 dark:border-white/6 transition-colors duration-300">
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
        <div className="bg-white dark:bg-surface border border-zinc-100 dark:border-white/6 rounded-3xl p-6 md:p-8 space-y-6 transition-colors duration-300">

          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative group w-20 h-20 shrink-0">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full rounded-full object-cover" />
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
                {avatarFile ? 'Foto selecionada — salve para confirmar' : 'Alterar foto'}
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
              disabled={profileLoading || (!profileForm.formState.isDirty && !avatarFile)}
              className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-500/20 hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              {profileLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <IconCheck className="w-4 h-4" />
              )}
              Salvar alterações
            </button>
          </form>
        </div>
      )}

      {/* ── ABA: RECEBIMENTO ────────────────────────────────────────── */}
      {tab === 'recebimento' && (
        <div className="bg-white dark:bg-surface border border-zinc-100 dark:border-white/6 rounded-3xl p-6 md:p-8 space-y-6 transition-colors duration-300">
          <div>
            <p className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">Dados de Recebimento</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">Configure como seus clientes verão sua empresa e como você receberá os pagamentos via PIX.</p>
          </div>

          <form onSubmit={creditorForm.handleSubmit(onSaveCreditor)} className="space-y-4">
            <RHFInput<CreditorForm>
              name="business_name"
              control={creditorForm.control}
              label="Nome da Empresa / Profissional"
              placeholder="Ex: Hugo Soluções Digitais"
              icon={<IconUser className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFInput<CreditorForm>
                name="pix_key"
                control={creditorForm.control}
                label="Chave PIX"
                placeholder="E-mail, CPF, CNPJ ou Telefone"
                icon={<IconQrCode className="w-4 h-4" />}
              />
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 ml-1">Tipo de Chave</label>
                <select
                  {...creditorForm.register('pix_key_type')}
                  className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-hidden focus:ring-2 focus:ring-green-500/20 transition-all"
                >
                  <option value="PHONE">Celular</option>
                  <option value="EMAIL">E-mail</option>
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                  <option value="EVP">Chave Aleatória</option>
                </select>
              </div>
            </div>

            <RHFInput<CreditorForm>
              name="pix_merchant_name"
              control={creditorForm.control}
              label="Nome no PIX (Máx 25 caracteres)"
              placeholder="Ex: HUGO SOLUCOES"
              icon={<IconUser className="w-4 h-4" />}
            />
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 -mt-2 ml-1">
              Este é o nome que aparecerá no aplicativo do banco do cliente ao escanear o QR Code.
            </p>

            <button
              type="submit"
              disabled={creditorLoading || !creditorForm.formState.isDirty}
              className="w-full bg-zinc-900 dark:bg-green-500 hover:bg-zinc-800 dark:hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-zinc-900/20 dark:shadow-green-500/20 hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              {creditorLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <IconCheck className="w-4 h-4" />
              )}
              Salvar chave PIX
            </button>
          </form>

          {/* Seção Asaas Split */}
          <div className="pt-6 border-t border-zinc-100 dark:border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold text-zinc-800 dark:text-zinc-200">Split via Plataforma (Asaas)</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Receba direto na sua conta Asaas com conciliação automática.</p>
              </div>
              {!['PRO', 'UNLIMITED'].includes(plan) && (
                <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">PRO+</span>
              )}
            </div>

            {['PRO', 'UNLIMITED'].includes(plan) ? (
              <div className="bg-zinc-50 dark:bg-white/2 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 flex flex-col items-center text-center">
                <IconWallet className="w-8 h-8 text-zinc-400 mb-3" />
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">Sua conta Asaas ainda não está conectada.</p>
                <button className="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30 px-6 py-2 rounded-xl font-bold hover:bg-green-100 transition-colors">
                  Conectar conta Asaas
                </button>
              </div>
            ) : (
              <div className="bg-zinc-100/50 dark:bg-white/2 border border-dashed border-zinc-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center text-center opacity-60">
                <IconShieldCheck className="w-8 h-8 text-zinc-300 mb-3" />
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">O recebimento automático via Split está disponível apenas nos planos Pro e Unlimited.</p>
                <Link href="/planos" className="text-sm font-bold text-green-600 hover:underline">
                  Ver planos →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ABA: PLANO ──────────────────────────────────────────────── */}
      {tab === 'plano' && (
        <div className="space-y-4">

          <div className={`bg-linear-to-br ${PLAN_COLOR[plan]} rounded-3xl p-6 md:p-8 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Seu plano atual</p>
            <p className="text-4xl font-extrabold tracking-tight">{PLAN_LABEL[plan]}</p>
            {subscription?.current_period_end && (
              <p className="text-sm text-white/60 mt-1">
                Renova em {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-surface border border-zinc-100 dark:border-white/6 rounded-3xl p-6 space-y-3 transition-colors duration-300">
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

          <div className="bg-white dark:bg-surface border border-zinc-100 dark:border-white/6 rounded-3xl p-6 space-y-3 transition-colors duration-300">
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

          {cancelAtPeriodEnd && subscription?.current_period_end && (
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4">
              <IconAlertOctagon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Cancelamento agendado. Acesso mantido até <strong>{new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}</strong>.
              </p>
            </div>
          )}

          {plan === 'FREE' ? (
            <Link
              href="/planos"
              className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-green-500/20 hover:scale-[1.01]"
            >
              Fazer upgrade de plano →
            </Link>
          ) : (
            <>
              <Link
                href="/planos"
                className="block w-full text-center bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 font-bold py-3.5 rounded-2xl transition-all hover:scale-[1.01]"
              >
                Gerenciar plano →
              </Link>
              {!cancelAtPeriodEnd && (
                <button
                  onClick={() => setShowCancelPlan(true)}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2.5 rounded-xl transition-colors border border-red-200 dark:border-red-500/30"
                >
                  Cancelar plano
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* ── ABA: SEGURANÇA ──────────────────────────────────────────── */}
      {tab === 'seguranca' && (
        <div className="space-y-4">

          <div className="bg-white dark:bg-surface border border-zinc-100 dark:border-white/6 rounded-3xl p-6 md:p-8 transition-colors duration-300">
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
                disabled={isPending || !pwForm.formState.isDirty}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-500/20 hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                {isPending
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <IconShieldCheck className="w-4 h-4" />}
                Alterar senha
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-surface border border-red-200 dark:border-red-500/20 rounded-3xl p-6 md:p-8 transition-colors duration-300">
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

      <ConfirmModal
        open={showCancelPlan}
        title="Cancelar plano?"
        description={`Seu acesso continuará ativo até ${subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString('pt-BR') : 'o fim do período pago'}. Após isso, volta para FREE.`}
        confirmLabel="Sim, cancelar"
        variant="danger"
        loading={cancelPlanLoading}
        onConfirm={handleCancelPlan}
        onCancel={() => setShowCancelPlan(false)}
      />
    </div>
  );
}



