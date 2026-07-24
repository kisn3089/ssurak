"use client";

import { Button } from "@ssurak/ui/components/buttons/button";
import Link from "next/link";
import FormSubmitContent from "../../components/form/FormSubmitContent";
import { MenuFormProps } from "../../tables/types/menu-form.type";
import {
  CreateMenuPayload,
  createMenuPayloadSchema,
} from "@ssurak/api/schemas/model/menu.schema";
import {
  Resolver,
  useForm,
  UseFormRegisterReturn,
  useWatch,
} from "react-hook-form";
import { useParams } from "next/navigation";
import useSuspenseWithAuth from "@ssurak/api/hooks/useSuspenseWithAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { DynamicFormFields } from "../../components/form/FormFields.type";
import { staticAddMenuFields } from "../add/components/staticAddMenuFields";
import FormFields from "../../components/form/FormFields";
import { CategoryWithMenusResponse } from "@ssurak/api/types/category/category.interface";
import { SelectOption } from "../../components/form/FormSelectField";
import PreviewMenu from "../add/components/PreviewMenu";
import SortOrderPreview from "../add/components/sort-order-preview/SortOrderPreview";
import { getNewSortOrder } from "../add/components/sort-order-preview/get-new-sort-order";
import { DetailMenu } from "@ssurak/ui/components/menu/menu-detail/menu-detail.type";
import { useEffect, useRef, useState } from "react";
import SuccessMenuDialog from "./success-create-menu/SuccessMenuDialog";

const duplicateResolverError = {
  type: "manual",
  message: "이미 존재하는 메뉴 이름입니다.",
};

