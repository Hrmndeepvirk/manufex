import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import {
  deleteEventCategory,
  getEventCategories,
} from "../../../../store/settings/scheduleSetup/eventCategoryActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function EventCategory() {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.settings.scheduleSetup.eventCategories
  );

  useEffect(() => {
    dispatch(getEventCategories());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteEventCategory);

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
    navigate(`event-category/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Event Category"
        linkTo="event-category"
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
