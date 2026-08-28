import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import {
  deleteAccessedSchedule,
  getAccessedSchedules,
} from "../../../../store/settings/memberSetup/accessedScheduleActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function AccessedSchedule() {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.settings.memberSetup.accessSchedules
  );

  useEffect(() => {
    dispatch(getAccessedSchedules());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteAccessedSchedule);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "shortName" },
    { field: "description" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`access-schedule/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Access Schedule"
        linkTo="access-schedule"
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
