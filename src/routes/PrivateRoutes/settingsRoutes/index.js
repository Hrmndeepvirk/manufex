import { lazy } from "react";

import BusinessRoutes from "./businessRoutes";
import EmployeeRoutes from "./employeeRoutes";
import ScheduleRoutes from "./scheduleRoutes";
import PointOfSaleRoutes from "./pointOfSaleRoutes";
import InventoryRoutes from "./inventoryRoutes";
import MemberRoutes from "./memberRoutes";
import AgreementRoutes from "./agreementRoutes";
import RewardsRoutes from "./rewardsRoutes";

const SettingsRoutes = [
  {
    path: "/business-setup",
    name: "Business Setup",
    exact: true,
    component: lazy(() => import("@views/Settings/BusinessSetup")),
    items: BusinessRoutes,
  },
  {
    path: "/employee-setup",
    name: "Employee Setup",
    exact: true,
    component: lazy(() => import("@views/Settings/EmployeeSetup")),
    items: EmployeeRoutes,
  },
  {
    path: "/schedule-setup",
    name: "Schedule Setup",
    exact: true,
    component: lazy(() => import("@views/Settings/ScheduleSetup")),
    items: ScheduleRoutes,
  },
  {
    path: "/point-of-sale",
    name: "Point of Sale",
    exact: true,
    component: lazy(() => import("@views/Settings/PointOfSale")),
    items: PointOfSaleRoutes,
  },
  {
    path: "/inventory-setup",
    name: "Inventory Setup",
    exact: true,
    component: lazy(() => import("@views/Settings/InventorySetup")),
    items: InventoryRoutes,
  },
  {
    path: "/member-setup",
    name: "Member Setup",
    exact: true,
    component: lazy(() => import("@views/Settings/MemberSetup")),
    items: MemberRoutes,
  },
  {
    path: "/agreement-setup",
    name: "Agreement Setup",
    exact: true,
    component: lazy(() => import("@views/Settings/AgreementSetup")),
    items: AgreementRoutes,
  },
  {
    path: "/rewards-setup",
    name: "Rewards Setup",
    exact: true,
    component: lazy(() => import("@views/Settings/RewardsSetup")),
    items: RewardsRoutes,
  },
];
export default SettingsRoutes;
