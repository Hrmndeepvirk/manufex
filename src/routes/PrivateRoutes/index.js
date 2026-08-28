import { lazy } from "react";

const CheckIn = lazy(() => import("@views/CheckIn"));
const Calendar = lazy(() => import("@views/Calendar"));
const Members = lazy(() => import("@views/Members"));
const PointOfSale = lazy(() => import("@views/PointOfSale"));
const Plans = lazy(() => import("@views/Plans"));
const Reports = lazy(() => import("@views/Reports"));
const More = lazy(() => import("@views/More"));
const Settings = lazy(() => import("@views/Settings"));
const ProfileSettings = lazy(
  () => import("../../components/profile/ProfileSettings"),
);

const Dashboard = lazy(() => import("@views/Dashboard"));
import SettingsRoutes from "./settingsRoutes";
import MembersRoutes from "./membersRoutes";
import CalendarRoutes from "./calendarRoutes";
import PlanRoutes from "./planRoutes";
import moreRoutes from "./moreRoutes";
import PointOfSaleRoutes from "./pointOfSale";
import ReportsRoutes from "./reportsRoutes";

export const PrivateRoutes = [
  {
    name: "Dashboard",
    component: Dashboard,
    path: "/dashboard",
    exact: true,
  },
  {
    name: "Check In",
    component: CheckIn,
    path: "/check-in",
    exact: true,
  },
  {
    name: "Members",
    component: Members,
    path: "/members",
    items: MembersRoutes,
    exact: true,
  },
  {
    name: "Calendar",
    component: Calendar,
    path: "/calendar",
    items: CalendarRoutes,
    exact: true,
  },
  {
    name: "Point of Sale",
    component: PointOfSale,
    path: "/point-of-sale",
    exact: true,
    items: PointOfSaleRoutes,
  },
  {
    name: "Plans",
    component: Plans,
    path: "/plans",
    exact: true,
    items: PlanRoutes,
  },
  {
    name: "Reports",
    component: Reports,
    path: "/reports",
    exact: true,
    items: ReportsRoutes,
  },
  {
    name: "More",
    component: More,
    path: "/more",
    exact: true,
    items: moreRoutes,
  },
  {
    path: "/settings",
    name: "Settings",
    exact: true,
    component: Settings,
    items: SettingsRoutes,
  },

  {
    path: "/profile",
    name: "Profile Settings",
    exact: true,
    component: ProfileSettings,
  },
];
