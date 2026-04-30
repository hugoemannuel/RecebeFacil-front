import { useState } from "react";
import { Controller, Control, FieldValues } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayPicker } from "react-day-picker";

type Props = {
  name: string;
  control: any;
  label?: string;
  icon?: React.ReactNode;
  disabled?: any;
};

export function DatePickerField({
  name,
  control,
  label,
  icon,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="relative">
          {label && (
            <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1.5">
              {label}
            </label>
          )}


          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="
              w-full flex items-center gap-3 pl-10 pr-4 py-3
              border border-zinc-200/80 dark:border-white/7
              bg-white dark:bg-surface-soft
              text-zinc-700 dark:text-zinc-200
              rounded-xl text-sm text-left
              focus:outline-none focus:ring-2 focus:ring-green-500/30
              transition-all relative
            "
          >
            {icon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                {icon}
              </div>
            )}

            <span
              className={
                field.value
                  ? "text-zinc-900 dark:text-zinc-100 font-medium"
                  : "text-zinc-400"
              }
            >
              {field.value
                ? format(field.value, "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })
                : "Selecionar data"}
            </span>
          </button>


          {open && (
            <div className="absolute z-50 mt-2 border border-zinc-200 dark:border-white/7 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-surface">
              <DayPicker
                mode="single"
                locale={ptBR}
                selected={field.value}
                disabled={disabled}
                onSelect={(date) => {
                  if (!date) return;

                  field.onChange(date);
                  setOpen(false);
                }}
                classNames={{
                  today: "text-green-600 font-bold",
                  selected: "bg-green-500 text-white rounded-lg",
                }}
              />
            </div>
          )}

          {fieldState.error && (
            <p className="text-red-500 text-xs mt-1">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