export default function MenuForm({
  formDefaultValues,
  buttonText,
  children,
  linkToCancel,
  mutation,
  formSubmit,
}: MenuFormProps) {
  "use no memo";

  const [isSortActive, setIsSortActive] = useState(false);

  const { storeId } = useParams<{ storeId: string }>();
  const { data: categoryWithMenus } = useSuspenseWithAuth<
    CategoryWithMenusResponse[]
  >(`/stores/v1/${storeId}/menus`);

  // 서버에서 정렬이 되어 오기 때문에, 클라이언트에서 정렬할 필요가 없다.
  const categoryOptions: SelectOption[] = categoryWithMenus.map((category) => ({
    value: category.publicId,
    label: category.name,
  }));

  // 수정 화면의 formDefaultValues.categoryId는 서버 내부 id(bigint)로 내려온다.
  // 셀렉트 옵션·제출 페이로드는 모두 publicId(cuid2)를 쓰므로 초기값을 publicId로 변환한다.
  const defaultCategory = categoryWithMenus.find(
    (category) => category.id.toString() === formDefaultValues.categoryId
  );
  const defaultCategoryId =
    defaultCategory?.publicId ?? formDefaultValues.categoryId;

  // 수정 화면: 편집 중인 메뉴의 현재 위치를 정렬 셀렉트 초기값으로 잡는다.
  // (맨 앞이면 0 = "맨 앞에 표시", 아니면 바로 앞 메뉴의 sortOrder = "그 메뉴 다음")
  const menusBeforeEdit = defaultCategory?.menus ?? [];
  const editingMenuIndex = menusBeforeEdit.findIndex(
    (menu) => menu.publicId === formDefaultValues.publicId
  );

  const defaultSortOrder =
    editingMenuIndex === -1
      ? formDefaultValues.sortOrder
      : editingMenuIndex === 0
        ? 0
        : menusBeforeEdit[editingMenuIndex - 1].sortOrder;

  const existingMenuNames = new Set<string>(
    categoryWithMenus.flatMap((cat) => cat.menus).map((menu) => menu.name)
  );

  if (formDefaultValues.name) {
    existingMenuNames.delete(formDefaultValues.name);
  }

  const resolver: Resolver<CreateMenuPayload> = async (values, ...options) => {
    const result = await zodResolver(createMenuPayloadSchema)(
      values,
      ...options
    );

    if (existingMenuNames.has(values.name?.trim())) {
      return {
        values: {},
        errors: {
          ...result.errors,
          name: duplicateResolverError,
        },
      };
    }

    return result;
  };

  const { publicId: _publicId, ...payloadDefaults } = formDefaultValues;
  const {
    register,
    handleSubmit,
    control,
    formState,
    getFieldState,
    setError,
    setValue,
  } = useForm<CreateMenuPayload>({
    resolver,
    mode: "all",
    defaultValues: {
      ...payloadDefaults,
      categoryId: defaultCategoryId,
      sortOrder: defaultSortOrder,
    },
  });

  const { isSubmitting, isValid } = formState;
  const { isSuccess, reset, isPending } = mutation;
  const isLoading = isSubmitting || isPending;

  const [
    name,
    price,
    imageKey,
    description,
    // requiredOptions,
    // customOptions,
    categoryId,
    sortOrder,
    isAvailable,
  ] = useWatch({
    control,
    name: [
      "name",
      "price",
      "imageKey",
      "description",
      //   "requiredOptions",
      //   "customOptions",
      "categoryId",
      "sortOrder",
      "isAvailable",
    ],
  });

  const selectedCategory = categoryWithMenus.find(
    (category) => category.publicId === categoryId
  );

  const menuForSort = (selectedCategory?.menus ?? []).filter(
    (menu) => menu.publicId !== formDefaultValues.publicId
  );

  const previousCategoryId = useRef(categoryId);
  useEffect(() => {
    if (previousCategoryId.current === categoryId) return;
    previousCategoryId.current = categoryId;

    if (previousCategoryId.current === defaultCategoryId) {
      setValue("sortOrder", defaultSortOrder, {
        shouldValidate: false,
      });
    } else {
      setValue("sortOrder", menuForSort.at(-1)?.sortOrder, {
        shouldValidate: false,
      });
    }
  }, [categoryId, setValue, menuForSort, defaultCategoryId, defaultSortOrder]);

  const forefront: SelectOption = { label: "맨 앞에 표시", value: 0 };
  const sortOptions: SelectOption[] = [
    forefront,
    ...menuForSort.map((menu) => ({
      label: `${menu.name} 다음`,
      value: menu.sortOrder,
    })),
  ];
  const isCategorySelect = !categoryId && sortOrder === undefined;

  const inputDynamicFields: Record<string, UseFormRegisterReturn> = {
    name: { ...register("name") },
    price: {
      ...register("price", {
        setValueAs: (v) => (v === "" ? undefined : Number(v)),
      }),
    },
    description: {
      ...register("description", { setValueAs: (v) => v || undefined }),
    },
    requiredOptions: {
      ...register("requiredOptions", { setValueAs: (v) => v || undefined }),
    },
    customOptions: {
      ...register("customOptions", { setValueAs: (v) => v || undefined }),
    },
  };

  const fields: DynamicFormFields<CreateMenuPayload>[] =
    staticAddMenuFields.map((field) => {
      const errorMessage = getFieldState(field.id, formState).error?.message;
      switch (field.type) {
        case "switch":
          return { ...field, control };
        case "select": {
          const fieldsWithoutOptions = {
            ...field,
            errorMessage,
            control,
          };
          if (field.id === "categoryId") {
            return { ...fieldsWithoutOptions, options: categoryOptions };
          }
          return {
            ...fieldsWithoutOptions,
            options: sortOptions,
            disabled: isCategorySelect,
            description: isCategorySelect ? field.description : null,
            onActiveChange: setIsSortActive,
          };
        }
        case "file":
          return {
            ...field,
            errorMessage,
            control,
          };
        default:
          return {
            ...field,
            errorMessage,
            registration: inputDynamicFields[field.id],
          };
      }
    });

  const addSetErrorOnSubmit = (payload: CreateMenuPayload) => {
    // 카테고리가 바뀌면 원래 순서(formDefaultValues.sortOrder)는 다른 정렬 공간의 값이라 재사용하면 안 된다.
    const isCategoryChanged = payload.categoryId !== defaultCategoryId;
    const isSortOrderChanged =
      payload.sortOrder !== undefined && payload.sortOrder !== defaultSortOrder;

    const sortOrder =
      selectedCategory && (isCategoryChanged || isSortOrderChanged)
        ? getNewSortOrder(selectedCategory.menus, payload.sortOrder)
        : formDefaultValues.sortOrder;

    const categoryId =
      defaultCategory?.publicId === payload.categoryId
        ? defaultCategory.id.toString()
        : payload.categoryId;

    formSubmit({ ...payload, sortOrder, categoryId }, setError);
  };
  const onSubmit = handleSubmit(addSetErrorOnSubmit);

  const menu: DetailMenu = {
    publicId: "",
    name: name || "",
    price: price || 0,
    imageKey: imageKey || null,
    description: description || null,
    requiredOptions: null,
    customOptions: null,
    // requiredOptions: requiredOptions || null,
    // customOptions: customOptions || null,
    isAvailable: isAvailable ?? true,
  };

  return (
    <form className="flex flex-col grow" noValidate onSubmit={onSubmit}>
      <div className="@container">
        <div className="flex gap-6 flex-col @3xl:flex-row pb-10">
          <FormFields fields={fields} />
          <div className="flex flex-col w-full @3xl:max-w-100 @3xl:sticky @3xl:top-14 @3xl:h-fit">
            {isSortActive && selectedCategory ? (
              <SortOrderPreview
                categoryName={selectedCategory.name}
                menus={menuForSort}
                sortOrder={sortOrder}
                newMenuName={name || "새 메뉴"}
              />
            ) : (
              <PreviewMenu menu={menu}>{children}</PreviewMenu>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-x-2 pb-4">
        <Link href={linkToCancel}>
          <Button variant={"outline"}>취소</Button>
        </Link>
        <SuccessMenuDialog menu={menu} isSuccess={isSuccess} reset={reset}>
          <Button type="submit" disabled={!isValid || isLoading}>
            <FormSubmitContent isLoading={isLoading} buttonText={buttonText} />
          </Button>
        </SuccessMenuDialog>
      </div>
    </form>
  );
}
