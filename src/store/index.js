import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import commonSlice from "./common/commonSlice";
import checkinSlice from "./checkin/checkinSlice";
import dropdownSlice from "./dropdown/dropdownSlice";
import settingsSlice from "./settings";
import memberSlice from "./member/memberSlice";
import companySlice from "./company/companySlice";
import calendarSlice from "./calendar/calendarSlice";
import pointOfSaleSlice from "./pointOfSale/pointOfSaleSlice";
import planSlice from "./plan/planSlice";
import scheduleSLice from "./more/schedule/scheduleSlice";
import dashboardSlice from "./dashboard/dashboardSlice";
import helperSlice from "./helper/helperSlice";
import taskSlice from "./task/taskSlice";
import visitorRegisterationSlice from "./visitorRegisteration/visitorRegisterationSlice";
import reportsSlice from "./reports/reportsSlice";
import queuedReportsSlice from "./reports/queuedReportsSlice";
import shiftCoverRequestSlice from "./settings/employeeSetup/shiftCoverRequestSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    company: companySlice,
    common: commonSlice,
    checkin: checkinSlice,
    member: memberSlice,
    dropdown: dropdownSlice,
    settings: settingsSlice,
    calendar: calendarSlice,
    pos: pointOfSaleSlice,
    plans: planSlice,
    schedule: scheduleSLice,
    dashboard: dashboardSlice,
    helper: helperSlice,
    task: taskSlice,
    visitorRegisteration: visitorRegisterationSlice,
    reports: reportsSlice,
    queuedReports: queuedReportsSlice,
    shiftCoverRequest: shiftCoverRequestSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export { store };
