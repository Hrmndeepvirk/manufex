export const EMPLOYEE_SETUP = {
  EMPLOYEE: "/settings/employee-setup/employee/",
  GET_EMPLOYEE_ACCESS_CODE: "/settings/employee-setup/employee/access-code/",
  JOB_TITLE: "/settings/employee-setup/job-title/",
  AVAILABILITY: "/settings/employee-setup/availability/",
  TIMESHEET: "/settings/employee-setup/timesheet/",
  EDIT_TIMESHEET: "/check-in/edit-timesheet/",
  DEPARTMENT: "/settings/employee-setup/department/",
  DEPARTMENT_SHIFT: "/settings/employee-setup/department-shift/",
  DEPARTMENT_EMPLOYEE_SHIFT:
    "/settings/employee-setup/department-employee-shift/",
  SHIFT_COVER_REQUEST: "/settings/employee-setup/shift-cover-request",
  SECURITY_ROLE: "/settings/employee-setup/security-role/",
  UPDATE_SALES_CODE: "/settings/employee-setup/employee/sales-code/",
  UPDATE_CLASS_LEVELS: "/settings/employee-setup/employee/update-class-levels/",
  UPDATE_APPOINTMENT_LEVELS:
    "/settings/employee-setup/employee/update-appointment-levels/",
  GET_EMPLOYEE_TIMESHEETS:
    "/settings/employee-setup/employee/get-employee-timesheets/",
  MANAGE_EMPLOYEE: {
    NOTES: (employeeId) =>
      `/settings/employee-setup/employee/${employeeId}/notes/`,
    CERTIFICATION: (employeeId) =>
      `/settings/employee-setup/employee/${employeeId}/certification/`,
    EMPLOYEE_DEPARTMENT: (employeeId) =>
      `/settings/employee-setup/employee/${employeeId}/department/`,
    CLASS_SETUP: (employeeId) =>
      `/settings/employee-setup/employee/${employeeId}/class-setup/`,
    SUBSTITUTE_OPTIONS: (employeeId) =>
      `/settings/employee-setup/employee/${employeeId}/substitute-option/`,
    APPOINTMENT_PAY: (employeeId) =>
      `/settings/employee-setup/employee/${employeeId}/appointment-pay/`,
    APPOINTMENT_BONUS: (employeeId) =>
      `/settings/employee-setup/employee/${employeeId}/appointment-bonus/`,
    SALES_BONUS: (employeeId) =>
      `/settings/employee-setup/employee/${employeeId}/sales-bonus/`,
    ITEM_COMMISSION: (employeeId) =>
      `/settings/employee-setup/employee/${employeeId}/item-commission/`,
  },
};
