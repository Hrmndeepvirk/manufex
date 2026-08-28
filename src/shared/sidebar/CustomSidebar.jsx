import React from "react";
import { Skeleton } from "primereact/skeleton";
import { useNavigate } from "react-router-dom";

function CustomSidebar({
  title,
  loading = false,
  selected = null,
  options = [],
  onSelect = () => {},
  backText,
  backTo,
  valueField = "title",
}) {
  const navigate = useNavigate();
  const onBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };
  return (
    <div className="custom-sidebar border-round h-full">
      <div className="sidebar-header">
        {title}
        {backText && (
          <div className={`flex gap-1 cursor-pointer`} onClick={onBack}>
            <i className="pi pi-angle-left my-auto text-xl"></i>
            <div>Back to {backText}</div>
          </div>
        )}
      </div>
      {loading ? (
        <>
          <div className="sidebar-item">
            <Skeleton className="mb-1" width="12rem" height="1.4rem" />
          </div>
          <div className="sidebar-item">
            <Skeleton className="mb-1" width="16rem" height="1.4rem" />
          </div>
          <div className="sidebar-item">
            <Skeleton className="mb-1" width="13rem" height="1.4rem" />
          </div>
          <div className="sidebar-item">
            <Skeleton className="mb-1" width="10rem" height="1.4rem" />
          </div>
        </>
      ) : (
        <>
          {options.map((item) => (
            <div
              key={item._id}
              className={`sidebar-item ${selected === item._id && "active"}`}
              onClick={() => onSelect(item._id)}
            >
              <i className={`mr-2 ${item.icon}`}></i>
              <span title={item.title}>{item[valueField]}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
export default React.memo(CustomSidebar);
