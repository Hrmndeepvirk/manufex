import React from "react";
import InputLayout from "./InputLayout";
import { capitalizeCamelCase } from "@utils/common";
import { Password } from "primereact/password";

function CustomPassword({
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
  autoComplete = "off",
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
      hideLabel={hideLabel}
    >
      <Password
        id={name}
        name={name}
        value={value ?? data?.[name] ?? ""}
        onChange={(e) =>
          onChange?.({ ...e, name: e.target.name, value: e.target.value })
        }
        className={`w-full ${errorMessage ? "p-invalid" : ""}`}
        placeholder={
          placeholder || `Enter ${label || capitalizeCamelCase(name)}`
        }
        disabled={disabled}
        feedback={false}
        toggleMask
        autoComplete={autoComplete}
        {...props}
      />
    </InputLayout>
  );
}
export default React.memo(CustomPassword);
