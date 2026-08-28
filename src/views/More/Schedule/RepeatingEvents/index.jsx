import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CustomCard from "@shared/cards/CustomCard";
import CustomSimpleTable from "@shared/table/CustomSimpleTable";
import FormPageLayout from "@shared/layout/FormPageLayout";

import { formatEnum } from "@utils/common";
import { getRepeatingEvents } from "@store/more/schedule/repeatingEventActions";
import ListPageLayout from "@shared/layout/ListPageLayout";

export default function RepeatingEvents() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const repeatingEvents = useSelector(
    (state) => state.schedule?.repeatingEvents ?? []
  );

  useEffect(() => {
    dispatch(getRepeatingEvents(setLoading));
  }, [dispatch]);

  const columns = [
    {
      header: "Event",
      body: (row) => row?.calanderEvent?.event?.title ?? "-",
    },
    {
      header: "Description",
      body: (row) => row?.calanderEvent?.event?.description ?? "-",
    },
    {
      header: "Days",
      body: (row) => row?.days?.map(formatEnum).join(", "),
    },
    {
      header: "Start Date",
      field: "startDate",
      isDate: true,
    },
    {
      header: "End Date",
      field: "endDate",
      isDate: true,
    },
  ];
  const tableData = repeatingEvents.map((item) => ({
    ...item,
    _id: item?.calanderEvent?._id,
  }));

  return (
    <FormPageLayout backText="Schedule" hideCancel>
      <div className="c-col-12">
        <ListPageLayout
          tableData={tableData}
          columns={columns}
          loading={loading}
          onView={(calendarEventId, navigate) =>
            navigate(`/calendar/event/${calendarEventId}/repeat-event?repeated=true`)
          }
        />
      </div>
    </FormPageLayout>
  );
}
