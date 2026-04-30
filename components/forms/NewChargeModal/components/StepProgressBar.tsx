interface StepProgressBarProps {
  steps: string[];
  currentStep: number;
}

export function StepProgressBar({ steps, currentStep }: StepProgressBarProps) {
  return (
    <div className="flex gap-1 px-6 pt-4 shrink-0">
      {steps.map((s, i) => (
        <div key={s} className="flex-1 flex flex-col items-center gap-1">
          <div className={`h-1.5 w-full rounded-full transition-all duration-300 ${i <= currentStep ? 'bg-green-500' : 'bg-zinc-200 dark:bg-white/10'}`} />
          <span className={`hidden md:block text-[10px] font-bold uppercase tracking-wider ${i === currentStep ? 'text-green-600 dark:text-green-400' : 'text-zinc-300 dark:text-zinc-600'}`}>{s}</span>
        </div>
      ))}
    </div>
  );
}
