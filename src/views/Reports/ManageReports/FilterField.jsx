import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import CustomNumberInput from "@inputs/CustomNumberInput";
import CustomInput from "@inputs/CustomInput";
import CustomOptionSelect from "@inputs/CustomOptionSelect";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import dropdownConstants from "@utils/dropdownConstants";

function FilterField({ def, filters, onChange }) {
  const { name, label, optionsType, options, type, booleanOptions, filterField, filterValue, filterByFilterKey } = def;
  const col = 6;

  const dropdowns = useSelector((state) => state.dropdown);
  const filteredOptions = useMemo(() => {
    if (!filterField || !optionsType) return null;
    const allDropdowns = { ...dropdowns, ...dropdownConstants };
    const source = allDropdowns[optionsType] || [];
    // Dynamic filter: value comes from another filter's current selection
    if (filterByFilterKey) {
      const selectedValues = filters[filterByFilterKey];
      if (!selectedValues || (Array.isArray(selectedValues) && selectedValues.length === 0)) return source;
      const valuesArray = Array.isArray(selectedValues) ? selectedValues : [selectedValues];
      return source.filter((item) => valuesArray.includes(item[filterField]));
    }
    // Static filter: value is defined in the config
    return source.filter((item) => item[filterField] === filterValue);
  }, [filterField, filterValue, filterByFilterKey, optionsType, dropdowns, filters]);

  if (type === "number") {
    return (
      <CustomNumberInput
        name={name}
        label={label}
        data={filters}
        onChange={onChange}
        col={col}
      />
    );
  }

  if (type === "text") {
    return (
      <CustomInput
        name={name}
        label={label}
        data={filters}
        onChange={onChange}
        col={col}
      />
    );
  }

  if (type === "calendar") {
    return (
      <CustomCalendarInput
        name={name}
        label={label}
        data={filters}
        onChange={onChange}
        dateString
        col={col}
      />
    );
  }

  if (type === "dropdown") {
    return (
      <CustomDropdown
        name={name}
        label={label}
        data={filters}
        onChange={onChange}
        options={options || []}
        optionsType={optionsType || null}
        booleanOptions={booleanOptions || false}
        clearable
        col={col}
      />
    );
  }

  if (type === "optionSelect") {
    return (
      <CustomOptionSelect
        name={name}
        label={label}
        data={filters}
        onChange={onChange}
        options={options || []}
        optionsType={optionsType || null}
      />
    );
  }

  if (type === "optionSelectMulti") {
    return (
      <CustomOptionSelect
        name={name}
        label={label}
        data={filters}
        onChange={onChange}
        options={options || []}
        optionsType={optionsType || null}
        multiple
      />
    );
  }

  // Default: multi-select
  return (
    <CustomMultiSelect
      name={name}
      label={label}
      data={filters}
      onChange={onChange}
      options={filteredOptions || options || []}
      optionsType={filteredOptions ? null : optionsType || null}
      col={col}
    />
  );
}

export default React.memo(FilterField);
