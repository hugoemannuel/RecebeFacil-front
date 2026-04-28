import { forwardRef } from "react";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Option[];
  className?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, value, onChange, options, className = "" }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1.5">
            {label}
          </label>
        )}

        <select
          ref={ref}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`
            w-full px-4 py-2.5
            border border-zinc-200/80 dark:border-white/[0.07]
            bg-white dark:bg-[#0f1c2b]
            text-zinc-700 dark:text-zinc-200
            rounded-xl text-sm
            focus:outline-none focus:ring-2 focus:ring-green-500/30
            transition-all
            ${className}
          `}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";