import React from "react";
import CustomTabView from "@shared/tabView/CustomTabView";
import EmployeeRequests from "./EmployeeRequests";
import RequestHistory from "./RequestHistory";

const REQUEST_STATUS_COLORS = {
  pending: "var(--color-warning)",
  approved: "var(--color-success)",
  rejected: "var(--color-danger)",
};

export default function Request() {
  const tabs = [
    {
      title: "Employee Requests",
      content: <EmployeeRequests statusColors={REQUEST_STATUS_COLORS} />,
    },
    {
      title: "Requests History",
      content: <RequestHistory statusColors={REQUEST_STATUS_COLORS} />,
    },
  ];

  
  return <CustomTabView tabs={tabs} />;
}
