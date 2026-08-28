import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  getCampaignGroups,
  deleteCampaignGroup,
} from "@store/settings/memberSetup/campaignGroupActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function CampaignGroup() {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.settings.memberSetup.campaignGroups
  );

  useEffect(() => {
    dispatch(getCampaignGroups());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteCampaignGroup);

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
    navigate(`campaign-group/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Campaign Group"
        linkTo="campaign-group"
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
