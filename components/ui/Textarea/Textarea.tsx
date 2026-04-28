type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea(props: TextareaProps) {
  return (
    <textarea
      {...props}
      className="
        w-full px-4 py-3
        border border-zinc-200/80 dark:border-white/[0.07]
        bg-white dark:bg-[#0f1c2b]
        text-zinc-700 dark:text-zinc-200
        rounded-xl text-sm
        focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/60
        transition-all resize-none
      "
    />
  );
}