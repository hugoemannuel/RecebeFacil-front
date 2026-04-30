import { IconLayoutGrid, IconDollarSign, IconUsers, IconFileText, IconSettings, IconWallet } from "@/components/ui/Icons";

interface MenuItem {
    name: string;
    path: string;
    icon: any;
    module: string;
    isComingSoon?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
    { name: 'INÍCIO', path: '/dashboard', icon: IconLayoutGrid, module: 'HOME' },
    { name: 'COBRANÇAS', path: '/dashboard/cobrancas', icon: IconDollarSign, module: 'CHARGES' },
    { name: 'CLIENTES', path: '/dashboard/clientes', icon: IconUsers, module: 'CLIENTS' },
    { name: 'RELATÓRIOS', path: '/dashboard/relatorios', icon: IconFileText, module: 'REPORTS' },
    { name: 'FINANCEIRO', path: '/dashboard/financeiro', icon: IconWallet, module: 'FINANCE' },
    { name: 'CONFIGURAÇÕES', path: '/dashboard/configuracoes', icon: IconSettings, module: 'HOME' },
];

export const PLAN_BADGE: Record<string, { label: string; color: string }> = {
    FREE: { label: 'Plano Free', color: 'text-zinc-500' },
    STARTER: { label: 'Plano Starter', color: 'text-blue-500' },
    PRO: { label: 'Plano Pro', color: 'text-green-600' },
    UNLIMITED: { label: 'Plano Unlimited', color: 'text-purple-600' },
};
