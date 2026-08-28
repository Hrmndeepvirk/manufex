import React, { useContext } from "react";
import { Skeleton } from "primereact/skeleton";
import { capitalizeCamelCase } from "@utils/common";
import { FormPageContext } from "../context/FormPageContext";

function InputLayout({
  label = "",
  name = "",
  required = false,
  col = 12,
  extraClassName = "",
  errorMessage = "",
  data = {},
  maxLength,
  children,
  hideLabel = false,
  helpText,
  extraHeaders = null,
}) {
  const { loading } = useContext(FormPageContext);
  const column = Math.min(Number(col) || 12, 12);
  const fieldError = errorMessage || data?.formErrors?.[name];

  return (
    <div
      className={`input-layout c-col-12 md:c-col-${column} ${extraClassName}`}
    >
      {!hideLabel && (
        <div className="flex justify-content-between">
          <label htmlFor={name}>
            {label || capitalizeCamelCase(name)}
            {required && <span className="required">*</span>}
          </label>
          {maxLength && (
            <span className="ml-1 text-xs">
              ({data?.[name]?.length ?? 0}/{maxLength})
            </span>
          )}
          {helpText && (
            <span className="ml-1 text-color-primary" title={helpText}>
              <i className="pi pi-info-circle text-xs"></i>
            </span>
          )}
          {extraHeaders && extraHeaders}
        </div>
      )}

      {loading ? <Skeleton height="3rem"></Skeleton> : <>{children}</>}

      {fieldError && (
        <small className="text-left p-error block mt-1" id="error-element">
          {fieldError}
        </small>
      )}
    </div>
  );
}
export default React.memo(InputLayout);
