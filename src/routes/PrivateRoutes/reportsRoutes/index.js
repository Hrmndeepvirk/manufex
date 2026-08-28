import { lazy } from "react";

const ReportForm = lazy(() =>
  import("@views/Reports/ManageReports/ReportForm")
);

const RunReport = lazy(() =>
  import("@views/Reports/RunReport")
);

const ReportsRoutes = [
  {
    name: "Add Report",
    component: ReportForm,
    path: "/report/:id?",
    exact: true,
  },
  {
    name: "Run Report",
    component: RunReport,
    path: "/run-report/:id",
    exact: true,
  },
];

export default ReportsRoutes;
