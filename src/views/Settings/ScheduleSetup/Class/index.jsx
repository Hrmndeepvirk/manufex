import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import {
  deleteClass,
  getClasses,
} from "@store/settings/scheduleSetup/classActions";
import { formatEnum } from "@utils/common";
import { deleteClassAndEvents } from "../../../../store/settings/scheduleSetup/classActions";

export default function Class() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const data = useSelector((state) => state.settings.scheduleSetup.classes);

  useEffect(() => {
    dispatch(getClasses(setLoading));
  }, [dispatch]);

  let columns = [
    {
      field: "event",
      optionsKey: "eventSetups",
      sortable: true,
    },
    {
      field: "classMeet",
      header: "Type",
      body: (row) => `${formatEnum(row?.classMeet)}`,
    },

    {
      field: "startDate",
      body: (row) => `${row?.eventDate || row?.startDate}`,
    },
    { field: "endDate" },
    {
      header: "Days",
      body: (row) =>
        `${row?.day ? formatEnum(row?.day) : row?.days?.map(formatEnum).join(", ")}`,
    },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`class/${id}`);
  };

  const onDelete = (id) => {
    dispatch(deleteClassAndEvents(id, setLoading));
  };

  return (
    <ListPageLayout
      buttonLabel="Add Class"
      linkTo="/settings/schedule-setup/class"
      searchable={["title"]}
      tableData={data}
      columns={columns}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
