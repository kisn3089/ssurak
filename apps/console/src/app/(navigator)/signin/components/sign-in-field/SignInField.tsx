"use client";

import { Input } from "@ssurak/ui/components/forms/input";
import { Label } from "@ssurak/ui/components/forms/label";
import { RegisterOptions, UseFormRegisterReturn } from "react-hook-form";

type InputType = "email" | "password";
type SignInFieldProps = {
  id: string;
  label: string;
  type: InputType;
  placeholder?: string;
  errorMessage?: string;
  register<FieldType extends InputType>(
    name: FieldType,
    options?:
      | RegisterOptions<
          {
            email: string;
            password: string;
          },
          FieldType
        >
      | undefined
  ): UseFormRegisterReturn<FieldType>;
};

export default function SignInField({
  id,
  label,
  type,
  errorMessage,
  placeholder,
  register,
}: SignInFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={label}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={
          errorMessage ? "border-red-500 focus-visible:ring-red-500" : ""
        }
        {...register(type)}
        aria-invalid={errorMessage ? true : false}
      />
      <p
        className={`${errorMessage ? `visible` : `invisible`} min-h-4 text-xs text-red-500`}
      >
        {errorMessage}
      </p>
    </div>
  );
}
