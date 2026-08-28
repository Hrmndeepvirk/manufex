import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCampaign,
  getCampaigns,
} from "../../../../store/settings/memberSetup/campaignActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function Campaigns() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.settings.memberSetup.campaigns);

  useEffect(() => {
    dispatch(getCampaigns());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteCampaign);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "campaignGroup", optionsKey: "campaignGroups" },
    { field: "description" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`campaign/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Campaign"
        linkTo="campaign"
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
