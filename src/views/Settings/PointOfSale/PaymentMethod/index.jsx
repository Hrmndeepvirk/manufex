import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import {
  deletePaymentMethod,
  getPaymentMethods,
} from "../../../../store/settings/pointOfSale/paymentMethodActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function PaymentMethod() {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.settings.pointOfSale.paymentMethods
  );

  useEffect(() => {
    dispatch(getPaymentMethods());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deletePaymentMethod);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "description" },
    { field: "code" },
    { field: "requireMember", isBoolean: true },
    { field: "isActive", header: "Active" },
    { field: "createdAt", header: "Created At" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`payment-method/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Payment Method"
        linkTo="payment-method"
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
