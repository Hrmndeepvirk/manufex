import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReferralGroup,
  getReferralGroups,
} from "../../../../store/settings/inventory/referralGroupActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function ReferralGroup() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.settings.inventory.referralGroups);

  useEffect(() => {
    dispatch(getReferralGroups());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteReferralGroup);

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
    navigate(`referral-group/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Referral Group"
        linkTo="referral-group"
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
