import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Lottie from "lottie-react";
import NoTableData from "@assets/lotties/NoTableData.json";
import { capitalizeCamelCase } from "@utils/common";
import { useSelector } from "react-redux";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";
import { getDate, getDateTime } from "@utils/dateTime";

export default function CustomTable({
  data = [],
  columns = [],
  rowsPerPage = 10,
  reorderableRows,
  onRowReorder,
  loading,
  minWidth = "50rem",
  onRowClick,
}) {
  const dropdowns = useSelector((state) => state.dropdown);
  const { formatCurrency } = useCurrencyFormatter();

  const formatTime = (value) => {
    if (!value) return "-";

    // If value is only HH:mm (not a Date string)
    if (/^\d{2}:\d{2}$/.test(value)) {
      let [hours, minutes] = value.split(":").map(Number);
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    }

    // fallback for actual date strings
    const date = new Date(value);
    if (isNaN(date)) return value; // return raw value if invalid date
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // -------- Helper Formatter (embedded here) -------- //
  const formatCellValue = (value, col) => {
    if (value === undefined || value === null) return "-";

    if (col.isBoolean) return value ? "Yes" : "No";

    if (col.isCurrency) return formatCurrency ? formatCurrency(value) : value;

    if (col.isDateTime) return getDateTime(value);

    if (col.isDate) return getDate(value);

    if (col.isTime) return formatTime(value);

    if (col.optionsKey && dropdowns?.[col.optionsKey]) {
      const match = dropdowns[col.optionsKey]?.find((o) => o._id === value);
      return match?.title || "-";
    }

    return value.toString();
  };

  let EmptyMessage = (
    <div className="text-center">
      <div className="mx-auto" style={{ width: "200px" }}>
        <Lottie animationData={NoTableData} />
      </div>
      <div className="text-sm text-secondary -mt-5">
        {loading ? (
          <>
            Loading data... <br /> Please wait while we fetch the latest
            information!
          </>
        ) : (
          <>
            No data available right now. <br /> Maybe try a different search or
            add a new entry!
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="custom-table">
      {onRowClick && (
        <style>{`
          .custom-table .p-datatable .p-datatable-tbody tr.clickable-row:hover > td {
            background-color: #e4e9f5 !important;
          }
        `}</style>
      )}
      <DataTable
        value={data}
        dataKey="_id"
        tableStyle={{ minWidth }}
        paginator={data.length > rowsPerPage}
        rows={rowsPerPage}
        reorderableRows={reorderableRows}
        onRowReorder={onRowReorder}
        emptyMessage={EmptyMessage}
        onRowClick={onRowClick}
        rowClassName={onRowClick ? () => "clickable-row" : undefined}
      >
        {reorderableRows && <Column rowReorder style={{ width: "3rem" }} />}
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header || capitalizeCamelCase(col.field)}
            sortable={col.sortable}
            filter={col.filter}
            body={
              col.body ||
              ((rowData) => formatCellValue(rowData[col.field], col))
            }
            {...col}
            bodyStyle={{
              ...(onRowClick ? { cursor: "pointer" } : {}),
              ...(col.bodyStyle || {}),
            }}
          />
        ))}
      </DataTable>
    </div>
  );
}
