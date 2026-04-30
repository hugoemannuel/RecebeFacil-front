"use client";

import { useEffect, useRef } from "react";

type CheckboxProps = {
  id?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: "sm" | "md";
};

export function Checkbox({ id, checked, onChange, disabled, indeterminate, size = "sm" }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);

  const sizeClass = size === "md" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className="relative inline-flex items-center justify-center">
      <input
        ref={ref}
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer sr-only"
      />
      <div
        className={`
          ${sizeClass} rounded border-2 flex items-center justify-center
          border-zinc-300 dark:border-zinc-600
          bg-white dark:bg-surface-soft
          peer-checked:bg-green-500 peer-checked:border-green-500
          peer-indeterminate:bg-green-500 peer-indeterminate:border-green-500
          peer-disabled:opacity-50
          transition-colors cursor-pointer
        `}
        onClick={() => ref.current?.click()}
      >
        {(checked || indeterminate) && (
          <svg
            viewBox="0 0 12 12"
            fill="none"
            className={`${size === "md" ? "w-3.5 h-3.5" : "w-2.5 h-2.5"} text-white`}
          >
            {indeterminate && !checked ? (
              <path d="M2.5 6h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        )}
      </div>
    </div>
  );
}

