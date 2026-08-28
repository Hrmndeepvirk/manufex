import { lazy } from "react";
import ManageEmployeeRoutes from "./ManageEmployeeRoutes";

const SecurityRole = lazy(
  () => import("@views/Settings/EmployeeSetup/SecurityRole/SecurityRoleForm"),
);

const EmployeeSetup = lazy(
  () => import("@views/Settings/EmployeeSetup/Employee/EmployeeForm"),
);

const JobTitleForm = lazy(
  () => import("@views/Settings/EmployeeSetup/JobTitle/JobTitleForm"),
);

const DepartmentFormTabView = lazy(
  () =>
    import("../../../../views/Settings/EmployeeSetup/Department/DepartmentFormTabView"),
);

const EmployeeShiftAvailablity = lazy(
  () =>
    import("@views/Settings/EmployeeSetup/Department/EmployeeShiftAvailablity"),
);

const RequestForm = lazy(
  () => import("@views/More/Request/RequestForm"),
);

// const AvailabilityForm = lazy(
//   () => import("@views/Settings/EmployeeSetup/Availability/AvailabilityForm"),
// );

const EmployeeRoutes = [
  {
    name: "Add Security Role",
    component: SecurityRole,
    path: "/security-role/:id?",
    exact: true,
  },
  {
    name: "Add Employee",
    component: EmployeeSetup,
    path: "/employee/:id?",
    exact: true,
    items: ManageEmployeeRoutes,
  },
  {
    name: "Add Job Title",
    component: JobTitleForm,
    path: "/job-title/:id?",
    exact: true,
  },
  {
    name: "Add Department",
    component: DepartmentFormTabView,
    path: "/department/:id?",
    exact: true,
  },

  {
    name: "Add Department",
    component: EmployeeShiftAvailablity,
    path: "/department-availablity/:id?",
    exact: true,
  },

  {
    name: "Request Details",
    component: RequestForm,
    path: "/request/:id",
    exact: true,
  },

  // {
  //   name: "Add Availability",
  //   component: AvailabilityForm,
  //   path: "/availability/:id?",
  //   exact: true,
  // },
];
export default EmployeeRoutes;
