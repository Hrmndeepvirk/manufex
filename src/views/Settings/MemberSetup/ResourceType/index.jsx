import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteResourceType,
  getResourceTypes,
} from "../../../../store/settings/memberSetup/resourceTypeActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function ResourceType() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.settings.memberSetup.resourceTypes);

  useEffect(() => {
    dispatch(getResourceTypes());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteResourceType);

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
    navigate(`resource-type/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Resource Type"
        linkTo="resource-type"
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
