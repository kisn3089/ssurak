import {
  Control,
  FieldPath,
  FieldValues,
  UseFormRegisterReturn,
} from "react-hook-form";

type InputFieldStatic<Payload extends FieldValues> = {
  id: FieldPath<Payload>;
  label: string;
  placeholder?: string;
  required?: boolean;
  type: "text" | "number";
  description?: string;
};

type CheckboxFieldStatic<Payload extends FieldValues> = {
  id: FieldPath<Payload>;
  label: string;
  legend: string;
  type: "switch";
  description: string;
};
export type CheckboxFieldDynamic<Payload extends FieldValues> = {
  control: Control<Payload>;
};

type InputField<Payload extends FieldValues> = InputFieldStatic<Payload> & {
  registration: UseFormRegisterReturn;
  errorMessage?: string;
};
type CheckboxField<Payload extends FieldValues> = CheckboxFieldStatic<Payload> &
  CheckboxFieldDynamic<Payload>;

export type FormFields<Payload extends FieldValues> =
  | InputField<Payload>
  | CheckboxField<Payload>;

export type StaticFormField<Payload extends FieldValues> =
  | InputFieldStatic<Payload>
  | CheckboxFieldStatic<Payload>;
