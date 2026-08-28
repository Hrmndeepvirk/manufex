import { lazy } from "react";

const ScheduleRoutes = [
  {
    name: "Schedule Events",
    component: lazy(() => import("@views/More/Schedule/Events")),
    path: "/events",
    exact: true,
  },
  {
    name: "Repeating Events",
    component: lazy(() => import("@views/More/Schedule/RepeatingEvents")),
    path: "/repeating-events",
    exact: true,
  },
  {
    name: "Employee Availability",
    component: lazy(
      () => import("@views/More/Schedule/EmployeeAvailability/index"),
    ),
    path: "/employee-availability",
    exact: true,
  },
  {
    name: "Shift Schedules",
    component: lazy(() => import("@views/More/Schedule/ShiftSchedules/index")),
    path: "/shift-schedules",
    exact: true,
  },
];
export default ScheduleRoutes;
