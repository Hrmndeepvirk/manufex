import React from "react";
import { InputTextarea } from "primereact/inputtextarea";
import InputLayout from "./InputLayout";
import { capitalizeCamelCase } from "@utils/common";

function CustomTextArea({
  label,
  name,
  data = {},
  value,
  onChange,
  errorMessage,
  extraClassName = "",
  required = false,
  col = 12,
  disabled = false,
  placeholder,
  maxLength,
  hideLabel = false,
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
    >
      <InputTextarea
        id={name}
        name={name}
        value={value ?? data?.[name] ?? ""}
        onChange={(e) =>
          onChange?.({ ...e, name: e.target.name, value: e.target.value })
        }
        className={`w-full ${errorMessage ? "p-invalid" : ""}`}
        placeholder={
          placeholder || `Enter ${label || capitalizeCamelCase(name)}...`
        }
        maxLength={maxLength}
        disabled={disabled}
        {...props}
      />
    </InputLayout>
  );
}
export default React.memo(CustomTextArea);
