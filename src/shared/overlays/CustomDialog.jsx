import React from "react";
import { Dialog } from "primereact/dialog";

function CustomDialog({ title, visible, onHide, children, size = "default" }) {
  let width = "30vw";
  if (size === "medium") {
    width = "45vw";
  } else if (size === "large") {
    width = "55vw";
  } else if (size === "full") {
    width = "80vw";
  }

  return (
    <Dialog
      className="custom-dialog"
      header={title}
      visible={visible}
      onHide={onHide}
      position={"top"}
      style={{ width }}
      breakpoints={{ "1100px": "50vw", "960px": "95vw" }}
      draggable={false}
      resizable={false}
    >
      {children}
    </Dialog>
  );
}
export default React.memo(CustomDialog);
