import React from "react";
import { useSelector } from "react-redux";
import dropdownConstants from "../../utils/dropdownConstants";
import InputLayout from "./InputLayout";

function CustomOptionSelect({
  label,
  name,
  onChange,
  data,
  value,
  errorMessage,
  extraClassName,
  required,
  col = 12,
  disabled = false,
  optionLabel = "title",
  optionValue = "_id",
  hideLabel = false,
  options = [],
  optionsType = null,
  booleanOptions = false,
  multiple = false,
  helpText,
}) {
  const _value = value ?? data?.[name] ?? (multiple ? [] : "");

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

  const handleClick = (optVal) => {
    if (disabled) return;

    if (multiple) {
      const current = Array.isArray(_value) ? _value : [];
      const next = current.includes(optVal)
        ? current.filter((v) => v !== optVal)
        : [...current, optVal];
      onChange?.({ name, value: next });
    } else {
      onChange?.({ name, value: optVal });
    }
  };

  const isSelected = (optVal) => {
    if (multiple) {
      return Array.isArray(_value) && _value.includes(optVal);
    }
    return _value === optVal;
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
      helpText={helpText}
    >
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const optVal = opt[optionValue];
          const optText = opt[optionLabel];
          const selected = isSelected(optVal);

          return (
            <span
              key={String(optVal)}
              className={`option-select-chip px-3 py-2 text-sm font-semibold ${selected ? "option-select-chip--selected" : ""} ${disabled ? "option-select-chip--disabled" : "hover:shadow-1"}`}
              onClick={() => handleClick(optVal)}
            >
              {optText}
            </span>
          );
        })}
      </div>
    </InputLayout>
  );
}

export default React.memo(CustomOptionSelect);
