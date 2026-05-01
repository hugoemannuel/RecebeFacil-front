import { Controller, FieldValues, Path, Control } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea/Textarea";

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rows?: number;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  className?: string;
};

export function RHFTextarea<T extends FieldValues>({ name, control, label, rows = 2, placeholder, inputRef, className }: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Textarea
          {...field}
          ref={(e) => {
            field.ref(e);
            if (inputRef) inputRef.current = e;
          }}
          label={label}
          error={fieldState.error?.message}
          rows={rows}
          placeholder={placeholder}
          className={className}
        />
      )}
    />
  );
}
