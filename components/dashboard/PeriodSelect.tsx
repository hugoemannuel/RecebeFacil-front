'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/components/ui/Select/Select';

const OPTIONS = [
  { label: 'Últimos 7 dias', value: '7days' },
  { label: 'Este mês', value: 'month' },
];

export function PeriodSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get('period') || '7days';

  return (
    <Select
      value={currentPeriod}
      onChange={(value) => router.push(`/dashboard?period=${value}`)}
      options={OPTIONS}
    />
  );
}
