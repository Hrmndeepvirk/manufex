import React, { useEffect, useState } from "react";
import { Image } from "primereact/image";
import InputLayout from "./InputLayout";
import { getFileURL } from "../../utils/fileHelper";

function CustomImageInput({
  label,
  name,
  value,
  data = {},
  onChange,
  errorMessage,
  extraClassName = "",
  required = false,
  col = 12,
  disabled = false,
  multiple = false,
  limit,
  removeable = true,
  editable = true,
  hideLabel = false,
  helpText,
  ...props
}) {
  let _value = data?.[name] || value || null;

  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!_value) {
      setFiles([]);
      return;
    }
    if (multiple) {
      setFiles(_value);
    } else {
      setFiles([_value]);
    }
  }, [_value]);

  const handleDelete = (index) => {
    if (!editable) return;
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange({
      name,
      value: multiple ? updated : null,
    });
  };

  const handleFileChange = (e) => {
    if (!editable) return;
    const chosenFiles = Array.from(e.target.files);
    updateFileList(chosenFiles);
  };
  const updateFileList = (newFiles) => {
    let uploadedFiles = [];

    newFiles.forEach((file) => {
      if (files.findIndex((f) => f.name === file.name) === -1) {
        uploadedFiles.push(file);
      }
    });

    if (multiple) {
      let updated = [...files, ...uploadedFiles];
      if (limit && updated.length > limit) {
        updated = updated.slice(0, limit);
        setError(`Max. file limit is ${limit}.`);
      }
      setFiles(updated);
      onChange({ name, value: updated });
    } else {
      setFiles([...uploadedFiles]);
      onChange({ name, value: uploadedFiles[0] });
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  function getImage(image) {
    if (!image) {
      return null;
    }

    if (typeof image === "string") {
      return getFileURL(image);
    }
    return URL.createObjectURL(image);
  }

  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage || error}
      hideLabel={hideLabel}
      helpText={helpText}
    >
      <input
        id={`${name}-image-input`}
        name={name}
        type="file"
        accept="image/*"
        multiple={multiple}
        hidden
        disabled={disabled}
        onChange={handleFileChange}
        {...props}
      />

      <div className={`custom-image-input ${disabled && "disabled"}`}>
        {files?.length > 0 &&
          files.map((image, index) => (
            <div className="image-container">
              <Image
                src={getImage(image)}
                alt="Image"
                width="80"
                height="80"
                preview
              />
              {removeable && editable && (
                <i
                  className="pi pi-times-circle delete-icon"
                  onClick={() => handleDelete(index)}
                />
              )}
            </div>
          ))}
        {(!limit || files.length < limit) && (
          <label htmlFor={`${name}-image-input`} className="upload-button">
            <i className="pi pi-image" />
          </label>
        )}
      </div>
    </InputLayout>
  );
}

export default React.memo(CustomImageInput);
