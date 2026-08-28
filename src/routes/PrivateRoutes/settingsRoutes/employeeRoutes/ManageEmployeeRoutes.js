import { lazy } from "react";

const CertificationsForm = lazy(() =>
  import(
    "@views/Settings/EmployeeSetup/Employee/EmployeeForm/Certifications/CertificationsForm"
  )
);

const EmployeeDepartmentForm = lazy(() =>
  import(
    "@views/Settings/EmployeeSetup/Employee/EmployeeForm/EmployeeDepartment/EmployeeDepartmentForm"
  )
);

const ManageEmployeeRoutes = [
  {
    component: CertificationsForm,
    path: "/certifications/:certificateId?",
    exact: true,
  },
  {
    component: EmployeeDepartmentForm,
    path: "/departments/:departmentId?",
    exact: true,
  },
];
export default ManageEmployeeRoutes;
