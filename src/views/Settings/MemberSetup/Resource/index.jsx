import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteResource,
  getResources,
} from "../../../../store/settings/memberSetup/resourceActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function Resource() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.settings.memberSetup.resources);

  useEffect(() => {
    dispatch(getResources());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteResource);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "resourceType", optionsKey: "resourceTypes" },
    { field: "description" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`resource/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Resource"
        linkTo="resource"
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
