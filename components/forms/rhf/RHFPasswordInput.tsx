"use client";

import { useState } from "react";
import { FieldValues, Path, Control } from "react-hook-form";
import { RHFInput } from "./RHFInput";
import { IconEye, IconEyeOff } from "@/components/ui/Icons";

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  variant?: "default" | "auth";
};

export function RHFPasswordInput<T extends FieldValues>({ name, control, label, placeholder, variant }: Props<T>) {
  const [show, setShow] = useState(false);

  return (
    <RHFInput
      name={name}
      control={control}
      type={show ? "text" : "password"}
      label={label}
      placeholder={placeholder}
      variant={variant}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          {show ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
        </button>
      }
    />
  );
}
