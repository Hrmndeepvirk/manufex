import React, { useMemo } from "react";

import PrimaryButton from "../buttons/PrimaryButton";
import CustomInput from "../inputs/CustomInput";
import CustomTable from "../table/CustomTable";
import { useNavigate } from "react-router-dom";
import { getDate, getDateTime } from "@utils/dateTime";

import dropdownConstants from "@utils/dropdownConstants";
import { customConfirmDialog } from "../overlays/CustomConfirmDialog";
import { useSelector } from "react-redux";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";

function ListPageLayout({
  title,
  buttonLabel = "Add New",
  buttonIcon = "pi pi-plus",
  onClick,
  linkTo,
  extraContent,
  reorderableRows,
  onRowReorder,
  content,
  children,
  searchable = [],
  tableData = [],
  columns = [],
  onEdit,
  addPadding,
  onDelete,
  onView,
  onSell,
  onCopy,
  copyIcon = "pi pi-copy",
  copyLabel = "Copy",
  onShift,
  loading,
}) {
  const dropdowns = useSelector((state) => state.dropdown);
  const AllOptions = { ...dropdowns, ...dropdownConstants };

  const { formatCurrency } = useCurrencyFormatter();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const handleSearchChange = (e) => {
    setSearchTerm(e.value);
  };
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    } else if (linkTo) {
      navigate(linkTo);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm || searchable.length === 0) {
      return tableData;
    }
    return tableData.filter((item) => {
      return searchable.some((field) => {
        return item[field]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    });
  }, [searchTerm, searchable, tableData]);

  let columnsWithStyles = useMemo(
    () =>
      columns.map((col) => {
        switch (col.field) {
          case "title":
            return {
              ...col,
              style: { width: "300px" },
            };
          case "description":
            return {
              ...col,
              body: descriptionTemplate,
              style: { maxWidth: "200px" },
            };
          case "createdAt":
            return {
              ...col,
              body: (row) => dateTimeTemplate(row),
              style: { width: "200px" },
            };
          case "isActive":
            return {
              ...col,
              header: "Active",
              body: activeStatusTemplate,
              style: { width: "100px" },
            };

          default:
            if (col.optionsKey) {
              col.body = (row) => optionsTemplate(row, col);
            }
            if (col.isBoolean) {
              col.body = (row) => booleanOptionsTemplate(row, col);
            }
            if (col.isCurrency) {
              col.body = (row) => currencyOptionsTemplate(row, col);
              col.style = { minWidth: "150px", ...col.style };
            }
            if (col.isDateTime) {
              col.body = (row) => dateTimeTemplate(row, col.field);
              col.style = { minWidth: "150px", ...col.style };
            }
            if (col.isDate) {
              col.body = (row) => dateTemplate(row, col.field);
              col.style = { minWidth: "150px", ...col.style };
            }
            return {
              ...col,
              style: { width: "200px", ...col.style },
            };
        }
      }),
    [columns, AllOptions],
  );

  const confirmDelete = (id) => {
    customConfirmDialog({
      message: "Do you want to delete this record?",
      accept: () => onDelete(id),
      reject: () => {},
    });
  };

  const confirmCopy = (id, rowData, e) => {
    customConfirmDialog({
      message: `Do you want to ${copyLabel.toLowerCase()} this record?`,
      accept: () => onCopy(id, rowData, e),
      reject: () => {},
    });
  };

  if (onDelete || onEdit || onView || onSell || onCopy) {
    let actionCol = {
      field: "actions",
      header: "Actions",
      style: { width: "150px" },
      body: (rowData) =>
        actionBodyTemplate(
          rowData,
          onEdit,
          onSell,
          onCopy,
          onDelete,
          onView,
          navigate,
          confirmDelete,
          confirmCopy,
          copyIcon,
          copyLabel,
          onShift,
        ),
      };
    columnsWithStyles.push(actionCol);
  }

  function optionsTemplate(rowData, col) {
    let optionsKey = col.optionsKey;
    let field = col.field;
    if (optionsKey && AllOptions[optionsKey]) {
      let option = AllOptions[optionsKey].find(
        (opt) => opt._id === rowData[field],
      );
      return option ? option.title : "-";
    }
    return rowData[field] ? rowData[field] : "-";
  }
  function booleanOptionsTemplate(rowData, col) {
    let field = col.field;
    if (field) {
      return rowData[field] ? "Yes" : "No";
    }
    return "-";
  }
  function currencyOptionsTemplate(rowData, col) {
    let field = col.field;
    if (field) {
      return rowData[field] ? formatCurrency(rowData[field]) : "-";
    }
    return "-";
  }
  function dateTimeTemplate(rowData, key = "createdAt") {
    if (rowData[key]) {
      return getDateTime(rowData[key]);
    }
    return "-";
  }
  function dateTemplate(rowData, key = "createdAt") {
    if (rowData[key]) {
      return getDate(rowData[key]);
    }
    return "-";
  }
  function activeStatusTemplate(rowData) {
    return rowData.isActive ? "Yes" : "No";
  }
  function descriptionTemplate(rowData) {
    return (
      <div className="truncate">
        {rowData.description ? rowData.description : "-"}
      </div>
    );
  }
  function actionBodyTemplate(
    rowData,
    onEdit,
    onSell,
    onCopy,
    onDelete,
    onView,
    navigate,
    confirmDelete,
    confirmCopy,
    copyIcon,
    copyLabel,
    onShift,
  ) {
    return (
      <div className="flex gap-2">
        {onShift && (
          <span
            onClick={(e) => onShift(rowData._id, navigate, e)}
            className="p-1 cursor-pointer"
            title="View"
          >
            <i className="bi bi-calendar2-week my-auto" />
          </span>
        )}
        {onView && (
          <span
            onClick={(e) => onView(rowData._id, navigate, e)}
            className="p-1 cursor-pointer"
            title="View"
          >
            <i className="pi pi-eye my-auto" />
          </span>
        )}

        {onCopy && (
          <span
            onClick={(e) => confirmCopy(rowData?._id, rowData, e)}
            className="p-1 cursor-pointer"
            title={copyLabel}
          >
            <i className={`${copyIcon} my-auto`}></i>
          </span>
        )}

        {onEdit && (
          <span
            onClick={(e) => onEdit(rowData._id, navigate, rowData, e)}
            className="p-1 cursor-pointer"
            title="Edit"
          >
            <i className="pi pi-pencil my-auto" />
          </span>
        )}

        {onDelete && (
          <span
            onClick={(e) => confirmDelete(rowData._id)}
            className="p-1 cursor-pointer"
            title="Delete"
          >
            <i className="pi pi-trash my-auto" />
          </span>
        )}

        {onSell && (
          <span
            onClick={(e) => onSell(rowData)}
            className="p-1 cursor-pointer w-full"
            title="Sell Plan"
          >
            <i className="bi bi-cart4 text-xl items-center my-auto" />
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: addPadding ? "0 10px" : "0" }}>
      <div className="flex justify-content-between my-3">
        <div className="text-primary-color text-xl font-bold my-auto">
          {title}
          {extraContent && <>{content}</>}
        </div>
        <div className="flex justify-content-between gap-2">
          {searchable?.length > 0 && (
            <CustomInput
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              hideLabel
            />
          )}
          {(onClick || linkTo) && (
            <PrimaryButton
              label={buttonLabel}
              icon={buttonIcon}
              onClick={handleClick}
            />
          )}
        </div>
      </div>
      <CustomTable
        data={filteredData}
        columns={columnsWithStyles}
        loading={loading}
        onRowReorder={onRowReorder}
        reorderableRows={reorderableRows}
      />
      {children}
    </div>
  );
}
export default React.memo(ListPageLayout);
