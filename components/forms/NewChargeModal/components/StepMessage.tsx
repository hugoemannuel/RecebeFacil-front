'use client';

import { useFormContext } from 'react-hook-form';
import { RHFTextarea } from '@/components/forms/rhf/RHFTextarea';
import { RHFSelect } from '@/components/forms/rhf/RHFSelect';
import { RHFInput } from '@/components/forms/rhf/RHFInput';
import { Select } from '@/components/ui/Select/Select';
import { Chip } from '@/components/ui/Chip';
import { IconDollarSign, IconSparkles } from '@/components/ui/Icons';
import { TEMPLATE_OPTIONS, VARIABLES, type ChargeFormData } from '../interfaces';

interface StepMessageProps {
  hasPixKey: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  insertVariable: (v: string) => void;
}

export function StepMessage({ hasPixKey, textareaRef, insertVariable }: StepMessageProps) {
  const { control, watch, setValue } = useFormContext<ChargeFormData>();
  const values = watch();

  return (
    <>
      <p className="text-sm text-zinc-500">Personalize a mensagem que será enviada</p>
      <div className="space-y-4">
        <Select
          label="Template base"
          value={values.custom_message}
          onChange={(value) => setValue('custom_message', value, { shouldValidate: true })}
          options={TEMPLATE_OPTIONS}
        />
        <div>
          <p className="text-xs text-zinc-400 mb-2">Clique para inserir no cursor:</p>
          <div className="flex flex-wrap gap-1.5">
            {VARIABLES.map((v) => <Chip key={v} label={v} onClick={() => insertVariable(v)} />)}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Mensagem</label>
            <div className="flex gap-1">
              <button type="button" onClick={() => insertVariable('*')} className="text-xs font-bold text-zinc-500 hover:text-zinc-800 px-1.5 py-0.5 rounded hover:bg-zinc-100">N</button>
              <button type="button" onClick={() => insertVariable('_')} className="text-xs italic font-serif text-zinc-500 hover:text-zinc-800 px-1.5 py-0.5 rounded hover:bg-zinc-100">I</button>
              <div className="w-px h-3.5 bg-zinc-200 my-auto mx-1" />
              {['💰', '📅', '✅', '⚠️'].map(emoji => (
                <button key={emoji} type="button" onClick={() => insertVariable(emoji)} className="text-xs px-1 hover:bg-zinc-100 rounded">{emoji}</button>
              ))}
            </div>
          </div>
          <RHFTextarea name="custom_message" control={control} inputRef={textareaRef} rows={9} />
        </div>
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => setValue('send_pix_button', !values.send_pix_button)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${values.send_pix_button ? 'bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/30' : 'border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#0f1c2b] hover:border-zinc-300 dark:hover:border-white/[0.12]'}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${values.send_pix_button ? 'bg-green-100' : 'bg-zinc-100'}`}>
              <IconDollarSign className={`w-4 h-4 ${values.send_pix_button ? 'text-green-600' : 'text-zinc-400'}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-bold ${values.send_pix_button ? 'text-green-800' : 'text-zinc-600'}`}>Incluir Pagamento via PIX</p>
              <p className="text-[11px] text-zinc-500">Gera um botão e linha digitável na mensagem</p>
            </div>
            <div className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${values.send_pix_button ? 'bg-green-500' : 'bg-zinc-200'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${values.send_pix_button ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </button>
          {values.send_pix_button && !hasPixKey && (
            <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.07] p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-2 mb-2">
                <IconSparkles className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Como você não possui uma chave salva, insira abaixo para onde o dinheiro deve ir nesta cobrança:</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <RHFSelect
                    name="pix_key_type"
                    control={control}
                    label="Tipo"
                    options={[
                      { label: 'CPF', value: 'CPF' },
                      { label: 'CNPJ', value: 'CNPJ' },
                      { label: 'Celular', value: 'PHONE' },
                      { label: 'E-mail', value: 'EMAIL' },
                      { label: 'Aleatória', value: 'EVP' },
                    ]}
                  />
                </div>
                <div className="col-span-2">
                  <RHFInput name="pix_key" control={control} label="Chave PIX" placeholder="Ex: 123.456.789-00" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
