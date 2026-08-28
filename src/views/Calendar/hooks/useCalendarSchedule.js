import React, { useMemo } from "react";
import { useSelector } from "react-redux";
const dayMap = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export default function useCalendarSchedule({ onDragSelect, resourceType }) {
  const scheduleSettings = useSelector(
    (state) => state.calendar.scheduleSettings,
  );
  const { allowOffHoursBookings, allowPastBookings, hoursOperation } =
    scheduleSettings || {
      hoursOperation: [],
      allowPastBookings: "",
      allowOffHoursBookings: "",
    };

  function handleSelect(e, businessHours) {
    let { startStr, endStr } = e;

    const [eventDate, restStart] = startStr.split("T");
    const startTime = restStart.slice(0, 5); // first 5 chars "HH:MM"

    const [, restEnd] = endStr.split("T");
    const endTime = restEnd.slice(0, 5);

    onDragSelect({
      eventInfo: {
        eventDate,
        startTime,
        endTime,
        resource: e.resource ? e.resource.id : null,
        resourceType,
        softWarning: !isWithinBusinessHours(e, businessHours),
        businessHours,
      },
      e,
    });
  }

  let businessHours = useMemo(
    () =>
      hoursOperation.map((item) => ({
        startTime: item.startTime,
        endTime: item.endTime,
        daysOfWeek: item.days.map((day) => dayMap[day]),
      })),
    [hoursOperation, dayMap],
  );

  const calendarBehavior = useMemo(
    () =>
      getCalendarBehavior(allowOffHoursBookings, businessHours, handleSelect),
    [allowOffHoursBookings, businessHours, handleSelect],
  );

  return {
    businessHours,
    calendarBehavior,
  };
}

function getMinTime(businessHours) {
  let all = businessHours.map((x) => x.startTime);
  return all.sort()[0] || "00:00";
}
function getMaxTime(businessHours) {
  let all = businessHours.map((x) => x.endTime);
  return all.sort().reverse()[0] || "24:00";
}
function isWithinBusinessHours(info, businessHours) {
  const day = info.start.getDay(); // 0–6
  const time = info.start.toTimeString().slice(0, 5);
  const matched = businessHours.find((h) => h.daysOfWeek.includes(day));
  if (!matched) return false;
  return time >= matched.startTime && time < matched.endTime;
}
function getCalendarBehavior(mode, businessHours, handleSelect) {
  switch (mode) {
    case "HIDE_AND_DISABLE":
      return {
        select: (e) => handleSelect(e, businessHours),
        businessHours,
        selectConstraint: "businessHours",
        eventConstraint: "businessHours",
        slotMinTime: getMinTime(businessHours),
        slotMaxTime: getMaxTime(businessHours),
      };
    case "DISABLED":
      return {
        businessHours,
        select: (e) => handleSelect(e, businessHours),
        selectAllow: (info) => {
          return isWithinBusinessHours(info, businessHours);
        },
        eventAllow: (info) => {
          return isWithinBusinessHours(info, businessHours);
        },
        slotMinTime: getMinTime(businessHours),
        slotMaxTime: getMaxTime(businessHours),
      };
    case "ENABLED_WITH_WARNING":
      return {
        businessHours,
        select: (e) => handleSelect(e, businessHours),
        slotMinTime: getMinTime(businessHours),
        slotMaxTime: getMaxTime(businessHours),
        selectAllow: () => true,
        eventAllow: () => true,
      };
    case "FULLY_ENABLED":
      return {
        businessHours,
        select: (e) => handleSelect(e, businessHours),
        slotMinTime: "00:00",
        slotMaxTime: "24:00",
        selectAllow: () => true,
        eventAllow: () => true,
      };

    // fallback
    default:
      return {};
  }
}
