import React from "react";
import { InputNumber } from "primereact/inputnumber";
import InputLayout from "./InputLayout";
import { capitalizeCamelCase } from "@utils/common";

function CustomNumberInput({
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
  maxLength,
  hideLabel = false,
  helpText,
  ...props
}) {
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
      maxLength={maxLength}
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
        maxLength={maxLength}
        disabled={disabled}
        maxFractionDigits={4}
        {...props}
      />
    </InputLayout>
  );
}

export default React.memo(CustomNumberInput);
