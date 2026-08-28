import React, { forwardRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { formatEnum } from "@utils/common";
import moment from "moment";

const FIELD_RENDERERS = {
  EVENT: {
    icon: "bi bi-calendar-event",
    label: "Event",
    value: (e) => e?.eventDetails?.title || e?.title,
  },
  DURATION: {
    icon: "bi bi-clock",
    label: "Duration",
    value: (e) => (e?.duration ? `${e.duration} min` : null),
  },
  LEVEL: {
    icon: "bi bi-bar-chart",
    label: "Level",
    value: (e) =>
      e?.levelDetails?.title ||
      e?.eventDetails?.levelDetails?.title ||
      null,
  },
  LOCATION: {
    icon: "bi bi-geo-alt",
    label: "Location",
    value: (e) => e?.locationDetails?.title,
  },
  EMPLOYEE_NAME: {
    icon: "bi bi-person",
    label: "Employee",
    value: (e) => e?.employeeDetails?.title,
  },
  MEMBER_NAME: {
    icon: "bi bi-people",
    label: "Members",
    value: (e) => {
      const names = (e?.eventMembers || [])
        .map((m) => m?.member?.title)
        .filter(Boolean);
      return names.length ? names.join(", ") : null;
    },
  },
  STATUS: {
    icon: "bi bi-info-circle",
    label: "Status",
    value: (e) => (e?.status ? formatEnum(e.status) : null),
  },
  ENROLLED_MAX_ATTENDANCE: {
    icon: "bi bi-person-check",
    label: "Attendance",
    value: (e) => {
      const current =
        e?.enrollment?.current ?? e?.eventMembers?.length ?? 0;
      const max =
        e?.enrollment?.maximum ??
        e?.eventDetails?.defaultMaxAttendes ??
        "-";
      return `${current} / ${max}`;
    },
  },
};

function EventHoverPopup({ event, options = [], accentColor }, ref) {
  const visibleOptions = (options || []).filter(
    (opt) => opt && opt !== "NONE" && FIELD_RENDERERS[opt],
  );

  const rows = visibleOptions
    .map((opt) => {
      const renderer = FIELD_RENDERERS[opt];
      const value = renderer.value(event);
      if (value === null || value === undefined || value === "") return null;
      return { key: opt, ...renderer, value };
    })
    .filter(Boolean);

  const title = event?.eventDetails?.title || event?.title || "Event";
  const dateLine = buildDateLine(event);
  const color = accentColor || event?.eventDetails?.boxColor || "#1E88E5";

  return (
    <OverlayPanel
      ref={ref}
      dismissable={false}
      showCloseIcon={false}
      className="event-hover-popup"
    >
      <div
        style={{
          minWidth: "260px",
          maxWidth: "340px",
          borderLeft: `4px solid ${color}`,
          paddingLeft: "12px",
          paddingRight: "4px",
          paddingTop: "4px",
          paddingBottom: "4px",
        }}
      >
        <div className="font-semibold text-color-primary mb-1" style={{ fontSize: 14 }}>
          {title}
        </div>
        {dateLine && (
          <div
            className="text-color-secondary mb-2"
            style={{ fontSize: 12 }}
          >
            {dateLine}
          </div>
        )}
        {rows.length > 0 && (
          <div className="flex flex-column gap-1">
            {rows.map((row) => (
              <div
                key={row.key}
                className="text-color-primary"
                style={{ fontSize: 12, wordBreak: "break-word" }}
              >
                <span className="text-color-secondary mr-1">{row.label}:</span>
                {row.value}
              </div>
            ))}
          </div>
        )}
      </div>
    </OverlayPanel>
  );
}

function buildDateLine(event) {
  if (!event?.eventDate) return null;
  const date = moment(event.eventDate).format("dddd, MMM D");
  const time = event?.startTime ? ` · ${event.startTime}` : "";
  return `${date}${time}`;
}

export default React.memo(forwardRef(EventHoverPopup));
