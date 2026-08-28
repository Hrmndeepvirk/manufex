import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import {
  deleteMemberShipType,
  getMemberShipTypes,
  reorderPriority,
} from "@store/settings/memberSetup/membershipTypeActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function MemberShipType() {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.settings.memberSetup.membershipTypes,
  );

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    dispatch(getMemberShipTypes());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  const { onDelete, DependencyDialog } =
    useDependencyDelete(deleteMemberShipType);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "description" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`manage-membership/${id}`);
  };

  const onRowReorder = (updated) => {
    setTableData(updated.value);
    const ids = updated.value.map((item) => item._id);
    dispatch(reorderPriority({ membershipTypes: ids }));
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Membership Type"
        linkTo="manage-membership"
        searchable={["title"]}
        tableData={tableData}
        columns={columns}
        onEdit={onEdit}
        reorderableRows
        onRowReorder={onRowReorder}
        onDelete={onDelete}
      />
      {DependencyDialog}
    </>
  );
}
