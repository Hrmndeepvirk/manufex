import { useEffect, useState } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";

import {
  getRewardsCatalogs,
  deleteRewardsCatalog,
} from "../../../../store/settings/rewards/rewardCatalogActions";

export default function RewardsCatalog() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const data = useSelector((state) => state.settings.rewards.rewardCatalogs);

  useEffect(() => {
    dispatch(getRewardsCatalogs(setLoading));
  }, [dispatch]);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "description" },
    { field: "points", header: "Points" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`reward-catalog/${id}`);
  };

  const onDelete = (id) => {
    dispatch(deleteRewardsCatalog(id));
  };

  return (
    <ListPageLayout
      buttonLabel="Add Reward Item"
      linkTo="reward-catalog"
      searchable={["title"]}
      tableData={data}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
      loading={loading}
    />
  );
}
