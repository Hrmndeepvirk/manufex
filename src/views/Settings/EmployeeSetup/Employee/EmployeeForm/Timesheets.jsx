import { useEffect, useMemo } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import { deleteTimeSheet } from "@store/settings/employeeSetup/timesheetsActions";
import { useParams } from "react-router-dom";
import { getEmployeeTimesheets } from "../../../../../store/settings/employeeSetup/employeeActions";

export default function EmployeeTimeSheets() {
  const { id } = useParams();

  const dispatch = useDispatch();
  let data = useSelector(
    (state) => state.settings.employeeSetup.employeeTimesheets,
  );

  data = useMemo(() => {
    if (id) {
      return data.filter((item) => item.employee === id);
    } else {
      return data;
    }
  }, [data, id]);

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeTimesheets(id));
    }
  }, [id, dispatch]);

  let columns = [
    { field: "employee", header: "Employee", optionsKey: "employees" },
    {
      field: "club",
      header: "Club",
      optionsKey: "clubs",
      // sortable: true,
    },
    {
      field: "department",
      header: "Department",
      optionsKey: "departments",
    },

    { field: "comment" },
    { field: "clockIn", isDateTime: true },
    { field: "clockOut", isDateTime: true },

    {
      field: "session",
      body: (row) => (row.session === null ? `-` : `${row.session} Minutes`),
    },
    // { field: "modifiedOn", isDate: true },
  ];

  const onEdit = (id, navigate) => {
    navigate(`job-title/${id}`);
  };

  const onDelete = (id) => {
    dispatch(deleteTimeSheet(id));
  };

  return (
    <ListPageLayout
      addPadding
      backText="Employees"
      // buttonLabel="Add TimeSheet"
      // linkTo={"job-title"}
      // searchable={["title"]}
      tableData={data}
      columns={columns}
      // onDelete={onDelete}
      // onEdit={onEdit}
    />
  );
}
