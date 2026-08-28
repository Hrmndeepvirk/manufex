import React from "react";
import { MultiSelect } from "primereact/multiselect";
import InputLayout from "./InputLayout";
import { capitalizeCamelCase } from "@utils/common";
import { useSelector } from "react-redux";
import dropdownConstants from "../../utils/dropdownConstants";

const normalizeDisplayLabel = (value) =>
  value === null || value === undefined || value === "null" ? "" : value;

function CustomMultiSelect({
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
  clearable = false,
  booleanOptions = false,
  optionsType = null,
  ...props
}) {
  const _value = value ?? data?.[name] ?? "";

  const booleanOptionsList = [
    { title: "Yes", _id: true },
    { title: "No", _id: false },
  ];
  if (booleanOptions) {
    options = booleanOptionsList;
  }

  const dropdowns = useSelector((state) => state.dropdown);
  const allDropdowns = { ...dropdowns, ...dropdownConstants };
  if (optionsType) {
    options = allDropdowns[optionsType] || [];
  }

  const normalizedOptions = (options || []).map((option) => ({
    ...option,
    [optionLabel]: normalizeDisplayLabel(option?.[optionLabel]),
  }));

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
      <MultiSelect
        id={name}
        name={name}
        value={_value}
        onChange={(e) =>
          onChange?.({ ...e, name: e.target.name, value: e.value })
        }
        className={`w-full ${errorMessage ? "p-invalid" : ""}`}
        placeholder={
          placeholder || `Select ${label || capitalizeCamelCase(name)}`
        }
        options={normalizedOptions}
        optionLabel={optionLabel}
        optionValue={optionValue}
        disabled={disabled}
        showClear={_value && clearable}
        {...props}
      />
    </InputLayout>
  );
}

export default React.memo(CustomMultiSelect);
