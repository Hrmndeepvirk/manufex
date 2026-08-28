import React, { useMemo } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import InputLayout from "./InputLayout";
import { capitalizeCamelCase } from "@utils/common";
import { useSelector } from "react-redux";
import dropdownConstants from "../../utils/dropdownConstants";

function CustomInputDropdown({
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
  optionLabel = "title",
  optionValue = "_id",
  placeholder,
  hideLabel = false,
  options = [],
  optionsType = null,

  valueName = "value",
  unitName = "unit",
  inputClassName = "",
  dropdownClassName = "",
  inputStyle = null,
  dropdownStyle = null,
  numericOnly = false,

  ...props
}) {
  let _value = useMemo(
    () => value?.[valueName] || data?.[name]?.[valueName],
    [value, data]
  );

  let _unit = useMemo(
    () => value?.[unitName] || data?.[name]?.[unitName],
    [value, data]
  );

  const dropdowns = useSelector((state) => state.dropdown);
  const allDropdowns = { ...dropdowns, ...dropdownConstants };
  if (optionsType) {
    options = allDropdowns[optionsType] || [];
  }

  const handleNumericKeyDown = (e) => {
    if (!numericOnly) return;

    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];

    if (
      allowedKeys.includes(e.key) ||
      ((e.ctrlKey || e.metaKey) &&
        ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
    ) {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

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
      <div className="p-inputgroup">
        <InputText
          id={name}
          name={name}
          value={_value}
          onChange={(e) =>
            onChange?.({
              ...e,
              name: e.target.name,
              value: {
                [valueName]: numericOnly
                  ? String(e.target.value || "").replace(/[^0-9]/g, "")
                  : e.target.value,
                [unitName]: _unit,
              },
            })
          }
          onKeyDown={handleNumericKeyDown}
          inputMode={numericOnly ? "numeric" : undefined}
          pattern={numericOnly ? "[0-9]*" : undefined}
          className={`w-full ${inputClassName} ${
            errorMessage ? "p-invalid" : ""
          }`}
          style={inputStyle || undefined}
          placeholder={
            placeholder || `Enter ${label || capitalizeCamelCase(name)}`
          }
          disabled={disabled}
          {...props}
        />
        <Dropdown
          id={name}
          name={name}
          value={_unit}
          onChange={(e) =>
            onChange?.({
              ...e,
              name: e.target.name,
              value: { [valueName]: _value, [unitName]: e.value },
            })
          }
          className={`w-full ${dropdownClassName} ${
            errorMessage ? "p-invalid" : ""
          }`}
          style={dropdownStyle || undefined}
          options={options}
          optionLabel={optionLabel}
          optionValue={optionValue}
          disabled={disabled}
          {...props}
        />
      </div>
    </InputLayout>
  );
}

export default React.memo(CustomInputDropdown);
