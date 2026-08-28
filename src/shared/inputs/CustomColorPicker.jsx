import React, { useRef } from "react";
import ColorPicker from "react-pick-color";
import { OverlayPanel } from "primereact/overlaypanel";
import InputLayout from "@inputs/InputLayout";

export default function CustomColorPicker({
  label,
  name,
  data,
  value,
  onChange,
  errorMessage,
  extraClassName,
  required,
  col = 3,
  inputClass,
  ...props
}) {
  const op = useRef(null);
  let color = value || data?.[name] || "#ff0000";

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
      >
        <div
          onClick={(e) => op.current.toggle(e)}
          style={{
            background: color,
            width: "40px",
            padding: "24px",
            border: "1px solid #fff",
          }}
          className="cursor-pointer border-round"
        ></div>

        <OverlayPanel className="custom-color-picker" ref={op}>
          <ColorPicker
            color={color}
            onChange={(e) => onChange && onChange({ ...e, name, value: e.hex })}
            inputClassName={`w-full ${inputClass ? inputClass : ""} ${
              errorMessage ? "p-invalid" : ""
            }`}
            {...props}
          />
        </OverlayPanel>
      </InputLayout>
    </>
  );
}
