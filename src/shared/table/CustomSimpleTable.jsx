import React, { useState, useMemo, useEffect, useRef } from "react";
import { Paginator } from "primereact/paginator";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";
import { getDate, getDateTime } from "@utils/dateTime";
import CustomInput from "../inputs/CustomInput";
import CustomCalendarInput from "../inputs/CustomCalendarInput";
import { capitalizeCamelCase } from "../../utils/common";

const CustomSimpleTable = ({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onDeleteTitle,
  onView,
  reorderableRows,
  onRowReorder,
  rowsPerPage = null,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // useEffect(() => {
  //   setTableData(data);
  // }, [data]);

  const tableData = useMemo(() => data, [data]);

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

  // -------- Sorting Logic -------- //
  const onSort = (field) => {
    if (reorderableRows) return;
    let direction = "asc";
    if (sortConfig.key === field && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: field, direction });
  };

  const sortedData = useMemo(() => {
    if (reorderableRows || !sortConfig.key) return tableData;
    return [...tableData].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA === undefined || valB === undefined) return 0;

      if (typeof valA === "string") {
        return sortConfig.direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    });
  }, [tableData, sortConfig, reorderableRows]);

  // -------- Render Actions Column if Needed -------- //
  const renderActions = (row) => (
    <div className="flex gap-2 justify-content-start">
      {onView && (
        <i className="pi pi-eye cursor-pointer" onClick={() => onView(row)}></i>
      )}
      {onEdit && (
        <i
          className="pi pi-pencil cursor-pointer"
          onClick={() => onEdit(row)}
        ></i>
      )}
      {onDelete && (
        <i
          title={onDeleteTitle}
          className="pi pi-trash cursor-pointer"
          onClick={() => onDelete(row)}
        ></i>
      )}
    </div>
  );

  const finalColumns = [...columns];
  if (reorderableRows) {
    finalColumns.unshift({
      field: "",
      header: "",
      body: () => <i className="pi pi-bars" style={{ cursor: "grab" }}></i>,
      style: { width: "3rem" },
    });
  }
  if (onEdit || onDelete || onView) {
    finalColumns.push({
      field: "actions",
      header: "Actions",
      body: renderActions,
      style: { width: "120px" },
    });
  }

  const totalPages = rowsPerPage ? Math.ceil(sortedData.length / rowsPerPage) : 1;
  const pagedData = rowsPerPage
    ? sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : sortedData;

  return (
    <div className="custom-simple-table-wrapper">
      <table className="custom-simple-table">
        <thead>
          <tr>
            {finalColumns.map((col) => (
              <th
                key={col.field || col.header}
                onClick={() =>
                  col.sortable && !reorderableRows && onSort(col.field)
                }
                className={col.sortable && !reorderableRows ? "sortable" : ""}
                style={col.style}
              >
                {col.header || col.field}
                {col.sortable && !reorderableRows && (
                  <span className="sort-icon">
                    {sortConfig.key === col.field
                      ? sortConfig.direction === "asc"
                        ? " ▲"
                        : " ▼"
                      : " ↕"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {pagedData.length > 0 ? (
            pagedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                draggable={reorderableRows}
                onDragStart={(e) => setDraggedIndex(rowIndex)}
                onDragEnd={() => setDraggedIndex(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedIndex === null || draggedIndex === rowIndex)
                    return;

                  const newData = [...data];
                  const [removed] = newData.splice(draggedIndex, 1);
                  newData.splice(rowIndex, 0, removed);

                  onRowReorder?.(newData);
                }}
                className={draggedIndex === rowIndex ? "opacity-50" : ""}
              >
                {finalColumns.map((col) => (
                  <td key={col.field || col.header} style={col.style}>
                    {col.body
                      ? col.body(row, rowIndex)
                      : formatCellValue(row[col.field], col)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={finalColumns.length} className="no-data">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {rowsPerPage && sortedData.length > rowsPerPage && (
        <Paginator
          first={(currentPage - 1) * rowsPerPage}
          rows={rowsPerPage}
          totalRecords={sortedData.length}
          onPageChange={(e) => setCurrentPage(Math.floor(e.first / rowsPerPage) + 1)}
        />
      )}
    </div>
  );
};

CustomSimpleTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

const CustomSimpleSelectionTable = ({
  columns = [],
  data = [],
  preselectedRows = [],
  searchFields = [],
  onSelectionChange, // send selected rows to parent
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedRows, setSelectedRows] = useState(preselectedRows);
  const [searchValues, setSearchValues] = useState({});
  const isSearchMounted = useRef(true);

  useEffect(() => {
    if (isSearchMounted.current) {
      isSearchMounted.current = false;
      return;
    }
    setSelectedRows([]);
    onSelectionChange?.([]);
  }, [searchValues]);

  const dropdowns = useSelector((state) => state.dropdown);
  const { formatCurrency } = useCurrencyFormatter();

  const isDateField = (field) =>
    field.toLowerCase().includes("date") || field.toLowerCase().includes("dob");

  const formatTime = (value) => {
    if (!value) return "-";

    if (/^\d{2}:\d{2}$/.test(value)) {
      let [h, m] = value.split(":").map(Number);
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
    }

    const d = new Date(value);
    if (isNaN(d)) return value;
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCellValue = (value, col) => {
    if (value === undefined || value === null) return "-";
    if (col.isBoolean) return value ? "Yes" : "No";
    if (col.isCurrency) return formatCurrency(value);
    if (col.isDateTime) return getDateTime(value);
    if (col.isDate) return getDate(value);
    if (col.isTime) return formatTime(value);

    if (col.optionsKey && dropdowns?.[col.optionsKey]) {
      const match = dropdowns[col.optionsKey]?.find((o) => o._id === value);
      return match?.title || "-";
    }
    return value.toString();
  };

  // Sorting
  const onSort = (field) => {
    let direction = "asc";
    if (sortConfig.key === field && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: field, direction });
  };

  const normalizeDate = (val) => {
    if (!val) return "";
    const d = new Date(val);
    if (isNaN(d)) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const filteredData = useMemo(() => {
    if (!searchFields.length) return data;

    return data.filter((row) =>
      searchFields.every((field) => {
        const rawSearch = searchValues[field];
        if (!rawSearch) return true;

        const value = row[field];
        if (value === null || value === undefined) return false;

        // DATE FIELD
        if (isDateField(field)) {
          const searchDate = normalizeDate(rawSearch);
          const rowDate = normalizeDate(value);
          return rowDate === searchDate;
        }

        // NORMAL TEXT FIELD
        const search = rawSearch.toString().toLowerCase();
        const rowValue = value.toString().toLowerCase();

        return rowValue.includes(search);
      }),
    );
  }, [data, searchValues, searchFields]);

  // const filteredData = useMemo(() => {
  //   if (!searchFields.length) return data;

  //   return data.filter((row) =>
  //     searchFields.every((field) => {
  //       const rawSearch = searchValues[field];
  //       if (!rawSearch) return true;

  //       const search =
  //         rawSearch instanceof Date
  //           ? getDate(rawSearch).toLowerCase()
  //           : rawSearch.toString().toLowerCase();

  //       const value = row[field];
  //       if (value === null || value === undefined) return false;

  //       const rowValue =
  //         value instanceof Date
  //           ? getDate(value).toLowerCase()
  //           : value.toString().toLowerCase();

  //       return rowValue.includes(search);
  //     }),
  //   );
  // }, [data, searchValues, searchFields]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (typeof valA === "string") {
        return sortConfig.direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    });
  }, [filteredData, sortConfig]);

  // Selection Logic
  const toggleRow = (row) => {
    let updated = [];

    if (selectedRows.includes(row)) {
      updated = selectedRows.filter((r) => r !== row);
    } else {
      updated = [...selectedRows, row];
    }

    setSelectedRows(updated);
    onSelectionChange?.(updated);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === sortedData.length) {
      setSelectedRows([]);
      onSelectionChange?.([]);
    } else {
      setSelectedRows(sortedData);
      onSelectionChange?.(sortedData);
    }
  };

  const finalColumns = [
    {
      header: (
        <input
          type="checkbox"
          checked={
            selectedRows.length === sortedData.length && sortedData.length > 0
          }
          onChange={toggleSelectAll}
        />
      ),
      body: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row)}
          onChange={() => toggleRow(row)}
        />
      ),
      width: "50px",
    },
    ...columns,
  ];

  return (
    <>
      <div className="c-grid flex flex-column gap-2">
        {searchFields.length > 0 && (
          <div className="flex w-full gap-2 justify-content-between ">
            {/* {searchFields.map((field) => (
              <CustomInput
                key={field}
                onChange={(e) =>
                  setSearchValues((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
                col={4}
                value={searchValues[field] || ""}
                placeholder={`Search by ${capitalizeCamelCase(field)}`}
              />
            ))} */}

            {searchFields.map((field) => {
              const isDate = isDateField(field);

              return isDate ? (
                <CustomCalendarInput
                  key={field}
                  col={4}
                  value={searchValues[field] || null}
                  placeholder={`Search by ${capitalizeCamelCase(field)}`}
                  onChange={(e) =>
                    setSearchValues((prev) => ({
                      ...prev,
                      [field]: e.value || "",
                    }))
                  }
                />
              ) : (
                <CustomInput
                  key={field}
                  col={4}
                  value={searchValues[field] || ""}
                  placeholder={`Search by ${capitalizeCamelCase(field)}`}
                  onChange={(e) =>
                    setSearchValues((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                />
              );
            })}
          </div>
        )}

        <div className="custom-simple-table-wrapper w-full">
          <table className="custom-simple-table">
            <thead>
              <tr>
                {finalColumns.map((col, idx) => (
                  <th
                    key={idx}
                    onClick={() => col.sortable && onSort(col.field)}
                    className={col.sortable ? "sortable" : ""}
                    style={{ width: col.width }}
                  >
                    {col.header}
                    {col.sortable && (
                      <span className="sort-icon">
                        {sortConfig.key === col.field
                          ? sortConfig.direction === "asc"
                            ? " ▲"
                            : " ▼"
                          : " ↕"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sortedData.length ? (
                sortedData.map((row, idx) => (
                  <tr key={idx}>
                    {finalColumns.map((col, colIndex) => (
                      <td key={colIndex}>
                        {col.body
                          ? col.body(row, idx)
                          : formatCellValue(row[col.field], col)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={finalColumns.length} className="no-data">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

CustomSimpleSelectionTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func,
};

export { CustomSimpleSelectionTable };
export default CustomSimpleTable;
