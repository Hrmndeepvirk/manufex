import { AUTH } from "./auth";
import { CHECK_IN } from "./checkin";
import { MEMBER } from "./member";
import { CALENDAR } from "./calendar";
import { SETTINGS } from "./settings";
import { POS } from "./pointOfSale";
import { PLAN } from "./plan";
import { MORE } from "./more";
import { HELPER } from "./helper";
import { VISITOR } from "./visitor";
import { REPORTS } from "./reports";
const endPoints = {
  TIMESTAMP: "/timestamp",
  ACCESS: "/access/",
  COMPANY: "/company/",
  COMPANY_BY_SUBDOMAIN: "/company/by-subdomain",
  UPLOAD_FILE: "/upload/file",
  UPLOAD_FILES: "/upload/files",
  DROPDOWN: { ALL: "/dropdown/" },
  EMPLOYEE_TASK: "/employee-tasks/",
  REQUEST: "/request/",
  AUTH,
  CHECK_IN,
  MEMBER,
  CALENDAR,
  SETTINGS,
  MORE,
  POS,
  PLAN,
  HELPER,
  VISITOR,
  DASHBOARD: "/dashboard",
  REPORTS,
};
export default endPoints;
