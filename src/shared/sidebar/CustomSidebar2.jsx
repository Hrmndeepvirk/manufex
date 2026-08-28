import React, { useState } from "react";
import { Skeleton } from "primereact/skeleton";
import { useNavigate } from "react-router-dom";

function CustomSidebar2({
  title,
  loading = false,
  selected = [],
  options = [],
  onSelect = () => {},
  backText,
  backTo,
  valueField = "title",
}) {
  const [openItems, setOpenItems] = useState({});

  const navigate = useNavigate();
  const onBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  function renderList(arr, level = 1) {
    return arr.map((item) => {
      const hasChildren = item?.items?.length > 0;
      const isOpen = openItems[item._id];

      return (
        <div key={item._id}>
          <div
            className={`sidebar-item ${
              selected?.includes(item._id) ? "active" : ""
            }`}
            style={{ paddingLeft: `${level * 20}px` }}
            onClick={() =>
              onSelect({
                [level]: item._id,
                categoryId: item.categoryId || null,
                subCategoryId: item.subCategoryId || null,
              })
            }
          >
            <div
              className="flex justify-content-between"
              onClick={() => {
                // e.stopPropagation();
                toggleItem(item._id);
              }}
            >
              <span title={item.title}>
                {item.icon && <i className={`mr-2 ${item.icon}`} />}
                {item[valueField]}
              </span>

              {hasChildren && (
                <i
                  className={`pi ${
                    isOpen ? "pi-chevron-down mr-2" : "pi-chevron-right mr-2"
                  } `}
                />
              )}
            </div>
          </div>

          {/* Children */}
          {hasChildren && isOpen && (
            <div>{renderList(item.items, level + 1)}</div>
          )}
        </div>
      );
    });
  }

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
        <>{renderList(options)}</>
      )}
    </div>
  );
}
export default React.memo(CustomSidebar2);
