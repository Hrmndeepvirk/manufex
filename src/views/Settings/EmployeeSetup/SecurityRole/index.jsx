import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  getSecurityRoles,
  deleteSecurityRole,
} from "@store/settings/employeeSetup/securityRoleActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function SecurityRole() {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.settings.employeeSetup.securityRoles
  );

  useEffect(() => {
    dispatch(getSecurityRoles());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteSecurityRole);

  let columns = [
    {
      field: "title",
      header: "Title",
      sortable: true,
    },
    { field: "description", header: "Description" },
    { field: "createdAt", header: "Created At" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`security-role/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Security Role"
        linkTo={"/settings/employee-setup/security-role"}
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
