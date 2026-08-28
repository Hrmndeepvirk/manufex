import React from "react";
import { InputNumber } from "primereact/inputnumber";
import InputLayout from "./InputLayout";
import { capitalizeCamelCase } from "@utils/common";
import { useSelector } from "react-redux";

function CustomCurrencyInput({
  label,
  name,
  data = {},
  value,
  onChange,
  errorMessage,
  extraClassName = "",
  required = false,
  col = 4,
  disabled = false,
  placeholder,
  hideLabel = false,
  helpText,
  ...props
}) {
  const company = useSelector((state) => state.company.details);
  const code = company?.currency?.code || "USD";
  const locale = company?.currency?.locale || "en-US";

  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
      hideLabel={hideLabel}
      helpText={helpText}
    >
      <InputNumber
        id={name}
        name={name}
        value={value ?? data?.[name] ?? ""}
        onChange={(e) => onChange?.({ ...e, name, value: e.value })}
        className={`w-full ${errorMessage ? "p-invalid" : ""}`}
        placeholder={
          placeholder || `Enter ${label || capitalizeCamelCase(name)}`
        }
        disabled={disabled}
        max={10000000000}
        mode="currency"
        currency={code}
        locale={locale}
        {...props}
      />
    </InputLayout>
  );
}

export default React.memo(CustomCurrencyInput);
