import { tableHeaders } from "./table-headers";

export default function TableListHeader() {
  return (
    <tr className="border-b">
      {tableHeaders.map((item, index) => (
        <th
          key={index}
          className={`text-left p-3 first:pl-4 ${item.className}`}
        >
          {item.label}
        </th>
      ))}
    </tr>
  );
}
