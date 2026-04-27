'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function PeriodSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get('period') || '7days';

  return (
    <select 
      value={currentPeriod}
      onChange={(e) => router.push(`/dashboard?period=${e.target.value}`)}
      className="bg-slate-100 border-none text-sm font-medium text-slate-600 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-green-500/20"
    >
      <option value="7days">Últimos 7 dias</option>
      <option value="month">Este mês</option>
    </select>
  );
}
