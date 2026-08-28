import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import {
  getEventSetups,
  deleteEventSetup,
} from "@store/settings/scheduleSetup/eventSetupActions";
import { formatEnum } from "@utils/common";
import { copyEvent } from "../../../../store/settings/scheduleSetup/eventSetupActions";

export default function EventSetup() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [, setCopyLoading] = useState(false);
  const data = useSelector((state) => state.settings.scheduleSetup.eventSetups);

  useEffect(() => {
    dispatch(getEventSetups(setLoading));
  }, [dispatch]);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    {
      field: "eventType",
      header: "Type",
      body: (row) => formatEnum(row?.eventType),
    },
    {
      header: "Color Scheme",
      body: (row) => (
        <>
          <div className="w-12 p-1 bg-white border-round-md">
            <div
              className="w-full px-2 py-1 border-round-md"
              style={{ backgroundColor: row?.boxColor, color: row?.textColor }}
            >
              Event Info...
            </div>
          </div>
        </>
      ),
    },
    { field: "description" },
    { field: "eventCategory", optionsKey: "eventCategories", },
    { field: "locationType", optionsKey: "locationTypes" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`event-setup/${id}`);
  };

  const onDelete = (id) => {
    dispatch(deleteEventSetup(id));
  };

  const onCopy = (id) => {
    dispatch(copyEvent(id, setCopyLoading, () => {}));
  };

  return (
    <ListPageLayout
      buttonLabel="Add Event Setup"
      linkTo="/settings/schedule-setup/event-setup"
      searchable={["title"]}
      tableData={data}
      columns={columns}
      loading={loading}
      onEdit={onEdit}
      onCopy={onCopy}
      copyIcon="pi pi-clone"
      copyLabel="Duplicate"
      onDelete={onDelete}
    />
  );
}
