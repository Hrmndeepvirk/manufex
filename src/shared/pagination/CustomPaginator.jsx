import { Paginator } from "primereact/paginator";

export default function CustomPaginator({
  page,
  rows = 20,
  totalRecords = 0,
  onPageChange,
  className = "",
}) {
  if (!totalRecords || totalRecords <= rows) return null;

  return (
    <div className={`flex justify-content-center ${className}`.trim()}>
      <Paginator
        first={(page - 1) * rows}
        rows={rows}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        style={{ background: "transparent", border: "none" }}
      />
    </div>
  );
}
