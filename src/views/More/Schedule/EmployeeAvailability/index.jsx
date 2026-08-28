import React, { memo } from "react";
import CustomTabView from "@shared/tabView/CustomTabView";
import ShiftAvailability from "./ShiftAvailability";
import CalendarAvailability from "./CalendarAvailability";

function EmployeeAvailability() {
  const tabs = [
    { title: "Calendar Availability", content: <CalendarAvailability /> },
      { title: "Shift Availability", content: <ShiftAvailability /> },  
  ];
  return <CustomTabView tabs={tabs} />;
}

export default memo(EmployeeAvailability);
