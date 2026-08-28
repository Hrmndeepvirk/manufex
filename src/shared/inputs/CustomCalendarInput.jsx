import React from "react";
import { Calendar } from "primereact/calendar";
import InputLayout from "./InputLayout";
import { capitalizeCamelCase } from "@utils/common";

function CustomCalendarInput({
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
  placeholder,
  hideLabel = false,

  timeOnly = false,
  showTime = false,
  dateString = false,
  hideIcon = false,

  hourFormat = "12",
  ...props
}) {
  // TODO: Will get date format from Company Settings in future will depends upon locale
  const dateFormat = "mm/dd/yy";

  let _value = value ?? data?.[name] ?? null;

  if (dateString && _value && !timeOnly && !showTime) {
    const parts = _value.split("-");
    const year = parts[0];
    const month = parts[1];
    const day = parts[2].substring(0, 2);
    _value = new Date(year, month - 1, day);
  } else if (timeOnly && _value) {
    const parts = _value.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    _value = new Date();
    _value.setHours(hours);
    _value.setMinutes(minutes);
  } else {
    _value = _value ? new Date(_value) : null;
  }

  const handleChange = (e) => {
    let _value = e.value;

    if (dateString && _value && !timeOnly && !showTime) {
      const day = String(_value.getDate()).padStart(2, "0");
      const month = String(_value.getMonth() + 1).padStart(2, "0");
      const year = _value.getFullYear();
      _value = `${year}-${month}-${day}`;
    }

    if (timeOnly && _value) {
      // For time only, we store time in HH:MM format
      const hours = String(_value.getHours()).padStart(2, "0");
      const minutes = String(_value.getMinutes()).padStart(2, "0");
      _value = `${hours}:${minutes}`;
    }

    onChange({ ...e, name, value: _value });
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
      <Calendar
        id={name}
        name={name}
        value={_value}
        onChange={handleChange}
        className={`w-full ${errorMessage ? "p-invalid" : ""}`}
        placeholder={
          placeholder || `Select ${label || capitalizeCamelCase(name)}`
        }
        dateFormat={dateFormat}
        disabled={disabled}
        timeOnly={timeOnly}
        showTime={showTime}
        hourFormat={hourFormat}
        showIcon={!hideIcon}
        icon={() => (
          <i className={timeOnly ? "pi pi-clock" : "pi pi-calendar"} />
        )}
        
        {...props}
      />
    </InputLayout>
  );
}

export default React.memo(CustomCalendarInput);
