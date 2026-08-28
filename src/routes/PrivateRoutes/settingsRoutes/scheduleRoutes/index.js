import { lazy } from "react";

const LevelForm = lazy(() =>
  import("@views/Settings/ScheduleSetup/Level/LevelForm")
);

const LocationTypeForm = lazy(() =>
  import("@views/Settings/ScheduleSetup/LocationType/LocationTypeForm")
);

const LocationForm = lazy(() =>
  import("@views/Settings/ScheduleSetup/Location/LocationForm")
);

const EventCategoryForm = lazy(() =>
  import("@views/Settings/ScheduleSetup/EventCategory/EventCategoryForm")
);

const EventSetupForm = lazy(() =>
  import("@views/Settings/ScheduleSetup/EventSetup/EventSetupForm")
);

const ClassForm = lazy(() =>
  import("@views/Settings/ScheduleSetup/Class/ClassForm")
);

const HoursOfOperations = lazy(() =>
  import(
    "../../../../views/Settings/ScheduleSetup/SchedulingOptions/SchedulingOptionsForm/HoursOfOperations"
  )
);

const ScheduleRoutes = [
  {
    name: "Add Level",
    component: LevelForm,
    path: "/level/:id?",
    exact: true,
  },
  {
    name: "Add Location Type",
    component: LocationTypeForm,
    path: "/location-type/:id?",
    exact: true,
  },
  {
    name: "Add Location",
    component: LocationForm,
    path: "/location/:id?",
    exact: true,
  },
  {
    name: "Add Event Category",
    component: EventCategoryForm,
    path: "/event-category/:id?",
    exact: true,
  },

  {
    name: "Add Event Setup",
    component: EventSetupForm,
    path: "/event-setup/:id?",
    exact: true,
  },
  {
    name: "Add Class",
    component: ClassForm,
    path: "/class/:id?",
    exact: true,
  },
  {
    name: "Add Schedule",
    component: HoursOfOperations,
    path: "/scheduling-options/:id?",
    exact: true,
  },
];
export default ScheduleRoutes;
