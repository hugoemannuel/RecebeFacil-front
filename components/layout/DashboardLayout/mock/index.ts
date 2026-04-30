import { IconLayoutGrid, IconDollarSign, IconUsers, IconFileText, IconSettings } from "@/components/ui/Icons";

export const MENU_ITEMS = [
    { name: 'INÍCIO', path: '/dashboard', icon: IconLayoutGrid, module: 'HOME' },
    { name: 'COBRANÇAS', path: '/dashboard/cobrancas', icon: IconDollarSign, module: 'CHARGES' },
    { name: 'CLIENTES', path: '/dashboard/clientes', icon: IconUsers, module: 'CLIENTS' },
    { name: 'RELATÓRIOS', path: '/dashboard/relatorios', icon: IconFileText, module: 'REPORTS', isComingSoon: true },
    { name: 'CONFIGURAÇÕES', path: '/dashboard/configuracoes', icon: IconSettings, module: 'HOME' },
];

export const PLAN_BADGE: Record<string, { label: string; color: string }> = {
    FREE: { label: 'Plano Free', color: 'text-zinc-500' },
    STARTER: { label: 'Plano Starter', color: 'text-blue-500' },
    PRO: { label: 'Plano Pro', color: 'text-green-600' },
    UNLIMITED: { label: 'Plano Unlimited', color: 'text-purple-600' },
};
