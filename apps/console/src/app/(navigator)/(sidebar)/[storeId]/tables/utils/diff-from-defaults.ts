import {
  CreateTablePayload,
  UpdateTablePayload,
} from "@ssurak/api/schemas/model/table.schema";
import { TableFormValues } from "../types/table-form.type";

export const diffFromDefaults = (
  form: CreateTablePayload,
  defaults: TableFormValues
): UpdateTablePayload => {
  const changed: UpdateTablePayload = {};

  if (form.tableNumber !== defaults.tableNumber) {
    changed.tableNumber = form.tableNumber;
  }
  if (form.isActive !== defaults.isActive) {
    changed.isActive = form.isActive;
  }
  if (form.seats !== defaults.seats) {
    changed.seats = form.seats ?? null;
  }
  if (form.floor !== defaults.floor) {
    changed.floor = form.floor ?? null;
  }
  if (isFalsy(form.section) !== isFalsy(defaults.section)) {
    changed.section = form.section ?? null;
  }

  return changed;
};

function isFalsy(value: string | undefined): string | undefined {
  if (value) return value;
  return undefined;
}
