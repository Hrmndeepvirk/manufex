import React from "react";

function CalendarEventCard({ event, title, timeText }) {
  const {
    eventDetails,
    duration,
    employeeDetails,
    locationDetails,
    eventMembers,
    status,
    levelDetails,
  } = event || {};
  const {
    boxColor,
    textColor,
    defaultMaxAttendes,
    calanderDisplay = [],
  } = eventDetails || {};
  const showLevel = (calanderDisplay || []).includes("LEVEL");
  const levelTitle =
    levelDetails?.title || eventDetails?.levelDetails?.title || null;

  let borderColor = "none";

  if (status === "COMPLETED") {
    borderColor = "#4cd07D";
  }

  if (status === "CANCEL_NO_CHARGE" || status === "CANCEL_CHARGE") {
    borderColor = "#f51b1b";
  }

  return (
    <div
      style={{
        backgroundColor: boxColor || "#1E88E5",
        color: textColor || "#FFFFFF",
        padding: "4px",
        borderRadius: "4px",
        border: borderColor !== "none" ? `0.1px solid ${borderColor}` : "none",
        fontSize: "12px",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <div
        className="flex justify-content-between"
        style={{ fontSize: "10px" }}
      >
        <span>
          {timeText} {defaultMaxAttendes ? `(${defaultMaxAttendes} Max)` : ""}
        </span>
        {employeeDetails && <span>{employeeDetails?.title}</span>}
      </div>
      <div>
        {title}
        {duration ? ` (${duration} Min.)` : ""}
      </div>
      {locationDetails && <div>At: {locationDetails?.title}</div>}

      {showLevel && levelTitle && <div>Level: {levelTitle}</div>}

      {eventMembers && (
        <div style={{ fontSize: "10px" }}>
          With: {eventMembers.map(({ member }) => member?.title)}
        </div>
      )}
    </div>
  );
}

export default React.memo(CalendarEventCard);
