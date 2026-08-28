import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDiscounts,
  deleteDiscount,
} from "../../../../store/settings/pointOfSale/discountActions";
import ListPageLayout from "../../../../shared/layout/ListPageLayout";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function Discount() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.settings.pointOfSale.discounts);

  useEffect(() => {
    dispatch(getDiscounts());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteDiscount);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "discountCode" },
    { field: "description" },
    { field: "startDate", isDate: true },
    { field: "endDate", isDate: true },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`discount/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Discount"
        linkTo="discount"
        searchable={["title", "discountCode", "description"]}
        tableData={data}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      {DependencyDialog}
    </>
  );
}
