import React from "react";
import { InputMask } from "primereact/inputmask";
import InputLayout from "./InputLayout";
import { capitalizeCamelCase } from "@utils/common";

function CustomInputMask({
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
  type = "text",
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
      <InputMask
        id={name}
        name={name}
        value={value ?? data?.[name] ?? ""}
        type={type}
        onChange={(e) =>
          onChange?.({ ...e, name: e.target.name, value: e.target.value })
        }
        className={`w-full ${errorMessage ? "p-invalid" : ""}`}
        placeholder={
          placeholder || `Enter ${label || capitalizeCamelCase(name)}`
        }
        maxLength={maxLength}
        disabled={disabled}
        {...props}
      />
    </InputLayout>
  );
}

export default React.memo(CustomInputMask);
