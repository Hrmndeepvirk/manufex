import { useEffect, useState } from "react";
import DetailsPageLayout from "@shared/layout/DetailsPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomListItem from "@shared/cards/CustomListItem";
import { useDispatch, useSelector } from "react-redux";
import { getSchedulingOptions } from "@store/settings/scheduleSetup/schedulingOptionsActions";
import CustomSimpleTable from "@shared/table/CustomSimpleTable";
import { getSpecialTimingsAndHolidays } from "@store/settings/scheduleSetup/specialTimingAndHolidaysActions";
import { deleteSpecialSchedule } from "@store/settings/scheduleSetup/specialTimingAndHolidaysActions";
import SpecialTimingsAndHolidays from "./SchedulingOptionsForm/SpecialTimingsAndHolidays";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";

export default function SchedulingOptions() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const schedulingOptions = useSelector(
    (state) => state.settings.scheduleSetup.schedulingOptions
  );

  const specialTimings = useSelector(
    (state) =>
      state.settings.scheduleSetup.specialTimingsAndHolidays?.timingAndHoliday
  );

  useEffect(() => {
    dispatch(getSchedulingOptions(setLoading));
  }, []);

  const WEEK_ORDER = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const formatDay = (day) => day.charAt(0) + day.slice(1).toLowerCase();

  const formatTime = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    return `${+h % 12 || 12}:${m} ${+h >= 12 ? "PM" : "AM"}`;
  };

  const formatLabelText = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const columns = [
    {
      header: "S.No",
      body: (_, rowIndex) => rowIndex + 1,
    },
    {
      header: "Date",
      field: "date",
      isDate: true,
    },
    {
      header: "Open",
      field: "open",
      isBoolean: true,
    },
    {
      header: "Start Time",
      field: "startTime",
      isTime: true,
    },
    {
      header: "End Time",
      field: "endTime",
      isTime: true,
    },
  ];

  const refresh = () => {
    dispatch(getSpecialTimingsAndHolidays(() => {}));
  };

  useEffect(() => {
    dispatch(getSpecialTimingsAndHolidays(() => {}));
  }, []);

  const onEditSpecialTiming = (row) => {
    setSelectedRow(row);
    setShowForm(true);
  };

  const onDeleteSpecialTiming = (row) => {
    customConfirmDialog({
      message: "Do you want to delete this record?",
      accept: () => {
        dispatch(deleteSpecialSchedule(row._id));
      },
      reject: () => {},
    });
  };

  const onHideForm = () => {
    setShowForm(false);
    setSelectedRow(null);
  };

  return (
    <>
      <SpecialTimingsAndHolidays
        visible={showForm}
        onHide={onHideForm}
        refresh={refresh}
        selectedRow={selectedRow}
      />
      <DetailsPageLayout
        buttonLabel="Edit Schedules"
        linkTo={"scheduling-options"}
        pageLoading={loading}
      >
        <CustomCard title="Hours of Operation" size={6}>
          {WEEK_ORDER.map((day) => {
            // find which schedule entry contains this day
            const schedule = schedulingOptions?.hoursOperation?.find((op) =>
              op.days.includes(day)
            );

            return (
              <CustomListItem
                key={day}
                label={formatDay(day)}
                value={
                  schedule
                    ? `${formatTime(schedule.startTime)} - ${formatTime(
                        schedule.endTime
                      )}`
                    : "Closed"
                }
              />
            );
          })}
        </CustomCard>

        <CustomCard title="Booking Rules" size={6} height={"100%"}>
          <CustomListItem
            name="allowPastBookings"
            value={formatLabelText(schedulingOptions?.allowPastBookings)}
            data={schedulingOptions}
          />
          <CustomListItem
            name="allowOffHoursBookings"
            data={schedulingOptions}
            value={formatLabelText(
              schedulingOptions?.allowOffHoursBookings?.toString()
            )}
          />
          <CustomListItem data={schedulingOptions} name="requireComment" />
          <CustomListItem data={schedulingOptions} name="allowWaitlist" />
        </CustomCard>

        <CustomCard
          title="Special Timings and Holidays"
          size={12}
          actions
          onAdd={() => {
            setShowForm(true);
          }}
        >
          <div className="c-col-12">
            <CustomSimpleTable
              columns={columns}
              data={specialTimings}
              onEdit={onEditSpecialTiming}
              onDelete={onDeleteSpecialTiming}
            />
          </div>
        </CustomCard>
      </DetailsPageLayout>
    </>
  );
}
