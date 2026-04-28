import { Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea/Textarea";

type Props = {
  name: string;
  control: any;
  rows?: number;
  placeholder?: string;
};

export function RHFTextarea({
  name,
  control,
  rows = 2,
  placeholder,
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Textarea
          {...field}
          rows={rows}
          placeholder={placeholder}
        />
      )}
    />
  );
}