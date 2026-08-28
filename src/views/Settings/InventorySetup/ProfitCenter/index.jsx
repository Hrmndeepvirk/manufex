import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProfitCenter,
  getProfitCenters,
} from "../../../../store/settings/inventory/profitCenterActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function ProfitCenter() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.settings.inventory.profitCenters);

  useEffect(() => {
    dispatch(getProfitCenters());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteProfitCenter);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "glCode", header: "GL Code" },
    { field: "description" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`profit-center/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Profit Center"
        linkTo="profit-center"
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
