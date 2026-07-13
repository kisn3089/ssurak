"use client";

import { Spinner } from "@ssurak/ui/components/spinner";
import AddTableFields from "./AddTableFields";
import { useParams } from "next/navigation";
import PreviewTable from "./PreviewTable";
import SampleTable from "./SampleTable";
import FormErrorWithRetry from "../../../components/FormErrorWithRetry";
import { Button } from "@ssurak/ui/components/buttons/button";
import useTableMutation from "@ssurak/api/core/store/table/useTableMutation";
import {
  CreateTablePayload,
  createTablePayloadSchema,
} from "@ssurak/api/schemas/model/table.schema";
import {
  Resolver,
  useForm,
  UseFormRegisterReturn,
  useWatch,
} from "react-hook-form";
import useResetPreviewOnEdit from "../hooks/useResetPreviewOnEdit";
import { httpTableErrors } from "@ssurak/api/core/store/table/httpTableErrors";
import useSuspenseWithAuth from "@ssurak/api/hooks/useSuspenseWithAuth";
import { Table } from "@ssurak/api/types/table/table.interface";
import { staticAddTableFields } from "./staticAddTableFields";
import { zodResolver } from "@hookform/resolvers/zod";
import BackListAfterAdd from "./BackListAfterAdd";
import { FormFields } from "./AddTableFields.type";

type AddTableFormProps = {
  children: React.ReactNode;
};

const formDefaultValues = {
  tableNumber: undefined,
  seats: undefined,
  floor: undefined,
  section: undefined,
  isActive: true,
};

const duplicateResolverError = {
  type: "manual",
  message: "이미 존재하는 테이블 번호입니다.",
};

export default function AddTableForm({ children }: AddTableFormProps) {
  "use no memo";

  const { storeId } = useParams<{ storeId: string }>();
  const { createTable } = useTableMutation(storeId);
  const { data: tables } = useSuspenseWithAuth<Table[]>(
    `/stores/v1/${storeId}/tables`
  );

  const existingTableNumbers = new Set(
    tables.map((table) => table.tableNumber)
  );

  const resolver: Resolver<CreateTablePayload> = async (values, ...options) => {
    const result = await zodResolver(createTablePayloadSchema)(
      values,
      ...options
    );

    if (existingTableNumbers.has(values.tableNumber?.trim())) {
      return {
        values: {},
        errors: {
          ...result.errors,
          tableNumber: duplicateResolverError,
        },
      };
    }

    return result;
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateTablePayload>({
    resolver,
    mode: "all",
    defaultValues: formDefaultValues,
  });

  const { isSuccess, reset, error, isPending } = createTable;

  const isLoading = isSubmitting || isPending;
  const errorMessage = error ? httpTableErrors.post(error) : undefined;

  const [tableNumber, section, seats, floor] = useWatch({
    control,
    name: ["tableNumber", "section", "seats", "floor"],
  });

  const tableInfo = { tableNumber, section, seats, floor, disabled: isPending };

  const inputDynamicFields: Record<string, UseFormRegisterReturn> = {
    tableNumber: { ...register("tableNumber") },
    seats: {
      ...register("seats", {
        setValueAs: (v) => (v === "" ? undefined : Number(v)),
      }),
    },
    floor: {
      ...register("floor", {
        setValueAs: (v) => (v === "" ? undefined : Number(v)),
      }),
    },
    section: { ...register("section") },
  };

  const fields: FormFields<CreateTablePayload>[] = staticAddTableFields.map(
    (field) =>
      field.type === "switch"
        ? { ...field, control }
        : {
            ...field,
            registration: inputDynamicFields[field.id],
            errorMessage: errors[field.id]?.message,
          }
  );

  const addTableSubmit = (payload: CreateTablePayload) => {
    const { tableNumber, seats, floor, section, isActive } = payload;

    const addTablePayload: CreateTablePayload = {
      tableNumber,
      ...(seats !== undefined ? { seats } : {}),
      ...(floor !== undefined ? { floor } : {}),
      ...(section !== undefined ? { section } : {}),
      isActive,
    };

    createTable.mutate({ storeId, createTablePayload: addTablePayload });
  };

  const onSubmit = handleSubmit(addTableSubmit);
  useResetPreviewOnEdit(watch, isSuccess, reset);

  return (
    <form className="flex flex-col grow" noValidate onSubmit={onSubmit}>
      <div className="@container">
        <div className="flex gap-6 flex-col @3xl:flex-row pb-10">
          <AddTableFields fields={fields} />
          <PreviewTable>
            <SampleTable table={tableInfo} isSuccess={isSuccess} />
            <BackListAfterAdd isSuccess={isSuccess} />
            <FormErrorWithRetry
              title="테이블을 추가하지 못했어요."
              errorMessage={errorMessage}
              onRetry={onSubmit}
            />
          </PreviewTable>
        </div>
      </div>
      <div className="flex justify-end gap-x-2 pb-4">
        {children}
        <Button type="submit" disabled={!isValid || isLoading}>
          <AddTableSubmitButtonMessage isLoading={isLoading} />
        </Button>
      </div>
    </form>
  );
}

function AddTableSubmitButtonMessage({ isLoading }: { isLoading: boolean }) {
  return isLoading ? (
    <>
      <Spinner />
      {"추가 중"}
    </>
  ) : (
    "테이블 추가"
  );
}
