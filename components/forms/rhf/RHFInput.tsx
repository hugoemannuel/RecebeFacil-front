import { Control, FieldValues, Path, Controller } from "react-hook-form";
import { ComponentProps } from "react";
import { Input } from "@/components/ui/Input/Input";

type Props<T extends FieldValues> = Omit<
  ComponentProps<typeof Input>,
  "onChange" | "value" | "name"
> & {
  name: Path<T>;
  control: Control<T>;
  mask?: (v: string) => string;
};

export function RHFInput<T extends FieldValues>({ name, control, mask, ...props }: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Input
          {...props}
          {...field}
          error={fieldState.error?.message}
          value={field.value ?? ""}
          onChange={(e) => {
            const value = mask ? mask(e.target.value) : e.target.value;
            field.onChange(value);
          }}
        />
      )}
    />
  );
}
