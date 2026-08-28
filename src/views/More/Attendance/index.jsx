import React from "react";
import FormPageLayout from "@shared/layout/FormPageLayout";
import GridNavigation from "../../../shared/gridNavigation/GridNavigation";
import CheckIn from "@assets/images/more/Checkinhistory.png";
import Alert from "@assets/images/settings/alert.png";

export default function Attendance() {
  const items = [
    {
      img: CheckIn,
      link: "/more/checkin",
      title: "Check in History",
      description: "Employee Name, Department,Check In Date Time",
      bgColor: "bg-blue-50",
    },
    {
      img: Alert,
      link: "/more/alert",
      title: "Alerts",
      description: "Date,Title,Employee",
      bgColor: "bg-blue-50",
    },
  ];
  return (
    <FormPageLayout backText="More" hideCancel>
      <GridNavigation items={items} />
    </FormPageLayout>
  );
}
