"use client";

import React from 'react';
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
  IconMessageCircle
} from '@/components/ui/Icons';
import { logoutAction } from '@/app/actions/auth';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'INÍCIO', path: '/dashboard', icon: IconLayoutGrid },
    { name: 'COBRANÇAS', path: '/dashboard/cobrancas', icon: IconDollarSign },
    { name: 'CLIENTES', path: '/dashboard/clientes', icon: IconUsers },
    { name: 'RELATÓRIOS', path: '/dashboard/relatorios', icon: IconFileText },
    { name: 'CONFIGURAÇÕES', path: '/dashboard/configuracoes', icon: IconSettings },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900 font-sans flex overflow-hidden selection:bg-green-200">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-zinc-200 flex flex-col h-screen shrink-0 hidden md:flex">
        <div className="p-8 pb-10">
          <Link href="/dashboard" className="flex items-center gap-2 group w-max">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-md shadow-green-500/20 group-hover:scale-110 transition-transform">
              <IconMessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="font-extrabold text-2xl tracking-tight text-zinc-900">
              Recebe<span className="text-green-500">Fácil</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-zinc-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-zinc-100 m-4 rounded-2xl bg-[#f8fafc] flex items-center gap-3">
          <img src="https://i.pravatar.cc/100?img=11" alt="User" className="w-10 h-10 rounded-full bg-zinc-200 object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-zinc-900 truncate">João Silva</p>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider truncate">Plano Premium</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sair da conta">
              <IconLogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-zinc-200/60 flex items-center justify-between px-8 shrink-0 z-10 sticky top-0">
          <div className="w-full max-w-md relative group">
            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-green-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar cobranças ou clientes..." 
              className="w-full bg-[#f4f7fb] border-none rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all text-zinc-700 font-medium placeholder:font-normal placeholder:text-zinc-400"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-zinc-400 hover:text-zinc-600 transition-colors p-2">
              <IconBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="bg-[#0b1521] hover:bg-[#152336] text-white font-bold py-2.5 px-6 rounded-full text-sm transition-all shadow-md flex items-center gap-2 group">
              <IconPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Cobrança</span>
            </button>
          </div>
        </header>

        {/* Dashboard Scrollable Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        
      </div>
    </div>
  );
}
