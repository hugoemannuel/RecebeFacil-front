import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  variant?: "default" | "auth";
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightSlot, variant = "default", className = "", ...props }, ref) => {
    const isAuth = variant === "auth";

    const baseClasses = `
      w-full border rounded-xl text-sm
      focus:outline-none focus:ring-2 focus:ring-green-500/30
      transition-all
      ${icon ? "pl-10" : "pl-4"}
      ${rightSlot ? "pr-10" : "pr-4"}
    `;

    const variantClasses = isAuth
      ? "py-3.5 bg-white border-zinc-200 shadow-sm hover:border-zinc-300 text-zinc-800 font-medium focus:border-green-500/60"
      : "py-3 bg-white dark:bg-[#0f1c2b] border-zinc-200/80 dark:border-white/[0.07] text-zinc-700 dark:text-zinc-200 focus:border-green-500/60 dark:focus:border-green-500/40";

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
            className={`${baseClasses} ${variantClasses} ${className}`}
          />

          {rightSlot && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightSlot}
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
