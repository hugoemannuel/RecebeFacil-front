type Props = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export function FormField({ label, error, children }: Props) {
  return (
    <div>
      <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1.5">
        {label}
      </label>

      {children}

      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}