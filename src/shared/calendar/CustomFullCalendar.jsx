import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "primereact/skeleton";
import { Calendar as PrimeCalendar } from "primereact/calendar";
import moment from "moment";
import { useServerTime } from "../../hooks/useServerTime";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import PrimaryButton from "../buttons/PrimaryButton";

export default function CustomFullCalendar({
  ref,
  initialView = "timeGridWeek",
  loading = false,

  slotDuration = "00:30:00",
  eventOverlap = true,
  allDaySlot = false,
  height = "600px",
  events = [],
  selectable = true,
  selectMirror = true,

  onSelect = () => {},
  onEventClick = () => {},
  onEventResize = () => {},
  onEventDrop = () => {},
  eventContent,

  ...props
}) {
  const { getServerDate } = useServerTime();
  const calendarRef = ref || useRef();
  const getCalendarApi = () => calendarRef.current?.getApi();

  const [dateRange, setDateRange] = useState("");
  const [selectedDate, setSelectedDate] = useState(getServerDate());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    updateRangeText();
  }, [initialView]);

  function updateRangeText() {
    const api = getCalendarApi();
    if (!api) return;

    const view = api.view;
    const start = moment(view.currentStart);
    const end = moment(view.currentEnd).subtract(1, "day");

    let text = "";

    if (initialView.includes("Week")) {
      text = `${start.format("ddd, DD MMM")} - ${end.format(
        "ddd, DD MMM, YYYY"
      )}`;
    } else if (initialView.includes("Day")) {
      text = start.format("dddd, DD MMM YYYY");
    } else {
      text = start.format("MMMM YYYY");
    }
    setDateRange(text);
  }

  const goToday = () => {
    getCalendarApi().today();
    setSelectedDate(getServerDate());
    updateRangeText();
  };
  const goPrev = () => {
    getCalendarApi().prev();
    updateRangeText();
  };
  const goNext = () => {
    getCalendarApi().next();
    updateRangeText();
  };

  const jumpToDate = (e) => {
    const api = getCalendarApi();
    api.gotoDate(e.value);
    updateRangeText();

    setSelectedDate(e.value);
    setShowDatePicker(false);
  };
  return (
    <div className="custom-full-calendar">
      <div className="flex align-items-center gap-2 flex-wrap justify-content-between mb-2">
        <div className="font-semibold text-lg">
          {loading ? (
            <Skeleton width="20rem" height="2rem" />
          ) : (
            <>
              {dateRange}
              <i
                className="pi pi-calendar cursor-pointer ml-2"
                onClick={() => setShowDatePicker(!showDatePicker)}
              ></i>
            </>
          )}
          {showDatePicker && (
            <PrimeCalendar
              value={selectedDate}
              onChange={jumpToDate}
              dateFormat="yy-mm-dd"
              className="absolute z-5 w-3"
              showLabel={false}
              inline
            />
          )}
        </div>

        <div className="flex gap-2 ">
          {" "}
          {loading ? (
            <Skeleton width="20rem" height="3rem" />
          ) : (
            <>
              <PrimaryButton
                icon="pi pi-chevron-left"
                label="Prev"
                onClick={goPrev}
              />
              <PrimaryButton label="Today" onClick={goToday} />
              <PrimaryButton
                icon="pi pi-chevron-right"
                label="Next"
                onClick={goNext}
                iconPos="right"
              />
            </>
          )}
        </div>
      </div>
      {loading ? (
        <>
          <div className="grid mt-2">
            {[...Array(7)].map((day, idx) => (
              <div key={idx} className="col text-center font-medium">
                <Skeleton width="100%" height="1.3rem" />
              </div>
            ))}
          </div>
          {[...Array(6)].map((_, rowIdx) => (
            <div key={rowIdx} className="grid mb-2">
              {[...Array(7)].map((_, colIdx) => (
                <div key={colIdx} className="col">
                  <Skeleton height="3rem" className="w-full" />
                </div>
              ))}
            </div>
          ))}
        </>
      ) : (
        <div className="w-full bg-white">
          <FullCalendar
            headerToolbar={false}
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              resourceTimelinePlugin,
              resourceTimeGridPlugin,
            ]}
            slotDuration={slotDuration}
            eventOverlap={eventOverlap}
            allDaySlot={allDaySlot}
            height={height}
            events={events}
            initialView={initialView}
            selectable={selectable}
            selectMirror={selectMirror}
            select={(e) => onSelect(e, calendarRef)}
            eventClick={(e) => onEventClick(e, calendarRef)}
            eventResize={(e) => onEventResize(e, calendarRef)}
            eventDrop={(e) => onEventDrop(e, calendarRef)}
            eventContent={eventContent}
            {...props}
          />
        </div>
      )}
    </div>
  );
}
