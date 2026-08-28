import React, { useMemo } from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import CustomInput from "../inputs/CustomInput";
import CustomTable from "../table/CustomTable";
import { useNavigate } from "react-router-dom";

export default function CustomPage({
  title,
  buttonLabel = "Add New",
  buttonIcon = "pi pi-plus",
  onClick,
  linkTo,
  children,
  searchable = [],
  tableData = [],
  columns = [],
}) {
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
    return tableData.filter((item) => {
      return searchable.some((field) => {
        return item[field]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    });
  }, [searchTerm, searchable, tableData]);

  let columnsWithStyles = columns.map((col) => ({
    ...col,
    style: { minWidth: col.minWidth || "150px", ...col.style },
  }));

  return (
    <div>
      <div className="flex justify-content-between my-3">
        <div className="text-primary-color text-xl font-bold my-auto">
          {title}
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

      <CustomTable data={filteredData} columns={columnsWithStyles} />
      {children}
    </div>
  );
}
