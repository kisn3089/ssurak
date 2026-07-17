import useTableMutation from "@ssurak/api/core/store/table/useTableMutation";
import { CreateTablePayload } from "@ssurak/api/schemas/model/table.schema";
import { UseFormSetError } from "react-hook-form";

export interface TableFormValues {
  tableNumber: string;
  seats?: number;
  floor?: number;
  section?: string;
  isActive: boolean;
}

type TableMutations = ReturnType<typeof useTableMutation>;

type TableFormBaseProps = {
  formDefaultValues: TableFormValues;
  linkToCancel: string;
  children: React.ReactNode;
  buttonText: string;
  formSubmit: (
    payload: CreateTablePayload,
    setError: UseFormSetError<CreateTablePayload>
  ) => void;
};

type AddTableFormProps = TableFormBaseProps & {
  mutation: TableMutations["createTable"];
};

type EditTableFormProps = TableFormBaseProps & {
  mutation: TableMutations["updateTable"];
};

export type TableFormProps = AddTableFormProps | EditTableFormProps;
