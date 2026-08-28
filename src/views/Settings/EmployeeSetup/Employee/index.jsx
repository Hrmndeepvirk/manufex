import { useEffect, useState } from "react";
import { Badge } from "primereact/badge";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployees,
  deleteEmployee,
} from "@store/settings/employeeSetup/employeeActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete";

export default function Employee() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const data = useSelector((state) => state.settings.employeeSetup.employees);
  const { onDelete, DependencyDialog } = useDependencyDelete(deleteEmployee);

  useEffect(() => {
    dispatch(getEmployees(setLoading));
  }, [dispatch]);

  let columns = [
    {
      field: "firstName",
      header: "Name",
      body: (rowData) => {
        return (
          <span>
            {rowData.firstName} {rowData.lastName} &nbsp;
            {rowData.role === "ADMIN" && <span className="badge">Admin</span>}
          </span>
        );
      },
    },
    { field: "employeeId" },
    { field: "addressLine1", header: "Address" },
    { field: "primaryPhone" },
    { field: "hireDate", isDate: true },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`employee/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Employee"
        linkTo={"/settings/employee-setup/employee"}
        searchable={["firstName", "lastName", "employeeId", "primaryPhone"]}
        tableData={data}
        columns={columns}
        onDelete={onDelete}
        onEdit={onEdit}
        loading={loading}
      />
      {DependencyDialog}
    </>
  );
}
// Note: onClick function for "Add Reason Code" button is currently empty and should be implemented as needed.
