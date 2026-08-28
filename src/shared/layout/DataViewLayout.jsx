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

function DataViewLayout({
  title,
  buttonLabel = "Add New",
  buttonIcon = "pi pi-plus",
  onClick,
  linkTo,
  extraContent,
  addPadding,
  content,
  children,
  searchable = [],
  tableData = [],
  columns = [],
  onEdit,
  onDelete,
  onView,
  loading,
}) {
  const dropdowns = useSelector((state) => state.dropdown);
  const AllOptions = { ...dropdowns, ...dropdownConstants };
  const navigate = useNavigate();
  const { formatCurrency } = useCurrencyFormatter();

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearchChange = (e) => setSearchTerm(e.value);

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    else if (linkTo) navigate(linkTo);
  };

  // --- Search logic ---
  const filteredData = useMemo(() => {
    if (!searchTerm || searchable.length === 0) return tableData;
    return tableData.filter((item) =>
      searchable.some((field) =>
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, searchable, tableData]);

  // --- Helper templates (reused from ListPageLayout) ---
  function optionsTemplate(rowData, col) {
    let optionsKey = col.optionsKey;
    let field = col.field;
    if (optionsKey && AllOptions[optionsKey]) {
      let option = AllOptions[optionsKey].find(
        (opt) => opt._id === rowData[field]
      );
      return option ? option.title : "-";
    }
    return rowData[field] ? rowData[field] : "-";
  }

  function booleanOptionsTemplate(rowData, col) {
    let field = col.field;
    return rowData[field] ? "Yes" : "No";
  }

  function currencyOptionsTemplate(rowData, col) {
    let field = col.field;
    return rowData[field] ? formatCurrency(rowData[field]) : "-";
  }

  function dateTimeTemplate(rowData, key = "createdAt") {
    return rowData[key] ? getDateTime(rowData[key]) : "-";
  }

  function dateTemplate(rowData, key = "createdAt") {
    return rowData[key] ? getDate(rowData[key]) : "-";
  }

  // --- Special renderer for payType field ---
  const renderPayTypeData = (item) => {
    switch (item.payType) {
      case "INCREMENTAL_PAY":
        return (
          <div className="flex flex-wrap gap-2">
            {[
              ["1-5 Clients", `${formatCurrency(item?.oneToFiveClients)}`],
              [
                "6-10 Clients",
                `${formatCurrency(item?.item?.sixToTenClients)}`,
              ],
              [
                "11-15 Clients",
                `${formatCurrency(item?.elevenToFifteenClients)}`,
              ],
              [
                "16-20 Clients",
                `${formatCurrency(item?.sixteenToTwentyClients)}`,
              ],
              [
                "21-25 Clients",
                `${formatCurrency(item?.twentyOneToTwentyFiveClients)}`,
              ],
              ["26+ Clients", `${formatCurrency(item?.twentySixPlusClients)}`],
              ["No Reg. Pay", `${formatCurrency(item?.noRegistrationPay)}`],
            ].map(([label, value], i) => (
              <PayField key={i} label={label} value={value} />
            ))}
          </div>
        );

      case "PAY_PER_CLIENT":
        return (
          <div className="flex flex-wrap gap-2">
            <PayField
              label="Base Rate"
              value={`${formatCurrency(item?.baseRate)}`}
            />
            <PayField
              label="Per Client Rate"
              value={`${formatCurrency(item?.payPerClientRate)}`}
            />

            {item?.eachClientOver?.slice(0, 3).map((entry, i) => (
              <PayField
                key={i}
                label={`${entry.noOfClients} Clients`}
                value={`${formatCurrency(entry.rate)}`}
              />
            ))}

            <PayField
              label="No Reg. Pay"
              value={`${formatCurrency(item?.noRegistrationPay)}`}
            />
            <PayField
              label="Max Pay"
              value={`${formatCurrency(item?.maxPayPerClient)}`}
            />
          </div>
        );

      case "PAY_PER_CLASS":
        return (
          <div className="flex flex-wrap gap-2">
            <PayField
              label="Rate / Class"
              value={`${formatCurrency(item?.payPerClassRate)}`}
            />
            <PayField
              label="No Reg. Pay"
              value={`${formatCurrency(item?.noRegistrationPay)}`}
            />
          </div>
        );

      case "PERCENTAGE_RATE":
        return (
          <div className="flex flex-wrap gap-2">
            <PayField label="Percentage" value={`${item?.percentage}%`} />
            <PayField
              label="No Reg. Pay"
              value={`${formatCurrency(item?.noRegistrationPay)}`}
            />
          </div>
        );

      default:
        return <span className="text-gray-500">—</span>;
    }
  };

  const PayField = ({ label, value }) => (
    <div className="bg-white px-2 py-1 border-round text-sm border">
      <span className="text-gray-700 font-medium">{label}: </span>
      <span className="text-gray-800">{value ?? 0}</span>
    </div>
  );

  let columnsWithStyles = columns.map((col) => {
    if (col.field === "payTypeDetails") {
      return {
        ...col,
        header: col.header || "Details",
        body: (row) => renderPayTypeData(row),
        style: { minWidth: "400px", ...col.style },
      };
    }

    if (col.optionsKey) col.body = (row) => optionsTemplate(row, col);
    if (col.isBoolean) col.body = (row) => booleanOptionsTemplate(row, col);
    if (col.isCurrency) col.body = (row) => currencyOptionsTemplate(row, col);
    if (col.isDateTime)
      col.body = (row) => dateTimeTemplate(row, col.field || "createdAt");
    if (col.isDate)
      col.body = (row) => dateTemplate(row, col.field || "createdAt");

    return {
      ...col,
      style: { width: "200px", ...col.style },
    };
  });

  // --- Action column (edit/view/delete) ---
  const confirmDelete = (id) =>
    customConfirmDialog({
      message: "Do you want to delete this record?",
      accept: () => onDelete(id),
    });

  if (onDelete || onEdit || onView) {
    columnsWithStyles.push({
      field: "actions",
      header: "Actions",

      body: (rowData) =>
        actionBodyTemplate(rowData, onEdit, onDelete, onView, navigate),
    });
  }

  function actionBodyTemplate(rowData, onEdit, onDelete, onView, navigate) {
    return (
      <div className="flex gap-2 justify-center">
        {onView && (
          <span
            onClick={(e) => onView(rowData._id, navigate, e)}
            className="p-1 cursor-pointer"
            title="View"
          >
            <i className="pi pi-eye my-auto" />
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
      </div>
    );
  }

  // --- Final Render ---
  return (
    <div style={{ padding: addPadding ? "0 10px" : "0" }}>
      <div className="flex justify-content-between my-3">
        {title && (
          <>
            <div className="text-primary-color text-xl font-bold my-auto">
              {title}
            </div>
          </>
        )}
        {extraContent && <>{content}</>}

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
      />

      {children}
    </div>
  );
}

export default React.memo(DataViewLayout);
