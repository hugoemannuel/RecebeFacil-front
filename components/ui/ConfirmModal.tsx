"use client";

interface Props {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  variant = "primary",
  loading = false,
  icon,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  const confirmClasses =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-green-500 hover:bg-green-600 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0f1c2b] rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        {icon && <div className="mb-3">{icon}</div>}

        <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 mb-2">{title}</h3>

        <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{description}</div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${confirmClasses}`}
          >
            {loading ? "Aguarde..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
