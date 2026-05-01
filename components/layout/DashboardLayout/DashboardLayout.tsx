"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconSearch,
  IconBell,
  IconPlus,
  IconLogOut,
  IconMessageCircle,
  IconLock,
  IconMenu,
  IconX,
  IconAlertOctagon,
} from '@/components/ui/Icons';
import { logoutAction } from '@/app/actions/auth';
import { Input } from '@/components/ui/Input/Input';
import { UpgradeModal } from '@/components/ui/UpgradeModal';
import { NewChargeDrawer } from '@/components/forms/NewChargeDrawer';
import { ThemeToggle } from '@/components/layout/ThemeToggle/ThemeToggle';
import { DashboardLayoutProps } from './interface';
import { MENU_ITEMS, PLAN_BADGE } from './mock';
import { useUserStore } from '@/store/useUserStore';


export function DashboardLayout({ children, subscription, sentThisMonth = 0 }: DashboardLayoutProps) {

  const pathname = usePathname();
  const router = useRouter();
  const [lockedModule, setLockedModule] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paymentAlertDismissed, setPaymentAlertDismissed] = useState(false);

  const [mounted, setMounted] = useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const storeSubscription = useUserStore((state) => state.subscription);
  const currentSubscription = storeSubscription || subscription;
  
  const showPaymentAlert = currentSubscription.payment_failed && !paymentAlertDismissed;

  const planBadge = PLAN_BADGE[currentSubscription.plan] ?? PLAN_BADGE.FREE;
  const userName = currentSubscription.userName ?? 'Usuário';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const avatarSrc = currentSubscription.avatarUrl
    ? (currentSubscription.avatarUrl.startsWith('http') 
        ? currentSubscription.avatarUrl 
        : `${apiUrl}${currentSubscription.avatarUrl}${mounted ? `${currentSubscription.avatarUrl.includes('?') ? '&' : '?'}t=${new Date().getTime()}` : ''}`)
    : null;

  return (
    <div className="min-h-screen bg-surface dark:bg-background text-zinc-900 dark:text-zinc-50 font-sans flex overflow-hidden selection:bg-green-200 transition-colors duration-300">

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className="w-[280px] bg-white dark:bg-surface border-r border-zinc-200 dark:border-white/5 hidden md:flex flex-col h-screen shrink-0 transition-colors duration-300">

        {/* Logo */}
        <div className="p-8 pb-10">
          <Link href="/dashboard" className="flex items-center gap-2 group w-max">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-md shadow-green-500/20 group-hover:scale-110 transition-transform">
              <IconMessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="font-extrabold text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">
              Recebe<span className="text-green-500">Fácil</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            const isComingSoon = item.isComingSoon;
            const isLocked = !isComingSoon && !currentSubscription.allowed_modules.includes(item.module);
            const Icon = item.icon;

            if (isComingSoon) {
              return (
                <div
                  key={item.path}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all text-zinc-400 cursor-not-allowed opacity-60"
                  title="Funcionalidade em desenvolvimento"
                >
                  <Icon className="w-5 h-5 text-zinc-300" />
                  <span className="flex-1 text-left">{item.name}</span>
                  <span className="bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-500 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">Breve</span>
                </div>
              );
            }

            if (isLocked) {
              return (
                <button
                  key={item.path}
                  onClick={() => setLockedModule(item.module)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all text-zinc-400 hover:bg-amber-50 hover:text-amber-600 group"
                  title={`Disponível no plano STARTER ou superior`}
                >
                  <Icon className="w-5 h-5 text-zinc-300 group-hover:text-amber-400" />
                  <span className="flex-1 text-left">{item.name}</span>
                  <IconLock className="w-3.5 h-3.5 text-zinc-300 group-hover:text-amber-400 shrink-0" />
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${isActive
                  ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-green-600 dark:text-green-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                <span className="flex-1">{item.name}</span>
                {item.isComingSoon && (
                  <span className="bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-500 text-[9px] px-2 py-0.5 rounded-full font-bold">Breve</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade banner para plano FREE */}
        {currentSubscription.plan === 'FREE' && (
          <div className="mx-4 mb-4 bg-linear-to-br from-[#18181b] to-[#064e3b] rounded-2xl p-4 border border-white/5 shadow-xl">
            <p className="text-white font-bold text-xs mb-1">Desbloqueie mais poder</p>
            <p className="text-slate-400 text-[11px] mb-3 leading-relaxed">Clientes, relatórios e importação de Excel no plano Starter.</p>
            <Link
              href="/planos"
              className="block w-full bg-green-500 hover:bg-green-400 text-white font-bold text-xs py-2 rounded-xl text-center transition-colors"
            >
              Ver planos →
            </Link>
          </div>
        )}

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-zinc-100 dark:border-white/5 m-4 mt-0 rounded-2xl bg-surface dark:bg-surface-soft flex items-center gap-3 transition-colors duration-300">
          <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-green-100 dark:bg-green-900/30 flex items-center justify-center font-bold text-green-700 dark:text-green-400 text-sm">
            {avatarSrc
              ? <img src={avatarSrc} alt={userName} className="w-full h-full object-cover" />
              : userName.charAt(0).toUpperCase()
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">{userName}</p>
            <p className={`text-[10px] uppercase font-bold tracking-wider truncate ${planBadge.color}`}>
              {planBadge.label}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
              title="Sair da conta"
            >
              <IconLogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay ─────────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar ─────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-surface border-r border-zinc-200 dark:border-white/5 flex flex-col h-screen shrink-0 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo & Close */}
        <div className="p-6 pb-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <IconMessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="font-extrabold text-xl tracking-tight text-zinc-900">
              Recebe<span className="text-green-500">Fácil</span>
            </div>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg bg-zinc-50">
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            const isComingSoon = item.isComingSoon;
            const isLocked = !isComingSoon && !currentSubscription.allowed_modules.includes(item.module);
            const Icon = item.icon;

            if (isComingSoon) {
              return (
                <div
                  key={item.path}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all text-zinc-400 cursor-not-allowed opacity-60"
                >
                  <Icon className="w-5 h-5 text-zinc-300" />
                  <span className="flex-1 text-left">{item.name}</span>
                  <span className="bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-500 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">Breve</span>
                </div>
              );
            }

            if (isLocked) {
              return (
                <button
                  key={item.path}
                  onClick={() => { setLockedModule(item.module); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all text-zinc-400 hover:bg-amber-50 hover:text-amber-600 group"
                >
                  <Icon className="w-5 h-5 text-zinc-300 group-hover:text-amber-400" />
                  <span className="flex-1 text-left">{item.name}</span>
                  <IconLock className="w-3.5 h-3.5 text-zinc-300 group-hover:text-amber-400 shrink-0" />
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${isActive
                  ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-green-600 dark:text-green-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-zinc-100 dark:border-white/5 mt-auto bg-surface dark:bg-surface-soft flex items-center gap-3 transition-colors duration-300">
          <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-green-100 dark:bg-green-900/30 flex items-center justify-center font-bold text-green-700 dark:text-green-400 text-sm">
            {avatarSrc
              ? <img src={avatarSrc} alt={userName} className="w-full h-full object-cover" />
              : userName.charAt(0).toUpperCase()
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-zinc-900 truncate">{userName}</p>
            <p className={`text-[10px] uppercase font-bold tracking-wider truncate ${planBadge.color}`}>
              {planBadge.label}
            </p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
              <IconLogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-surface border-b border-zinc-200/60 dark:border-white/5 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 sticky top-0 transition-colors duration-300">
          <div className="flex items-center gap-3 w-full max-w-md">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/5"
            >
              <IconMenu className="w-6 h-6" />
            </button>
            <div className="flex-1 hidden sm:block">
              <Input
                icon={<IconSearch className="w-4 h-4" />}
                placeholder="Buscar cobranças ou clientes..."
                className="rounded-full bg-surface-soft dark:bg-background border-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-2">
              <IconBell className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (currentSubscription.plan === 'FREE' && sentThisMonth >= 10) {
                  setLimitReached(true);
                } else {
                  setDrawerOpen(true);
                }
              }}
              className="bg-zinc-900 dark:bg-green-500 hover:bg-zinc-800 dark:hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-full text-sm transition-all shadow-md flex items-center gap-2">
              <IconPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Cobrança</span>
            </button>
          </div>
        </header>

        {/* Banner de falha de pagamento */}
        {showPaymentAlert && (
          <div className="bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 px-4 sm:px-8 py-3 flex items-center gap-3">
            <IconAlertOctagon className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="flex-1 text-sm font-medium text-amber-800 dark:text-amber-300">
              Não foi possível processar seu pagamento. Seu acesso será mantido por mais 3 dias.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="/planos"
                className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30 px-3 py-1.5 rounded-lg transition-colors"
              >
                Tentar novamente
              </a>
              <button
                onClick={() => setPaymentAlertDismissed(true)}
                className="p-1.5 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-lg transition-colors"
                aria-label="Fechar aviso"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto bg-surface dark:bg-background transition-colors duration-300">
          {children}
        </main>
      </div>

      {/* ── Upgrade Modal ──────────────────────────────────── */}
      {lockedModule && (
        <UpgradeModal
          moduleName={lockedModule}
          onClose={() => setLockedModule(null)}
        />
      )}

      {limitReached && (
        <UpgradeModal
          moduleName="LIMIT_REACHED"
          onClose={() => setLimitReached(false)}
        />
      )}

      <NewChargeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userName={currentSubscription.userName}
        planType={currentSubscription.plan}
        onSuccess={() => router.refresh()}
      />

    </div>
  );
}


