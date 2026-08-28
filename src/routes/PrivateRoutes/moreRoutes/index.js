import { lazy } from "react";

const Attendance = lazy(() => import("@views/More/Attendance"));
const Pos = lazy(() => import("@views/More/POS"));

import ScheduleRoutes from "./scheduleRoutes";
import posRoutes from "./posRoutes";
const Schedule = lazy(() => import("@views/More/Schedule"));
const Members = lazy(() => import("@views/More/Members"));
const CustomerRelations = lazy(() => import("@views/More/CustomerRelations"));
const Request = lazy(() => import("@views/More/Request"));

const moreRoutes = [
  {
    path: "/attendance",
    name: "attendance",
    exact: true,
    component: Attendance,
  },
  {
    path: "/pos",
    name: "pos",
    exact: true,
    component: Pos,
    items: posRoutes,
  },
  {
    path: "/schedule",
    name: "Schedule",
    exact: true,
    component: lazy(() => import("@views/More/Schedule")),
    items:ScheduleRoutes,
  },
  {
    path: "/member",
    name: "Member",
    exact: true,
    component: Members,
  },
  {
    path: "/customer-relations",
    name: "Customer Relations",
    exact: true,
    component: CustomerRelations,
  },
  {
    path: "/request",
    name: "Requests",
    exact: true,
    component: Request,
  },
  {
    path: "/request/:id",
    name: "Request Details",
    exact: true,
    component: lazy(() => import("@views/More/Request/RequestForm")),
  },
  // {
  //   path: "/training",
  //   name: "Training",
  //   exact: true,
  //   component: Training,
  // },
  // {
  //   path: "/schedule",
  //   name: "Schedule",
  //   exact: true,
  //   component: Schedule,
  // },
  // {
  //   path: "/member",
  //   name: "Member",
  //   exact: true,
  //   component: Members,
  // },
  // {
  //   path: "/schedule",
  //   name: "Schedule",
  //   exact: true,
  //   component: Schedule,
  // },
  // {
  //   path: "/member",
  //   name: "Member",
  //   exact: true,
  //   component: Members,
  // },
  // {
  //   path: "/schedule",
  //   name: "Schedule",
  //   exact: true,
  //   component: Schedule,
  // },
  // {
  //   path: "/member",
  //   name: "Member",
  //   exact: true,
  //   component: Members,
  // },
  // {
  //   path: "/schedule",
  //   name: "Schedule",
  //   exact: true,
  //   component: Schedule,
  // },
  // {
  //   path: "/member",
  //   name: "Member",
  //   exact: true,
  //   component: Members,
  // },
];
export default moreRoutes;
