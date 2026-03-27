export function filterBySearchTerm<T extends object>(
  items: T[],
  searchTerm: string,
): T[] {
  if (!searchTerm.trim()) return items;
  const lowerSearchTerm = searchTerm.toLowerCase();
  return items.filter((item) =>
    Object.values(item).some(
      (value) =>
        value != null &&
        value.toString().toLowerCase().includes(lowerSearchTerm),
    ),
  );
}

export const exportToCSV = <T extends object>(
  filename: string,
  rows: T[]
) => {
  if (!rows || rows.length === 0) return;

  const separator = ",";
  const keys = Object.keys(rows[0]) as (keyof T)[];

  const csvContent =
    keys.join(separator) +
    "\n" +
    rows
      .map((row) =>
        keys
          .map((k) => {
            let cell = row[k] ?? "";
            cell = String(cell).replace(/"/g, '""');
            return `"${cell}"`;
          })
          .join(separator)
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
