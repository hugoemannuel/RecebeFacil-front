import { forwardRef } from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1.5">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          {...props}
          className="
            w-full px-4 py-3
            border border-zinc-200/80 dark:border-white/7
            bg-white dark:bg-surface-soft
            text-zinc-700 dark:text-zinc-200
            rounded-xl text-sm
            focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/60
            transition-all resize-none
          "
        />

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";


