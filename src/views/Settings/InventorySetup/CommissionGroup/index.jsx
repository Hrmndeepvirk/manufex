import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCommissionGroup,
  getCommissionGroups,
} from "../../../../store/settings/inventory/commissionGroupActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function CommissionGroup() {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.settings.inventory.commissionGroups
  );

  useEffect(() => {
    dispatch(getCommissionGroups());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteCommissionGroup);

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
    navigate(`commission-group/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Commission Group"
        linkTo="commission-group"
        searchable={["title"]}
        tableData={data}
        columns={columns}
        onDelete={onDelete}
        onEdit={onEdit}
      />
      {DependencyDialog}
    </>
  );
}
