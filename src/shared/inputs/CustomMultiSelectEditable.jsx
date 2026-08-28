import React, { useCallback, useMemo } from "react";
import { MultiSelect } from "primereact/multiselect";
import InputLayout from "./InputLayout";
import { capitalizeCamelCase } from "@utils/common";
import { useSelector } from "react-redux";
import dropdownConstants from "../../utils/dropdownConstants";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function CustomMultiSelectEditable({
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

  optionsType = null,

  editableFields = [],
  showFields = [],
  ...props
}) {
  const _value = value ?? data?.[name] ?? "";

  const dropdowns = useSelector((state) => state.dropdown);
  const allDropdowns = { ...dropdowns, ...dropdownConstants };
  if (optionsType) {
    options = allDropdowns[optionsType] || [];
  }

  let _selectedOptions = useMemo(() => {
    let selected = [];
    if (options.length && _value?.length) {
      _value.forEach((val) => {
        const match = options.find((opt) => opt._id === val);
        if (match) selected.push(match);
      });
    }
    return selected;
  }, [options, _value]);

  console.log(_value);

  return (
    <>
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
          options={options}
          optionLabel={optionLabel}
          optionValue={optionValue}
          disabled={disabled}
          showClear={_value && clearable}
          {...props}
        />
      </InputLayout>
      {_value?.length > 0 && (
        <InputLayout
          col={12}
          label={`Selected ${label || capitalizeCamelCase(name)}`}
          name={name}
          required={required}
          extraClassName={extraClassName}
          data={data}
          errorMessage={errorMessage}
          hideLabel={hideLabel}
        >
          <div className="custom-table">
            <DataTable
              value={_selectedOptions}
              dataKey="_id"
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column field="title" header="Title"></Column>
              {showFields.map((field) => (
                <Column
                  key={field}
                  header={capitalizeCamelCase(field)}
                  field={field}
                ></Column>
              ))}
            </DataTable>
          </div>
        </InputLayout>
      )}
    </>
  );
}

export default React.memo(CustomMultiSelectEditable);
