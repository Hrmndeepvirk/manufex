import React from "react";
import { Skeleton } from "primereact/skeleton";

export function SidebarQuickViewItem({ icon, label, active, onClick, onEdit, isDefault, onSetDefault }) {
  return (
    <div className={`sidebar-quick-view-item ${active ? "active" : ""}`}>
      <div className="w-full" onClick={onClick}>
        <i className={`mr-2 pi ${icon}`}></i>
        <span>{label}</span>
      </div>
      <i
        className={`pi ${isDefault ? "pi-star-fill" : "pi-star"} text-sm mr-2 cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation();
          onSetDefault();
        }}
        title={isDefault ? "Default view" : "Set as default"}
      ></i>
      <i className="save pi pi-pencil text-sm" onClick={onEdit}></i>
    </div>
  );
}

export function SidebarHeaderItem({
  icon,
  label,
  onClick,
  buttonIcon = "pi pi-plus-circle",
  className,
}) {
  return (
    <div className={`sidebar-section-header ${className}`}>
      <div>
        <i className={`mr-2 pi ${icon}`}></i>
        <span>{label}</span>
      </div>
      {onClick && (
        <i className={`pi ${buttonIcon} cursor-pointer`} onClick={onClick}></i>
      )}
    </div>
  );
}

export function FilterHeaderItem({ icon, label, onClick }) {
  return (
    <div className="filter-section-header">
      <div>
        <i className={`mr-2 pi ${icon}`}></i>
        <span>{label}</span>
      </div>
      {onClick && (
        <i className="pi pi-plus-circle cursor-pointer" onClick={onClick}></i>
      )}
    </div>
  );
}

export function ItemAccordion({ label, children }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  return (
    <div className="item-accordion">
      <div className="item-accordion-header">
        <i
          className={`pi ${isOpen ? "pi-angle-down" : "pi-angle-right"}`}
          onClick={toggleOpen}
        ></i>
        <div className="item">{label}</div>
      </div>

      {isOpen && <div className="item-accordion-content">{children}</div>}
    </div>
  );
}

export function ItemsLoading({ padding }) {
  return (
    <div className={`${padding && "px-2"}`}>
      <Skeleton height="1.6rem" className="mb-2"></Skeleton>
      <Skeleton height="1.6rem" className="mb-2"></Skeleton>
      <Skeleton height="1.6rem" className="mb-2"></Skeleton>
    </div>
  );
}
