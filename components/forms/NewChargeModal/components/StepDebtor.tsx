'use client';

import { useFormContext } from 'react-hook-form';
import { RHFInput } from '@/components/forms/rhf/RHFInput';
import { IconUser, IconPhone } from '@/components/ui/Icons';
import { maskPhone } from '@/lib/formatters';
import type { ChargeFormData } from '../interfaces';

export function StepDebtor() {
  const { control } = useFormContext<ChargeFormData>();

  return (
    <>
      <p className="text-sm text-zinc-500">Quem vai receber a cobrança?</p>
      <div className="space-y-4">
        <RHFInput name="debtor_name" control={control} label="Nome" placeholder="Ex: João Silva" icon={<IconUser />} />
        <RHFInput name="debtor_phone" control={control} label="WhatsApp" placeholder="(11) 99999-9999" icon={<IconPhone />} mask={maskPhone} />
      </div>
    </>
  );
}
