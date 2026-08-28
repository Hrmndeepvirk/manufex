import React from "react";
import { InputOtp } from "primereact/inputotp";
import InputLayout from "./InputLayout";

function CustomOTP({
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
  type = "text",
  hideLabel = false,
  ...props
}) {
  const customInput = ({ events, props }) => {
    return (
      <>
        <input
          {...events}
          {...props}
          type="text"
          className="custom-otp-input-sample"
        />
        {props["data-index"] === 2 && (
          <div className="px-3">
            <i className="pi pi-minus" />
          </div>
        )}
      </>
    );
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
      <div className="flex justify-content-center">
        <InputOtp
          id={name}
          name={name}
          value={value ?? data?.[name] ?? ""}
          type={type}
          onChange={(e) => onChange?.({ ...e, name, value: e.value })}
          className={`${errorMessage ? "p-invalid" : ""}`}
          length={6}
          inputTemplate={customInput}
          style={{ gap: 0 }}
          integerOnly
          {...props}
        />
      </div>
    </InputLayout>
  );
}
export default React.memo(CustomOTP);
