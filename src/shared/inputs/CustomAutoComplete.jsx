import React, { useState } from "react";
import InputLayout from "./InputLayout";
import { capitalizeCamelCase } from "@utils/common";
import { AutoComplete } from "primereact/autocomplete";

function CustomAutoComplete({
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
  autoClear = false,
  helpText,
  extraHeaders,
  searchFields,
  ...props
}) {
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState([]);

  const search = (event) => {
    const query = event.query.toLowerCase();
    const fields =
      Array.isArray(searchFields) && searchFields.length
        ? searchFields
        : [optionLabel];
    let _items = [...options];
    _items = _items.filter((item) =>
      fields.some((field) => {
        const val = item?.[field];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      }),
    );
    setItems(_items);
  };

  const handleChange = ({ value }) => {
    setKeyword(value);
    if (onChange) {
      if (value?.[optionValue]) {
        onChange({ name: name, value: value[optionValue] });

        if (autoClear) {
          setTimeout(() => {
            setKeyword("");
          }, 1000);
        }
      }
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
      helpText={helpText}
      extraHeaders={extraHeaders}
    >
      <AutoComplete
        id={name}
        name={name}
        value={keyword}
        suggestions={items}
        completeMethod={search}
        onChange={handleChange}
        className={`w-full ${errorMessage ? "p-invalid" : ""}`}
        placeholder={
          placeholder || `Select ${label || capitalizeCamelCase(name)}`
        }
        field={optionLabel}
        disabled={disabled}
        forceSelection
        {...props}
      />
    </InputLayout>
  );
}

export default React.memo(CustomAutoComplete);
