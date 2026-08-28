import React, { useEffect, useMemo, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import CustomDialog from "@shared/overlays/CustomDialog";
import { PrivateRoutes } from "../routes/PrivateRoutes";
import { useNavigate } from "react-router-dom";

function GlobalSearch({ visible, onHide }) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);

  let searchItems = useMemo(
    () => flattenRoutes(PrivateRoutes),
    [PrivateRoutes],
  );
  const search = (event) => {
    let query = event.query;
    const filteredRoutes = searchItems.filter((r) =>
      r.name.toLowerCase().includes(query.toLowerCase()),
    );
    setItems(filteredRoutes);
  };

  useEffect(() => {
    if (value?.path) {
      onSelect(value?.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function onSelect(path, e, blank) {
    if (blank) {
      e.stopPropagation();
      window.open(path, "_blank");
    } else {
      navigate(path);
    }
    setTimeout(() => {
      onHide();
    }, 400);
    setTimeout(() => {
      setValue("");
    }, 500);
  }

  const itemTemplate = (item) => {
    return (
      <div className="flex justify-content-between">
        <div>
          <span className="text-lg text-primary">{item.name}</span>
          <br />
          {item.breadcrumb.includes(">") && (
            <span className="text-sm text-color-primary">
              {item.breadcrumb}
            </span>
          )}
        </div>
        <i
          style={{ zIndex: "999" }}
          onClick={(e) => onSelect(item.path, e, true)}
          className="my-auto pi pi-external-link px-3 py-2 hover:text-blue-600 hidden md:block cursor-pointer"
        ></i>
      </div>
    );
  };

  return (
    <>
      <CustomDialog
        title="Where do you want to go?"
        visible={visible}
        onHide={onHide}
        size="medium"
      >
        <span className="w-full">
          <AutoComplete
            className="w-full"
            inputClassName="w-full"
            field="name"
            value={value}
            suggestions={items}
            completeMethod={search}
            onChange={(e) => setValue(e.value)}
            showEmptyMessage={true}
            itemTemplate={itemTemplate}
            autoFocus
            placeholder="Search..."
          />
        </span>
      </CustomDialog>
    </>
  );
}
export default React.memo(GlobalSearch);
function flattenRoutes(routes, parentPath = "", parentNames = []) {
  let flatRoutes = [];

  routes.forEach((route) => {
    const fullPath = `${parentPath}${route.path}`;
    const namePath = [...parentNames, route.name];

    if (!fullPath.includes("?/")) {
      flatRoutes.push({
        name: route.name,
        path: fullPath,
        breadcrumb: namePath.join(" > "),
      });
    }
    if (route.items) {
      flatRoutes = flatRoutes.concat(
        flattenRoutes(route.items, fullPath, namePath),
      );
    }
  });

  flatRoutes = flatRoutes.map((item) => {
    let parts = item.path.split(":");
    item.path = parts[0];
    return {
      ...item,
    };
  });

  return flatRoutes;
}
