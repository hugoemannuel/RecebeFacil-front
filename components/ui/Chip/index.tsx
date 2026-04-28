type Props = {
  label: string;
  onClick: () => void;
};

export function Chip({ label, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        text-[11px] font-mono
        bg-green-50 text-green-700
        border border-green-200
        px-2 py-1 rounded-lg
        hover:bg-green-100
        transition-colors
      "
    >
      {label}
    </button>
  );
}