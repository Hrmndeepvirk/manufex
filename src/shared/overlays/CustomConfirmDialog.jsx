import React from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import PrimaryButton from "../buttons/PrimaryButton";
let acceptCallback = null;
let rejectCallback = null;
export function customConfirmDialog({
  message = "Are you sure you want to proceed?",
  accept = () => {},
  reject = () => {},
}) {
  acceptCallback = accept;
  rejectCallback = reject;
  confirmDialog({
    group: "headless",
    message,
    position: "top",
  });
}

export default function CustomConfirmDialog() {
  return (
    <ConfirmDialog
      style={{ width: "30vw" }}
      breakpoints={{ "1100px": "50vw", "960px": "95vw" }}
      group="headless"
      content={({ contentRef, footerRef, hide, message }, i) => (
        <div className="custom-confirm-dialog surface-overlay">
          <div ref={contentRef} className="text-color-primary">
            {message.message}
          </div>
          <div
            className="flex justify-content-end align-items-center gap-2 mt-2"
            ref={footerRef}
          >
            <PrimaryButton
              label="Yes"
              name="accept"
              onClick={(event) => {
                hide(event);
                if (acceptCallback) acceptCallback();
              }}
            />
            <PrimaryButton
              label="No"
              name="reject"
              severity="secondary"
              onClick={(event) => {
                hide(event);
                if (rejectCallback) rejectCallback();
              }}
            />
          </div>
        </div>
      )}
    />
  );
}
