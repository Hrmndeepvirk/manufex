import { lazy } from "react";

const EventViewForm = lazy(() => import("@views/Calendar/Event/EventViewForm"));
const RepeatEventForm = lazy(() =>
  import("@views/Calendar/Event/RepeatEventForm")
);

const CalendarRoutes = [
  {
    path: "/event/:id",
    name: "Event View Form",
    exact: true,
    component: EventViewForm,
  },
  {
    path: "/event/:id/repeat-event",
    name: "Repeat Event Form",
    exact: true,
    component: RepeatEventForm,
  },
];
export default CalendarRoutes;
