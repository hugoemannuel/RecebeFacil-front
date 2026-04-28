import { forwardRef } from "react";

type InputProps = {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;

  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  placeholder?: string;
  name?: string;
  type?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            {...props}
            className={`
              w-full py-3 border rounded-xl text-sm
              bg-white dark:bg-[#0f1c2b]
              text-zinc-700 dark:text-zinc-200
              border-zinc-200/80 dark:border-white/[0.07]
              focus:outline-none focus:ring-2 focus:ring-green-500/30
              focus:border-green-500/60 dark:focus:border-green-500/40
              transition-all
              ${icon ? "pl-10" : "pl-4"}
              pr-4
              ${className}
            `}
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";