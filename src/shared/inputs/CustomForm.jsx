import React from "react";
import PrimaryButton from "../buttons/PrimaryButton";

function CustomForm({
  children,
  className = "",
  onSubmit,
  submitLoading,
  submitLabel = "Save",
  submitDisabled = false,

  onCancel,
  cancelLabel = "Cancel",
  buttonsPosition = "end",

  buttons = [],

  onDelete,
  deleteLabel = "Delete",
  deleteLoading,

  fullWidthButtons = false,

  ...props
}) {
  const handleCancel = (e) => {
    e.preventDefault();
    if (onCancel) onCancel();
  };

  return (
    <form className={`c-grid ${className}`} {...props}>
      {children}

      {fullWidthButtons ? (
        <>
          {onSubmit && (
            <div className="c-col-12">
              <PrimaryButton
                className="w-full"
                label={submitLabel}
                loading={submitLoading}
                onClick={onSubmit}
                disabled={submitDisabled}
              />
            </div>
          )}

          {onCancel && (
            <div className="c-col-12">
              <PrimaryButton
                className="w-full"
                label={cancelLabel}
                onClick={handleCancel}
                severity="secondary"
              />
            </div>
          )}
        </>
      ) : (
        <>
          {(onSubmit || onCancel) && (
            <div className={`c-col-12 flex gap-2 justify-content-between`}>
              <div>
                {onDelete && (
                  <PrimaryButton
                    label={deleteLabel}
                    loading={deleteLoading}
                    onClick={onDelete}
                    severity="danger"
                  />
                )}
              </div>
              <div className={` flex gap-2 justify-content-${buttonsPosition}`}>
                {onSubmit && (
                  <PrimaryButton
                    label={submitLabel}
                    loading={submitLoading}
                    onClick={onSubmit}
                    disabled={submitDisabled}
                  />
                )}
                {buttons.map((btn, index) => (
                  <PrimaryButton
                    severity="secondary"
                    key={index}
                    label={btn.label}
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                  />
                ))}
                {onCancel && (
                  <PrimaryButton
                    label={cancelLabel}
                    onClick={handleCancel}
                    severity="secondary"
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </form>
  );
}
export default React.memo(CustomForm);
