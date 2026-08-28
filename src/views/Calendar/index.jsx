import React, { useEffect, useState, useMemo, useCallback } from "react";
import moment from "moment";
import CustomCalendar from "./FullCalendar/CustomCalendar";
import { useDispatch, useSelector } from "react-redux";
import { getScheduleSettings } from "../../store/calendar/calendarActions";
import EventForm from "./Event/EventForm";
import { getCalendarEvents } from "../../store/calendar/calendarEventActions";
import {
  setCachedRange,
  resetCalendarCache,
} from "../../store/calendar/calendarSlice";
import { useLocation, useNavigate } from "react-router-dom";

function Calendar() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cachedRange = useSelector((s) => s.calendar.cachedRange);
  useEffect(() => {
    dispatch(getScheduleSettings());
  }, [dispatch]);

  const handleViewportChange = useCallback(
    ({ start, end }) => {
      const midpoint = moment(start).add(
        moment(end).diff(moment(start), "days") / 2,
        "days",
      );
      const midpointStr = midpoint.format("YYYY-MM-DD");
      const desiredStart = midpoint.clone().subtract(10, "days").startOf("day");
      const desiredEnd = midpoint.clone().add(10, "days").endOf("day");

      if (!cachedRange) {
        dispatch(getCalendarEvents(midpointStr));
        dispatch(
          setCachedRange({
            start: desiredStart.toISOString(),
            end: desiredEnd.toISOString(),
          }),
        );
        return;
      }

      const cStart = moment(cachedRange.start);
      const cEnd = moment(cachedRange.end);

      // Cache hit — desired window fully inside cached range
      if (
        desiredStart.isSameOrAfter(cStart) &&
        desiredEnd.isSameOrBefore(cEnd)
      ) {
        return;
      }

      // No overlap with cache — reset and replace
      const overlaps = !(
        desiredEnd.isBefore(cStart) || desiredStart.isAfter(cEnd)
      );
      if (!overlaps) {
        dispatch(resetCalendarCache());
        dispatch(getCalendarEvents(midpointStr));
        dispatch(
          setCachedRange({
            start: desiredStart.toISOString(),
            end: desiredEnd.toISOString(),
          }),
        );
        return;
      }

      // Partial overlap — append and extend cached range
      dispatch(getCalendarEvents(midpointStr, { mode: "append" }));
      dispatch(
        setCachedRange({
          start: moment.min(cStart, desiredStart).toISOString(),
          end: moment.max(cEnd, desiredEnd).toISOString(),
        }),
      );
    },
    [dispatch, cachedRange],
  );

  const [eventFormVisible, setEventFormVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState([]);

  const onOpenEventForm = (e) => {
    setEventFormVisible(true);
    setSelectedEvent(e);
  };

  const onCloseEventForm = () => {
    setEventFormVisible(false);
    setSelectedEvent(null);
  };
  const handleDragSelect = (info) => {
    onOpenEventForm(info.eventInfo);
  };

  const events = useSelector((state) => state.calendar.calendarEvents);

  const filteredEvents = useMemo(() => {
    if (!filters || filters.length === 0) {
      return events;
    }

    const employeeFilters = filters
      .filter((f) => f.type === "employees")
      .map((f) => f._id);
    const locationFilters = filters
      .filter((f) => f.type === "locations")
      .map((f) => f._id);
    const resourceFilters = filters
      .filter((f) => f.type === "resources")
      .map((f) => f._id);

    return events.filter((event) => {
      if (
        employeeFilters.length > 0 &&
        !employeeFilters.includes(event.employee)
      ) {
        return false;
      }
      if (
        locationFilters.length > 0 &&
        !locationFilters.includes(event.location)
      ) {
        return false;
      }
      if (resourceFilters.length > 0) {
        if (!event.resource || !resourceFilters.includes(event.resource)) {
          return false;
        }
      }
      return true;
    });
  }, [events, filters]);

  const onEventClick = (info) => {
    navigate(`/calendar/event/${info.event.id}`);
  };

  useEffect(() => {
    if (state) {
      setEventFormVisible(true);
    }
  }, [state]);

  const [data, setData] = useState({
    member: null,
    eventType: "APPOINTMENT",
    event: null,
    eventDate: null,
    startTime: null,
    duration: null,
    endTime: null,

    employee: null,
    resource: null,
    location: null,
  });  

  return (
    <>
      <EventForm
        eventData={selectedEvent}
        visible={eventFormVisible}
        onHide={onCloseEventForm}
        state={state}
        data={data}
        setData={setData}
      />

      <CustomCalendar
        onEventClick={onEventClick}
        events={filteredEvents.map(convertToFullCalendarEvent)}
        onOpenEventForm={onOpenEventForm}
        onDragSelect={handleDragSelect}
        onViewportChange={handleViewportChange}
        filters={filters}
        setFilters={setFilters}
        data={data}
        setData={setData}
      />
    </>
  );
}
export default React.memo(Calendar);
function convertToFullCalendarEvent(dbEvent) {
  // Build start datetime
  const start = `${dbEvent.eventDate.split("T")[0]}T${dbEvent.startTime}:00`;

  // Calculate end time
  const [hour, minute] = dbEvent.startTime.split(":").map(Number);
  const endDate = new Date(dbEvent.eventDate);
  endDate.setHours(hour);
  endDate.setMinutes(minute + dbEvent.duration);

  const end = `${dbEvent.eventDate.split("T")[0]}T${String(
    endDate.getHours()
  ).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}:00`;

  // Return FullCalendar format
  return {
    id: dbEvent._id,
    title: dbEvent?.eventDetails?.title,
    start,
    end,
    extendedProps: {
      ...dbEvent,
    },
  };
}
