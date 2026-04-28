import { Input } from "@/components/ui/Input/Input";
import { Controller } from "react-hook-form";

export function RHFInput({
  name,
  control,
  label,
  icon,
  mask,
  ...props
}: any) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Input
          {...props}
          {...field}
          label={label}
          icon={icon}
          error={fieldState.error?.message}
          value={field.value ?? ""}
          onChange={(e) => {
            const value = mask
              ? mask(e.target.value)
              : e.target.value;

            field.onChange(value);
          }}
        />
      )}
    />
  );
}