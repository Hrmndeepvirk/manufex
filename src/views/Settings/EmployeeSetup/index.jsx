import CustomTabView from "@shared/tabView/CustomTabView";
import JobTitle from "./JobTitle";
import SecurityRole from "./SecurityRole";
import Department from "./Department";
import Employee from "./Employee";
import TimeSheets from "./Timesheets";
// import Availability from "./Availability";

export default function EmployeeSetup() {
  const tabs = [
    { title: "Manage Employee", content: <Employee /> },
    // { title: "Availability", content: <Availability /> },
    { title: "Timesheets", content: <TimeSheets /> },
    { title: "Job Title", content: <JobTitle /> },
    { title: "Departments", content: <Department /> },
    { title: "Security Roles", content: <SecurityRole /> },
    { title: "Report Security", content: <>Report Security Content</> },
  ];
  return <CustomTabView tabs={tabs} />;
}
