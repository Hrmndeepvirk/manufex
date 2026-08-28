import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import InputLayout from "./InputLayout";
import { getFileURL } from "../../utils/fileHelper";
import PrimaryButton from "../buttons/PrimaryButton";
import CustomDialog from "../overlays/CustomDialog";

const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "application/pdf",
];

function formatSize(bytes = 0) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CustomFileInput({
  label,
  name,
  value,
  data = {},
  onChange,
  errorMessage,
  col = 12,
  multiple = false,
  limit,
  editable = true,
  disabled = false,
  hideLabel = false,
  helpText,
}) {
  /* ---------------- Always normalize to array ---------------- */
  const _value = data?.[name] ?? value ?? [];

  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const objectUrlsRef = useRef([]);

  /* ---------------- Sync external value ---------------- */
  useEffect(() => {
    if (Array.isArray(_value)) {
      setFiles(_value);
    } else if (_value) {
      setFiles([_value]);
    } else {
      setFiles([]);
    }
  }, [_value]);

  /* ---------------- Cleanup object URLs ---------------- */
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(URL.revokeObjectURL);
      objectUrlsRef.current = [];
    };
  }, []);

  /* ---------------- Helpers ---------------- */

  const isLocalFile = (file) => file instanceof File;

  const isUploadedObject = (file) =>
    file && typeof file === "object" && file.url && file.original_name;

  const getFileSrc = (file) => {
    if (!file) return null;

    // Uploaded object (Cloudinary)
    if (isUploadedObject(file)) {
      return file.url;
    }

    // Existing string
    if (typeof file === "string") {
      return getFileURL(file);
    }

    // Local File
    if (isLocalFile(file)) {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);
      return url;
    }

    return null;
  };

  const getFileName = (file) => {
    if (!file) return "—";
    if (isUploadedObject(file)) return file.original_name;
    if (isLocalFile(file)) return file.name;
    if (typeof file === "string") return file.split("/").pop();
    return "—";
  };

  const getFileSize = (file) => {
    if (!file) return null;
    if (isUploadedObject(file)) return file.size;
    if (isLocalFile(file)) return file.size;
    return null;
  };

  const isPreviewableImage = (file) => {
    if (isLocalFile(file)) return file.type.startsWith("image/");
    if (isUploadedObject(file)) return /\.(jpg|jpeg|png|webp)$/i.test(file.url);
    return false;
  };

  const isPreviewablePdf = (file) => {
    if (isLocalFile(file)) return file.type === "application/pdf";
    if (isUploadedObject(file)) return /\.pdf$/i.test(file.url);
    return false;
  };

  const isDuplicate = (file) =>
    files.some((f) => {
      if (isUploadedObject(f)) return false;
      if (!isLocalFile(f)) return false;

      return (
        f.name === file.name &&
        f.size === file.size &&
        f.lastModified === file.lastModified
      );
    });

  /* ---------------- Handlers ---------------- */

  const handleFileChange = (e) => {
    if (!editable) return;

    let selected = Array.from(e.target.files).filter((file) =>
      ACCEPTED_TYPES.includes(file.type),
    );

    selected = selected.filter((file) => !isDuplicate(file));

    let updated = multiple ? [...files, ...selected] : selected.slice(0, 1);

    if (limit && updated.length > limit) {
      updated = updated.slice(0, limit);
    }

    setFiles(updated);
    onChange({
      name,
      value: updated, // ✅ ALWAYS ARRAY
    });

    e.target.value = "";
  };

  const handleDelete = (rowIndex) => {
    if (!editable) return;

    const updated = files.filter((_, i) => i !== rowIndex);
    setFiles(updated);

    onChange({
      name,
      value: updated, // ✅ ALWAYS ARRAY
    });
  };

  /* ---------------- Table Templates ---------------- */

  const nameTemplate = (row) => getFileName(row);

  const sizeTemplate = (row) => formatSize(getFileSize(row));

  const actionTemplate = (_, { rowIndex }) => (
    <div className="flex gap-3 align-items-center">
      {(isPreviewableImage(files[rowIndex]) ||
        isPreviewablePdf(files[rowIndex])) && (
        <i
          className="pi pi-eye cursor-pointer text-primary"
          onClick={() => setPreviewFile(files[rowIndex])}
        />
      )}

      {editable && (
        <i
          className="pi pi-trash cursor-pointer text-red-500"
          onClick={() => handleDelete(rowIndex)}
        />
      )}
    </div>
  );

  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      hideLabel={hideLabel}
      helpText={helpText}
      errorMessage={errorMessage}
    >
      <input
        type="file"
        hidden
        id={`${name}-file-input`}
        multiple={multiple}
        accept={ACCEPTED_TYPES.join(",")}
        disabled={disabled}
        onChange={handleFileChange}
      />
      <PrimaryButton
        type="button"
        label="Upload File"
        icon="pi pi-upload"
        onClick={() => document.getElementById(`${name}-file-input`).click()}
        disabled={disabled || (limit && files.length >= limit)}
      />
      <div className="flex flex-column gap-2">
        <DataTable
          value={files}
          size="small"
          emptyMessage="No files uploaded"
          className="p-datatable-sm"
        >
          <Column header="File Name" body={nameTemplate} />
          <Column
            header="Size"
            body={sizeTemplate}
            style={{ width: "120px" }}
          />
          <Column
            header="Actions"
            body={actionTemplate}
            style={{ width: "120px" }}
          />
        </DataTable>
      </div>

      {/* ---------------- Preview Dialog ---------------- */}
      <CustomDialog
        title="Preview"
        visible={!!previewFile}
        onHide={() => setPreviewFile(null)}
      >
        {isPreviewableImage(previewFile) && (
          <img src={getFileSrc(previewFile)} alt="preview" className="w-full" />
        )}

        {isPreviewablePdf(previewFile) && (
          <iframe
            src={getFileSrc(previewFile)}
            title="pdf-preview"
            width="100%"
            height="500px"
          />
        )}
      </CustomDialog>
    </InputLayout>
  );
}

export default React.memo(CustomFileInput);
