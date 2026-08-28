import { addMinutes, getTime } from "@utils/dateTime";

function timesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

export function getConflictWarnings({
  employeeSummary,
  locationEvents,
  startTime,
  duration,
  eventSetupId,
  eventType,
}) {
  const warnings = [];

  if (!startTime) return warnings;

  const availability = employeeSummary?.calendarAvailability;
  
  // --- Calendar Events Conflicts ---
  if (employeeSummary?.calendarEvents?.length) {
    if (!duration) {
      employeeSummary.calendarEvents.forEach((evt) => {
        const evtEnd = addMinutes(evt.startTime, evt.duration);
        if (startTime >= evt.startTime && startTime < evtEnd) {
          const eventName = evt.eventDetails?.title || "another event";
          warnings.push({
            type: "event",
            message: `${employeeSummary.employee} is already booked for ${eventName} from ${getTime(evt.startTime)} to ${getTime(evtEnd)}.`,
          });
        }
      });
    } else {
      const endTime = addMinutes(startTime, duration);
      employeeSummary.calendarEvents.forEach((evt) => {
        const evtEnd = addMinutes(evt.startTime, evt.duration);
        if (timesOverlap(startTime, endTime, evt.startTime, evtEnd)) {
          const eventName = evt.eventDetails?.title || "another event";
          warnings.push({
            type: "event",
            message: `${employeeSummary.employee} is already booked for ${eventName} from ${getTime(evt.startTime)} to ${getTime(evtEnd)}.`,
          });
        }
      });
    }
  }

  // --- Calendar Availability Checks ---
  if (employeeSummary) {
    const slots = availability?.availableSlots || [];
    const endTime = duration ? addMinutes(startTime, duration) : null;

    // Show available slots if the selected time doesn't fall within any
    if (slots.length) {
      const matchingSlot = endTime
        ? slots.find((s) => startTime >= s.startTime && endTime <= s.endTime)
        : slots.find((s) => startTime >= s.startTime && startTime < s.endTime);

      if (!matchingSlot) {
        const slotRanges = slots
          .map((s) => `${getTime(s.startTime)} - ${getTime(s.endTime)}`)
          .join(", ");
        warnings.push({
          type: "availability",
          message: `${employeeSummary.employee} has set their availability for ${slotRanges} today.`,
        });
      } else if (eventSetupId && eventType) {
        // Check if the selected event is in this slot's appointments/classes
        const slotEventIds =
          eventType === "APPOINTMENT"
            ? (matchingSlot.appointments || []).map(String)
            : (matchingSlot.classes || []).map(String);

        if (slotEventIds.length && !slotEventIds.includes(String(eventSetupId))) {
          // Get names of events the employee IS available for from the details
          const details =
            eventType === "APPOINTMENT"
              ? availability?.appointmentDetails || []
              : availability?.classDetails || [];

          // Only show the ones that belong to this matching slot
          const slotDetailNames = details
            .filter((d) => slotEventIds.includes(String(d._id)))
            .map((d) => d.title);

          if (slotDetailNames.length) {
            const label =
              eventType === "APPOINTMENT" ? "appointments" : "classes";
            warnings.push({
              type: "availability",
              message: `${employeeSummary.employee} has set their availability for ${slotDetailNames.join(", ")} during ${getTime(matchingSlot.startTime)} - ${getTime(matchingSlot.endTime)}.`,
            });
          }
        }
      }
    } else {
      warnings.push({
        type: "availability",
        message: `${employeeSummary.employee} has not set any availability for today.`,
      });
    }

    // Blocked slots check
    const blocked = availability?.blockedSlots || [];
    blocked.forEach((slot) => {
      const overlaps = endTime
        ? timesOverlap(startTime, endTime, slot.startTime, slot.endTime)
        : startTime >= slot.startTime && startTime < slot.endTime;

      if (overlaps) {
        const reason = slot.type
          ? slot.type.charAt(0) + slot.type.slice(1).toLowerCase()
          : "Personal";
        const note = slot.note ? ` — "${slot.note}"` : "";
        warnings.push({
          type: "blocked",
          message: `${employeeSummary.employee} has blocked ${getTime(slot.startTime)} to ${getTime(slot.endTime)} for ${reason}${note}.`,
        });
      }
    });
  }

  // --- Location Conflicts ---
  if (locationEvents?.calendarEvents?.length) {
    if (!duration) {
      locationEvents.calendarEvents.forEach((evt) => {
        const evtEnd = addMinutes(evt.startTime, evt.duration);
        if (startTime >= evt.startTime && startTime < evtEnd) {
          const eventName = evt.eventDetails?.title || "another event";
          warnings.push({
            type: "location",
            message: `This location is already booked for ${eventName} from ${getTime(evt.startTime)} to ${getTime(evtEnd)}.`,
          });
        }
      });
    } else {
      const endTime = addMinutes(startTime, duration);
      locationEvents.calendarEvents.forEach((evt) => {
        const evtEnd = addMinutes(evt.startTime, evt.duration);
        if (timesOverlap(startTime, endTime, evt.startTime, evtEnd)) {
          const eventName = evt.eventDetails?.title || "another event";
          warnings.push({
            type: "location",
            message: `This location is already booked for ${eventName} from ${getTime(evt.startTime)} to ${getTime(evtEnd)}.`,
          });
        }
      });
    }
  }

  return warnings;
}
