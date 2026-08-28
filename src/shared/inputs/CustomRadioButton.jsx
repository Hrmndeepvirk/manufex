import React from "react";
import { RadioButton } from "primereact/radiobutton";
import { useSelector } from "react-redux";
import dropdownConstants from "../../utils/dropdownConstants";
import { capitalizeCamelCase } from "@utils/common";
import InputLayout from "./InputLayout";

function CustomRadioButton({
  label,
  name,
  value,
  data,
  onChange,
  options = [],
  optionsType = null,
  booleanOptions = false,
  optionLabel = "title",
  optionValue = "_id",
  disabled = false,
  className = "",
  horizontal = false,
  col = 4,
  errorMessage,
  required,
  hideLabel = false,
}) {
  const _value = value ?? data?.[name];

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

  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      errorMessage={errorMessage}
      hideLabel={hideLabel}
      data={data}
    >
      <div
        className={`flex gap-3 ${
          horizontal ? "flex-row" : "flex-column"
        } ${className}`}
      >
        {options.map((opt) => {
          const optionVal = opt[optionValue];
          const optionText = opt[optionLabel] ?? capitalizeCamelCase(optionVal);

          return (
            <div key={optionVal} className="flex align-items-center gap-2">
              <RadioButton
                inputId={`${name}_${optionVal}`}
                name={name}
                value={optionVal}
                onChange={(e) =>
                  onChange?.({
                    name,
                    value: e.value,
                  })
                }
                checked={_value === optionVal}
                disabled={disabled}
              />

              <label
                htmlFor={`${name}_${optionVal}`}
                className="cursor-pointer"
              >
                {optionText}
              </label>
            </div>
          );
        })}
      </div>
    </InputLayout>
  );
}

export default React.memo(CustomRadioButton);
