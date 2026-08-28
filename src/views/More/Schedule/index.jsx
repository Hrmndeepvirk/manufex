import React from "react";
import FormPageLayout from "@shared/layout/FormPageLayout";
import GridNavigation from "../../../shared/gridNavigation/GridNavigation";
import CheckIn from "@assets/images/more/Checkinhistory.png";
import Alert from "@assets/images/settings/alert.png";
import Events from "@assets/images/more/Events.png";
import Employee from "@assets/images/more/Employee.png";
import substitutions from "@assets/images/more/substitutions.png";
import RepeatingEvents from "@assets/images/more/RepeatingEvents.png";

export default function Schedule() {
  const items = [
    {
      img: CheckIn,
      link: "/calendar",
      title: "Calendar",
      description: "Employee Name, Department,Check In Date Time",
      bgColor: "bg-blue-50",
    },
    {
      img: Events,
      link: "/more/schedule/events",
      title: "Events",
      description:
        "Levels,Location Types,Locations,Event Setups,Event Categories,Classes,Scheduling Options",
      bgColor: "bg-yellow-50",
    },
    {
      img: Events,
      link: "/more/schedule/shift-schedules",
      title: "Shift Schedules",
      description: "Shift Name, Department, Shift Start Time, Shift End Time",
      bgColor: "bg-blue-50",
    },
    {
      img: Employee,
      link: "/more/schedule/employee-availability",
      title: "Employee Availability",
      description: "Employee Name, Department,Check In Date Time",
      bgColor: "bg-green-50",
    },
    {
      img: substitutions,
      link: "/more/alert",
      title: "Substitutions",
      description: "Tasks",
      bgColor: "bg-indigo-50",
    },
    {
      img: RepeatingEvents,
      link: "/more/schedule/repeating-events",
      title: "Repeating Events",
      description: "Event Details, Manage Events",
      bgColor: "bg-blue-50",
    },
  ];
  return (
    <FormPageLayout backText="More" hideCancel>
      <GridNavigation items={items} />
    </FormPageLayout>
  );
}
