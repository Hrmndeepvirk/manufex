import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import {
  deleteReasonCode,
  getReasonCodes,
} from "@store/settings/business/reasonCodeActions";

function ReasonCodes() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const data = useSelector((state) => state.settings.business.reasonCodes);

  useEffect(() => {
    dispatch(getReasonCodes());
  }, [dispatch]);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "codeType", optionsKey: "ReasonCodeTypes" },
    { field: "description" },

    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`reason-code/${id}`);
  };

  const onDelete = (id) => {
    dispatch(deleteReasonCode(id));
  };

  return (
    <ListPageLayout
      buttonLabel="Add Reason Code"
      linkTo={"/settings/business-setup/reason-code"}
      searchable={["title"]}
      tableData={data}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

export default React.memo(ReasonCodes);
