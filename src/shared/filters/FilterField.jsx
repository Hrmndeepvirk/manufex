import React from "react";
import CustomInput from "@inputs/CustomInput";
import CustomNumberInput from "@inputs/CustomNumberInput";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomCheckbox from "@inputs/CustomCheckbox";

const FIELD_MAP = {
  text: CustomInput,
  number: CustomNumberInput,
  dropdown: CustomDropdown,
  multiselect: CustomMultiSelect,
  date: CustomCalendarInput,
  dateFrom: CustomCalendarInput,
  dateTo: CustomCalendarInput,
  timeFrom: CustomCalendarInput,
  timeTo: CustomCalendarInput,
  checkbox: CustomCheckbox,
};

const EXTRA_PROPS = {
  timeFrom: { timeOnly: true },
  timeTo: { timeOnly: true },
};

function FilterField({ config, data, onChange }) {
  const { column, header, type, col = 3, targetColumn, matchField, ...rest } =
    config;
  const Component = FIELD_MAP[type];
  if (!Component) return null;

  const extraProps = EXTRA_PROPS[type] || {};

  return (
    <Component
      name={column}
      label={header}
      data={data}
      onChange={onChange}
      col={col}
      hideLabel
      clearable={type === "multiselect" || type === "dropdown"}
      {...extraProps}
      {...rest}
    />
  );
}

export default React.memo(FilterField);
