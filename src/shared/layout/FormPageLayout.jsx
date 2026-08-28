import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../buttons/PrimaryButton";
import { FormPageContext } from "../context/FormPageContext";

function FormPageLayout({
  children,
  backText,
  fullBackText,
  backTo,
  pageLoading = false,

  onSubmit,
  submitLoading,
  submitLabel = "Save",
  submitDisabled = false,
  onSubmitNextTab,

  onCancel,
  cancelLabel = "Cancel",
  buttonsPosition = "end",

  buttons = [],

  hideCancel = false,
  noPadding = false,
}) {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState(null);

  useEffect(() => {
    if (!submitLoading) setActiveAction(null);
  }, [submitLoading]);

  const handleSubmit = (e) => {
    setActiveAction("save");
    if (onSubmit) onSubmit(e);
  };

  const handleSubmitNext = (e) => {
    setActiveAction("next");
    if (onSubmitNextTab) onSubmitNextTab(e, true);
  };

  const onBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };
  const handleCancel = (e) => {
    e.preventDefault();
    if (onCancel) onCancel();
    else onBack();
  };

  const contextValue = useMemo(
    () => ({
      loading: pageLoading,
    }),
    [pageLoading]
  );

  return (
    <div className={`flex flex-column gap-3 ${noPadding ? "" : "p-2"}`}>
      {backText && (
        <div
          className={`flex text-color-primary gap-2 ${
            noPadding ? "px-2 pt-2" : ""
          }`}
        >
          <i
            className="pi pi-angle-left text-2xl cursor-pointer"
            onClick={onBack}
          ></i>
          <div
            className=" my-auto font-semibold text-lg cursor-pointer"
            onClick={onBack}
          >
            {fullBackText ? <>{fullBackText}</> : <>Back to {backText}</>}
          </div>
        </div>
      )}

      <FormPageContext.Provider value={contextValue}>
        {children}
      </FormPageContext.Provider>

      <div className={`c-col-12 flex gap-2 justify-content-${buttonsPosition}`}>
        {buttons.map((btn, index) => (
          <PrimaryButton key={index} label={btn.label} onClick={btn.onClick} />
        ))}
        {onSubmitNextTab && (
          <PrimaryButton
            label={submitLabel + " & Next"}
            loading={submitLoading && activeAction === "next"}
            onClick={handleSubmitNext}
            disabled={submitDisabled || pageLoading}
          />
        )}

        {onSubmit && (
          <PrimaryButton
            label={submitLabel}
            loading={submitLoading && activeAction === "save"}
            onClick={handleSubmit}
            disabled={submitDisabled || pageLoading}
          />
        )}
        {!hideCancel && (
          <PrimaryButton
            label={cancelLabel}
            onClick={handleCancel}
            severity="secondary"
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(FormPageLayout);
