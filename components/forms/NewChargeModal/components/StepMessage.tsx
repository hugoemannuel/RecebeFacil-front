'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { RHFTextarea } from '@/components/forms/rhf/RHFTextarea';
import { RHFSelect } from '@/components/forms/rhf/RHFSelect';
import { RHFInput } from '@/components/forms/rhf/RHFInput';
import { Select } from '@/components/ui/Select/Select';
import { Chip } from '@/components/ui/Chip';
import { IconDollarSign, IconSparkles, IconLock } from '@/components/ui/Icons';
import { toast } from 'sonner';
import { VARIABLES, type ChargeFormData } from '../interfaces';
import { getTemplatesAction } from '@/app/actions/templates';
import { MessageTemplate } from '@/services/templates';

interface StepMessageProps {
  hasPixKey: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  insertVariable: (v: string) => void;
  plan: string;
  onUpgrade?: (module: string) => void;
}

export function StepMessage({ hasPixKey, textareaRef, insertVariable, plan, onUpgrade }: StepMessageProps) {
  const { control, watch, setValue } = useFormContext<ChargeFormData>();
  const values = watch();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTemplatesAction()
      .then((res) => {
        if (res.success) {
          setTemplates(res.data);
        } else {
          toast.error(res.error || 'Erro ao carregar templates');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const templateOptions = templates.map(t => ({
    label: t.name,
    value: t.body
  }));

  return (
    <>
      <p className="text-sm text-zinc-500 mb-6">Personalize a mensagem que será enviada</p>
      
      <div className="space-y-6">
        {/* Salvar como Template (Gated) */}
        <button
          type="button"
          onClick={() => {
            if (plan === 'FREE') {
              onUpgrade?.('CUSTOM_TEMPLATES');
            } else {
              setValue('save_as_template', !values.save_as_template);
            }
          }}
          className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${values.save_as_template ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30' : 'border-zinc-200 dark:border-white/7 bg-white dark:bg-surface-soft hover:border-zinc-300 dark:hover:border-white/12'}`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${values.save_as_template ? 'bg-amber-100' : 'bg-zinc-100'}`}>
            <IconSparkles className={`w-4 h-4 ${values.save_as_template ? 'text-amber-600' : 'text-zinc-400'}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className={`text-sm font-bold ${values.save_as_template ? 'text-amber-800' : 'text-zinc-600'}`}>Salvar como template</p>
              {plan === 'FREE' && <IconLock className="w-3 h-3 text-zinc-400" />}
            </div>
            <p className="text-[11px] text-zinc-500">Salve esta mensagem para usar em outras cobranças</p>
          </div>
          <div className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${values.save_as_template ? 'bg-amber-500' : 'bg-zinc-200'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${values.save_as_template ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </button>

        {values.save_as_template && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <RHFInput
              name="template_name"
              control={control}
              label="Nome do template"
              placeholder="Ex: Cobrança de Varejo"
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Select
              label="Template base"
              value={values.custom_message}
              onChange={(value) => setValue('custom_message', value, { shouldValidate: true })}
              options={templateOptions}
              disabled={loading}
            />
            {loading && (
              <div className="absolute right-3 top-[34px]">
                <div className="w-4 h-4 border-2 border-zinc-200 border-t-zinc-400 rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-zinc-400 mb-2">Clique para inserir no cursor:</p>
            <div className="flex flex-wrap gap-1.5">
              {VARIABLES.map((v) => (
                <Chip key={v} label={v} onClick={() => insertVariable(v)} />
              ))}
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
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${values.send_pix_button ? 'bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/30' : 'border-zinc-200 dark:border-white/7 bg-white dark:bg-surface-soft hover:border-zinc-300 dark:hover:border-white/12'}`}
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
              <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/7 p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
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
      </div>
    </>
  );
}


