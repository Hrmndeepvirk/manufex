import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTax,
  getTaxes,
} from "../../../../store/settings/pointOfSale/taxActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function Tax() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.settings.pointOfSale.tax);

  useEffect(() => {
    dispatch(getTaxes());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteTax);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "description" },
    { field: "taxRatePercentage", header: "Tax Rate (%)" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`tax/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Tax"
        linkTo="tax"
        searchable={["title"]}
        tableData={data}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      {DependencyDialog}
    </>
  );
}
