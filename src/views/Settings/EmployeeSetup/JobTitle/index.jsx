import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteJobTitle,
  getJobTitles,
} from "../../../../store/settings/employeeSetup/jobTitleActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function JobTitle() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.settings.employeeSetup.jobTitles);

  useEffect(() => {
    dispatch(getJobTitles());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteJobTitle);

  let columns = [
    {
      field: "title",
      header: "Job Title",
      sortable: true,
    },
    { field: "defaultWage", isCurrency: true },
    { field: "description" },
    { field: "isActive", header: "Active" },
    { field: "createdAt", header: "Created At" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`job-title/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Job Title"
        linkTo={"job-title"}
        searchable={["title"]}
        tableData={data}
        columns={columns}
        onDelete={onDelete}
        onEdit={onEdit}
      />
      {DependencyDialog}
    </>
  );
}
