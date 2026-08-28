import { useEffect, useState } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePointsEarningRule,
  getPointsEarningRules,
} from "@store/settings/rewards/pointsEarningRuleActions";

export default function PointsEarningRules() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const data = useSelector(
    (state) => state.settings.rewards.pointsEarningRules
  );

  useEffect(() => {
    dispatch(getPointsEarningRules(setLoading));
  }, [dispatch]);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    // { field: "description" },
    { field: "type", optionsKey: "PointsEarningTypes" },
    { field: "points", header: "Points" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`points-earning-rule/${id}`);
  };

  const onDelete = (id) => {
    dispatch(deletePointsEarningRule(id));
  };

  return (
    <ListPageLayout
      buttonLabel="Add Earning Rule"
      linkTo="points-earning-rule"
      searchable={["title"]}
      tableData={data}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
      loading={loading}
    />
  );
}
