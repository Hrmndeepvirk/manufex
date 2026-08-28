import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDepartment,
  getDepartments,
} from "../../../../store/settings/employeeSetup/departmentActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function Department() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.settings.employeeSetup.departments);

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteDepartment);

  let columns = [
    {
      field: "title",
      header: "Title",
      sortable: true,
    },
    { field: "departmentCode", header: "Department Code" },
    { field: "description", header: "Description" },
    { field: "createdAt", header: "Created At" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`department/${id}`);
  };

  const onAddAvailabilty = (id, navigate) => {
    navigate(`department-availablity/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Department"
        linkTo={"/settings/employee-setup/department"}
        searchable={["title", "departmentCode", "description"]}
        tableData={data}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
        // onShift={onAddAvailabilty}
      />
      {DependencyDialog}
    </>
  );
}
