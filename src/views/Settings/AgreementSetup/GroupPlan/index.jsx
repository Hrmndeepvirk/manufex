import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import {
  getGroupPlans,
  deleteGroupPlan,
} from "@store/settings/agreementSetup/groupPlanActions";

export default function GroupPlan() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const data = useSelector(
    (state) => state.settings.agreementSetup.groupPlans,
  );

  useEffect(() => {
    dispatch(getGroupPlans(setLoading));
  }, [dispatch]);

  const columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "description" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`group-plan/${id}`);
  };

  const onDelete = (id) => {
    dispatch(deleteGroupPlan(id));
  };

  return (
    <ListPageLayout
      buttonLabel="Add Group Plan"
      linkTo="group-plan"
      searchable={["title"]}
      tableData={data}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
      loading={loading}
    />
  );
}
