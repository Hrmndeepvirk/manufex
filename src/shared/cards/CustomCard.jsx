import React from "react";

import Lottie from "lottie-react";
import NoTableData from "@assets/lotties/NoTableData.json";
import PrimaryButton, { PrimaryButtonSmall } from "../buttons/PrimaryButton";

export default function CustomCard({
  title,
  actions,
  onEdit,
  onDelete,
  children,
  height,
  onAdd,
  addTitle,
  buttons = [],
  onFilter,
  size = 12,
  contentClassName,
  headers,
  hideHeader,
  addPadding,
  empty = false,
}) {
  return (
    <div
      className={`c-col-12 md:c-col-${size} flex flex-column gap-1 h-full`}
      style={{ padding: addPadding ? "10px 10px" : "0" }}
    >
      {!hideHeader && (
        <div className="bg-primary border-round p-3 flex justify-content-between">
          <span className="font-medium text-lg my-auto">{title}</span>
          {headers && headers}
          {actions && (
            <div className="flex gap-3 my-auto">
              {onEdit && (
                <i
                  title="Edit"
                  className="pi pi-pencil cursor-pointer"
                  onClick={onEdit}
                ></i>
              )}
              {onAdd && (
                <i
                  title={addTitle || "Add"}
                  className="pi pi-plus cursor-pointer"
                  onClick={onAdd}
                ></i>
              )}

              {onDelete && (
                <i
                  title="Delete"
                  className="pi pi-trash cursor-pointer"
                  onClick={onDelete}
                ></i>
              )}
              {onFilter && (
                <i
                  title="Filter"
                  className="pi pi-filter cursor-pointer"
                  onClick={onFilter}
                ></i>
              )}

              <div className="flex gap-2">
                {buttons.map((btn, index) => (
                  <PrimaryButtonSmall
                    secondary
                    key={index}
                    className={btn.className}
                    label={btn.label}
                    onClick={btn.onClick}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <div
        className={`bg-card border-round p-3`}
        style={{ height: height, overflowY: "auto" }}
      >
        {empty && <EmptyTemplate />}
        <div className={`c-grid ${contentClassName}`}>{children}</div>
      </div>
    </div>
  );
}
export function CustomGridLayout({ children, extraClass }) {
  return <div className={`grid ${extraClass}`}>{children}</div>;
}
function EmptyTemplate() {
  return (
    <div className="c-col-12 h-full flex align-items-center justify-content-center">
      <div className="text-center ">
        <div className="mx-auto" style={{ width: "180px" }}>
          <Lottie animationData={NoTableData} />
        </div>
        <div className="text-sm text-secondary -mt-5">
          <>
            No data available right now. <br /> Maybe select a different record
            or add a new entry!
          </>
        </div>
      </div>
    </div>
  );
}
