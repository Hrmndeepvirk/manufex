import React from "react";
import InputLayout from "./InputLayout";

function CustomField({
  label,
  name,
  data = {},
  value,
  errorMessage,
  extraClassName = "",
  required = false,
  col = 1,
  maxLength,
  hideLabel = false,
  helpText,
  children,
}) {
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
      maxLength={maxLength}
      hideLabel={hideLabel}
      helpText={helpText}
    >
      {value}
      {children}
    </InputLayout>
  );
}

export default React.memo(CustomField);
