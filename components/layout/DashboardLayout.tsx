"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconLayoutGrid,
  IconDollarSign,
  IconUsers,
  IconFileText,
  IconSettings,
  IconSearch,
  IconBell,
  IconPlus,
  IconLogOut,
  IconMessageCircle,
  IconLock,
  IconMenu,
  IconX,
} from '@/components/ui/Icons';
import { logoutAction } from '@/app/actions/auth';
import { UpgradeModal } from '@/components/ui/UpgradeModal';
import { NewChargeDrawer } from '@/components/forms/NewChargeDrawer';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

// ─── Tipos ──────────────────────────────────────────────────────
export interface SubscriptionStatus {
  plan: 'FREE' | 'STARTER' | 'PRO' | 'UNLIMITED';
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'NONE';
  allowed_modules: string[];
  current_period_end: string | null;
  userName?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  subscription: SubscriptionStatus;
  sentThisMonth?: number;
}


// ─── Configuração dos itens do menu ────────────────────────────
const MENU_ITEMS = [
  { name: 'INÍCIO',         path: '/dashboard',                  icon: IconLayoutGrid, module: 'HOME'         },
  { name: 'COBRANÇAS',      path: '/dashboard/cobrancas',        icon: IconDollarSign, module: 'CHARGES'      },
  { name: 'CLIENTES',       path: '/dashboard/clientes',         icon: IconUsers,      module: 'CLIENTS'      },
  { name: 'RELATÓRIOS',     path: '/dashboard/relatorios',       icon: IconFileText,   module: 'REPORTS'      },
  { name: 'CONFIGURAÇÕES',  path: '/dashboard/configuracoes',    icon: IconSettings,   module: 'HOME'         },
];

// Badge visual de plano
const PLAN_BADGE: Record<string, { label: string; color: string }> = {
  FREE:      { label: 'Plano Free',      color: 'text-zinc-500'  },
  STARTER:   { label: 'Plano Starter',   color: 'text-blue-500'  },
  PRO:       { label: 'Plano Pro',       color: 'text-green-600' },
  UNLIMITED: { label: 'Plano Unlimited', color: 'text-purple-600'},
};

// ─── Componente ────────────────────────────────────────────────
export function DashboardLayout({ children, subscription, sentThisMonth = 0 }: DashboardLayoutProps) {

  const pathname = usePathname();
  const [lockedModule, setLockedModule] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const planBadge = PLAN_BADGE[subscription.plan] ?? PLAN_BADGE.FREE;
  const userName = subscription.userName ?? 'Usuário';

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1521] text-zinc-900 dark:text-zinc-50 font-sans flex overflow-hidden selection:bg-green-200 transition-colors duration-300">

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className="w-[280px] bg-white dark:bg-[#152336] border-r border-zinc-200 dark:border-white/5 flex flex-col h-screen shrink-0 hidden md:flex transition-colors duration-300">

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
            const isLocked = !subscription.allowed_modules.includes(item.module);
            const Icon = item.icon;

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
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  isActive
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

        {/* Upgrade banner para plano FREE */}
        {subscription.plan === 'FREE' && (
          <div className="mx-4 mb-4 bg-gradient-to-br from-[#0b1521] to-[#0b3d2e] rounded-2xl p-4">
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
        <div className="p-4 border-t border-zinc-100 dark:border-white/5 m-4 mt-0 rounded-2xl bg-[#f8fafc] dark:bg-[#0b1521] flex items-center gap-3 transition-colors duration-300">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center font-bold text-green-700 dark:text-green-400 text-sm shrink-0">
            {userName.charAt(0).toUpperCase()}
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
      <aside className={`fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-[#152336] border-r border-zinc-200 dark:border-white/5 flex flex-col h-screen shrink-0 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
            const isLocked = !subscription.allowed_modules.includes(item.module);
            const Icon = item.icon;

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
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  isActive
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
        <div className="p-4 border-t border-zinc-100 dark:border-white/5 mt-auto bg-[#f8fafc] dark:bg-[#0b1521] flex items-center gap-3 transition-colors duration-300">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 text-sm shrink-0">
            {userName.charAt(0).toUpperCase()}
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
        <header className="h-20 bg-white dark:bg-[#152336] border-b border-zinc-200/60 dark:border-white/5 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 sticky top-0 transition-colors duration-300">
          <div className="flex items-center gap-3 w-full max-w-md">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/5"
            >
              <IconMenu className="w-6 h-6" />
            </button>
            <div className="relative group flex-1 hidden sm:block">
              <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-green-500 transition-colors" />
              <input
                type="text"
                placeholder="Buscar cobranças ou clientes..."
                className="w-full bg-[#f4f7fb] dark:bg-[#0b1521] border-none rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white dark:focus:bg-[#0b1521] transition-all text-zinc-700 dark:text-zinc-200 font-medium placeholder:font-normal placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="relative text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-2">
              <IconBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#152336]"></span>
            </button>
            <button
              onClick={() => {
                if (subscription.plan === 'FREE' && sentThisMonth >= 10) {
                  setLimitReached(true);
                } else {
                  setDrawerOpen(true);
                }
              }}
              className="bg-[#0b1521] dark:bg-green-500 hover:bg-[#152336] dark:hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-full text-sm transition-all shadow-md flex items-center gap-2">
              <IconPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Cobrança</span>
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-[#0b1521] transition-colors duration-300">
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
        userName={subscription.userName}
        planType={subscription.plan}
      />

    </div>
  );
}
