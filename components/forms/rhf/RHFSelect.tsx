import { Controller, FieldValues, Path, Control } from "react-hook-form";
import { Select } from "@/components/ui/Select/Select";

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  options: { label: string; value: string }[];
};

export function RHFSelect<T extends FieldValues>({ name, control, label, options }: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Select
          label={label}
          value={field.value}
          onChange={field.onChange}
          error={fieldState.error?.message}
          options={options}
        />
      )}
    />
  );
}
