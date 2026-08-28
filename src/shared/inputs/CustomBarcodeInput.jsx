import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { capitalizeCamelCase } from "@utils/common";
import InputLayout from "./InputLayout";
import BarcodeScanner from "./BarcodeScanner";

function CustomBarcodeInput({
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
  placeholder,
  maxLength,
  hideLabel = false,
  helpText,
  scanLabel = "Scan",
  scanTitle,
  ...props
}) {
  const [scannerVisible, setScannerVisible] = useState(false);

  const handleScan = (scannedValue) => {
    onChange?.({ name, value: scannedValue });
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
      maxLength={maxLength}
      hideLabel={hideLabel}
      helpText={helpText}
    >
      <div className="flex w-full gap-3 align-items-stretch pr-3">
        <InputText
          id={name}
          name={name}
          value={value ?? data?.[name] ?? ""} 
          type={type}
          onChange={(e) =>
            onChange?.({ ...e, name: e.target.name, value: e.target.value })
          }
          className={`w-full ${errorMessage ? "p-invalid" : ""}`}
          placeholder={
            placeholder || `Enter ${label || capitalizeCamelCase(name)}`
          }
          maxLength={maxLength}
          disabled={disabled}
          {...props}
        />

        <Button
          type="button"
          icon="pi pi-camera"
          label={scanLabel}
          className="p-button-outlined whitespace-nowrap flex-shrink-0"
          style={{ marginRight: "0.5rem" }}
          onClick={() => setScannerVisible(true)}
          disabled={disabled}
        />
      </div>

      <BarcodeScanner
        visible={scannerVisible}
        onHide={() => setScannerVisible(false)}
        onScan={handleScan}
        title={scanTitle || `Scan ${label || capitalizeCamelCase(name)}`}
      />
    </InputLayout>
  );
}

export default React.memo(CustomBarcodeInput);
