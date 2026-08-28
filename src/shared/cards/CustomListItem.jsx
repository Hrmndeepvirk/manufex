import React, { useContext } from "react";
import { Skeleton } from "primereact/skeleton";
import { capitalizeCamelCase } from "@utils/common";
import { FormPageContext } from "../context/FormPageContext";

function CustomListItem({
  label,
  name,
  data,
  value,
  keys,
  dynamicKey,
  children,
}) {
  const { loading } = useContext(FormPageContext);
  if (!label) {
    if (name) {
      label = capitalizeCamelCase(name);
    }
  }
  const formatValue = (val) => {
    if (typeof val === "boolean") {
      return val ? "Yes" : "No";
    }
    if (val && typeof val === "object") {
      if (val.name) {
        return val.name;
      }
      return JSON.stringify(val);
    }
    return val ? val : "-";
  };

  let displayValue = "-";
  if (value) {
    displayValue = formatValue(value);
  } else if (keys && Array.isArray(keys)) {
    const values = keys.map((key) => formatValue(key[dynamicKey])).join(", ");
    displayValue = values ? values : "-";
  } else {
    displayValue = formatValue(data?.[name]);
  }

  return (
    <div className="c-col-12 custom-list-item">
      <div className="flex justify-content-between">
        <div className="font-semibold text-highlight">{label}</div>

        {loading ? (
          <Skeleton width="6rem" height="1.5rem"></Skeleton>
        ) : (
          <>
            {children ? (
              <span>{children}</span>
            ) : (
              <span className="text-color-primary">{displayValue}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
export default React.memo(CustomListItem);
