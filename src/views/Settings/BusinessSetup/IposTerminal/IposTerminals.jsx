import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import {
  deleteIposTerminal,
  getIposTerminals,
} from "@store/settings/business/iposTerminalActions";

function IposTerminals() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const data = useSelector((state) => state.settings.business.iposTerminals);

  useEffect(() => {
    dispatch(getIposTerminals());
  }, [dispatch]);

  const columns = [
    { field: "title", sortable: true },
    { field: "tpn", label: "TPN" },
    { field: "isDefault", isBoolean: true },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`ipos-terminal/${id}`);
  };

  const onDelete = (id) => {
    dispatch(deleteIposTerminal(id));
  };

  return (
    <ListPageLayout
      searchable={["title", "tpn"]}
      tableData={data}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

export default React.memo(IposTerminals);
