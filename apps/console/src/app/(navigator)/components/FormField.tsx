import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@spaceorder/ui/components/forms/field";
import { Input } from "@spaceorder/ui/components/forms/input";
import { UseFormRegisterReturn } from "react-hook-form";

type FormFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "number";
  errorMessage?: string;
  registration: UseFormRegisterReturn;
  description?: string;
};

export default function FormField({
  id,
  label,
  placeholder,
  required,
  type = "text",
  errorMessage,
  registration,
  description,
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Field>
        <div>
          <FieldLabel className="gap-0" htmlFor={id}>
            {label}
            {required && (
              <span className="ml-0.5 inline-block text-red-500">*</span>
            )}
          </FieldLabel>
        </div>
        <Input
          id={id}
          placeholder={placeholder}
          required={required}
          type={type}
          aria-invalid={!!errorMessage}
          {...registration}
        />
        {description && <FieldDescription>{description}</FieldDescription>}
      </Field>
      <p
        className={`${errorMessage ? "visible" : "invisible"} min-h-4 text-xs text-red-500`}
      >
        {errorMessage}
      </p>
    </div>
  );
}
