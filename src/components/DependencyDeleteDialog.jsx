import React, { useState } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomDropdown from "@inputs/CustomDropdown";

function DependencyDeleteDialog({
  visible,
  onHide,
  data,
  onConfirm,
  loading,
  error,
}) {
  const [replacement, setReplacement] = useState("");

  const dependencies = data?.dependencies || [];
  const replacementOptions = data?.replacementOptions || [];

  const handleHide = () => {
    setReplacement("");
    onHide();
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!replacement) return;
    onConfirm(replacement);
  };

  return (
    <CustomDialog title="Cannot Delete" visible={visible} onHide={handleHide}>
      <CustomForm
        onSubmit={handleConfirm}
        submitLabel="Replace & Delete"
        submitLoading={loading}
        onCancel={handleHide}
      >
        <div className="c-col-12">
          <div className="text-color-primary">
            This item is currently being used in the following modules:
          </div>
          <ul>
            {dependencies.map((dep, index) => (
              <li key={index} className="text-color-primary">
                <strong>{dep.module}</strong> — {dep.count}{" "}
                {dep.count === 1 ? "record" : "records"}
              </li>
            ))}
          </ul>
          <div className="text-color-primary">
            Please select a replacement before deleting:
          </div>
        </div>
        <CustomDropdown
          name="replacement"
          label="Replacement"
          value={replacement}
          onChange={({ value }) => setReplacement(value)}
          options={replacementOptions}
          optionLabel="name"
          optionValue="_id"
          required
          col={12}
          errorMessage={error}
        />
      </CustomForm>
    </CustomDialog>
  );
}

export default React.memo(DependencyDeleteDialog);
