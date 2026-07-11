import FormField from "@/app/(navigator)/components/FormField";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@spaceorder/ui/components/forms/field";
import { Switch } from "@spaceorder/ui/components/forms/switch";
import { Controller, FieldValues } from "react-hook-form";
import { FormFields } from "./AddTableFields.type";

type AddTableFieldProps<Payload extends FieldValues> = {
  fields: FormFields<Payload>[];
};

export default function AddTableFields<Payload extends FieldValues>({
  fields,
}: AddTableFieldProps<Payload>) {
  return (
    <div className="flex flex-col gap-y-2 mb-6 grow">
      {fields.map((field) =>
        field.type === "switch" ? (
          <FieldSet key={field.id}>
            <FieldLegend>{field.legend}</FieldLegend>
            <FieldDescription>{field.description}</FieldDescription>
            <Field orientation="horizontal" className="w-fit">
              <Controller
                name={field.id}
                control={field.control}
                render={({ field: checkboxField }) => (
                  <Switch
                    id={field.id}
                    ref={checkboxField.ref}
                    name={checkboxField.name}
                    checked={checkboxField.value}
                    onBlur={checkboxField.onBlur}
                    onCheckedChange={checkboxField.onChange}
                  />
                )}
              />
              <FieldLabel
                htmlFor={field.id}
                className="font-normal"
                defaultChecked
              >
                {field.label}
              </FieldLabel>
            </Field>
          </FieldSet>
        ) : (
          <FormField
            key={field.id}
            id={field.id}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            registration={field.registration}
            errorMessage={field.errorMessage}
            description={field.description}
          />
        )
      )}
    </div>
  );
}
