import React from "react";
import { Chips } from "primereact/chips";
import InputLayout from "./InputLayout";
import { capitalizeCamelCase } from "@utils/common";

function CustomChipInput({
  label,
  name,
  onChange,
  data,
  value,
  errorMessage,
  extraClassName,
  required,
  col = 4,
  disabled = false,
  placeholder,
  hideLabel = false,
  clearable = false,
  separator = ",",
  allowDuplicate = true,
  max = null,
  ...props
}) {
  const _value = value ?? data?.[name] ?? [];

  const handleChange = (e) => {
    let chipsValue = e.value;

    if (max && chipsValue.length > max) {
      chipsValue = chipsValue.slice(0, max);
    }

    onChange?.({ name, value: chipsValue });
  };

  return (
    <InputLayout
      col={col || 6}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
      hideLabel={hideLabel}
    >
      <Chips
        id={name}
        name={name}
        value={_value}
        onChange={handleChange}
        className={`w-full ${errorMessage ? "p-invalid" : ""}`}
        disabled={disabled}
        placeholder={placeholder ?? "Press enter to add value"}
        separator={separator}
        allowDuplicate={allowDuplicate}
        {...props}
      />

      {clearable && _value?.length > 0 && (
        <button
          type="button"
          onClick={() => onChange?.({ name, value: [] })}
          className="mt-2 text-sm text-blue-500 hover:underline"
        >
          Clear All
        </button>
      )}
    </InputLayout>
  );
}

export default React.memo(CustomChipInput);
