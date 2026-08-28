import { useEffect, useState } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteVendor,
  getVendors,
} from "../../../../store/settings/inventory/vendorsActions";

export default function Vendor() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const data = useSelector((state) => state.settings.inventory.vendors);

  useEffect(() => {
    dispatch(getVendors(setLoading));
  }, [dispatch]);

  let columns = [
    {
      field: "name",
    },
    { field: "phone" },
    { field: "email" },
    { field: "addressLine1", header: "Address" },
    { field: "isActive" },
    { field: "createdAt" },
  ];
  const onEdit = (id, navigate) => {
    navigate(`vendor/${id}`);
  };

  const onDelete = (id) => {
    dispatch(deleteVendor(id));
  };

  return (
    <ListPageLayout
      buttonLabel="Add Vendor"
      linkTo="vendor"
      searchable={["name"]}
      tableData={data}
      columns={columns}
      loading={loading}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  );
}
// Note: onClick function for "Add Reason Code" button is currently empty and should be implemented as needed.
