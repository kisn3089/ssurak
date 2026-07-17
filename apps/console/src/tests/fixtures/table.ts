import { Table } from "@ssurak/api/types/table/table.interface";

export function buildTable(overrides: Partial<Table> = {}): Table {
  return {
    publicId: "table-1",
    tableNumber: "1-1",
    seats: 4,
    floor: 1,
    section: "메인 홀",
    isActive: true,
    qrCode: "cjld2cjxh0000qzrmn831i7rn",
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
    ...overrides,
  };
}
