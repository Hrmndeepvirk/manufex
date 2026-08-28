import React from "react";
import { InputText } from "primereact/inputtext";
import InputLayout from "./InputLayout";
import { capitalizeCamelCase } from "@utils/common";

function CustomInput({
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
  extraHeaders = null,
  inputRightElement = null,
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
      extraHeaders={extraHeaders}
    >
      <div className="relative w-full">
        <InputText
          id={name}
          name={name}
          value={value ?? data?.[name] ?? ""}
          type={type}
          onChange={(e) =>
            onChange?.({ ...e, name: e.target.name, value: e.target.value })
          }
          className={`w-full ${inputRightElement ? "pr-6" : ""} ${errorMessage ? "p-invalid" : ""}`}
          placeholder={
            placeholder || `Enter ${label || capitalizeCamelCase(name)}`
          }
          maxLength={maxLength}
          disabled={disabled}
          {...props}
        />
        {inputRightElement && (
          <span
            className="absolute top-50 right-0 mr-3 cursor-pointer flex align-items-center"
            style={{ transform: "translateY(-50%)" }}
          >
            {inputRightElement}
          </span>
        )}
      </div>
    </InputLayout>
  );
}

export default React.memo(CustomInput);
