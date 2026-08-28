import React from "react";
import { Tree } from "primereact/tree";

const CustomTree = ({
  values,
  expandedKeys,
  selectionKeys,
  onSelectionChange,
}) => {
  return (
    <Tree
      selectionMode="checkbox"
      value={values}
      expandedKeys={expandedKeys}
      selectionKeys={selectionKeys}
      onSelectionChange={(e) => onSelectionChange(e.value)}
    />
  );
};
export default React.memo(CustomTree);
