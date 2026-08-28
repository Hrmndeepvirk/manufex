import api from "@api";
import endPoints from "@endPoints";
import {
  setMembersList,
  setScheduleSettings,
  setDepartments,
  setLocationTypes,
  setResourceTypes,
} from "./calendarSlice";

const getScheduleSettings = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.CALENDAR.SCHEDULE_SETTINGS);
  if (res.success) {
    dispatch(setScheduleSettings(res.data));
  }
  if (setLoading) setLoading(false);
};

const getMembersList = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.CALENDAR.MEMBERS_LIST);
  if (res.success) {
    dispatch(setMembersList(res.data));
  }
  if (setLoading) setLoading(false);
};

const getEvent = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.CALENDAR.EVENT_SETUP + id);
  if (res.success) {
    next(res.data, null);
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};
const onScheduleSettingsUpdate = (data) => async (dispatch) => {
  dispatch(setScheduleSettings(data));
};

const getDepartmentsList = (setLoading) => async (dispatch, getState) => {
  const { calendar } = getState();
  if (!calendar.departments.length && setLoading) {
    setLoading(true);
  }
  const res = await api("get", endPoints.CALENDAR.DEPARTMENTS_LIST);
  if (res.success) {
    dispatch(setDepartments(res.data));
  }
  if (setLoading) setLoading(false);
};
const getLocationTypesList = (setLoading) => async (dispatch, getState) => {
  const { calendar } = getState();
  if (!calendar.locationTypes.length && setLoading) {
    setLoading(true);
  }
  const res = await api("get", endPoints.CALENDAR.LOCATION_TYPES_LIST);
  if (res.success) {
    dispatch(setLocationTypes(res.data));
  }
  if (setLoading) setLoading(false);
};

const getResourceTypesList = (setLoading) => async (dispatch, getState) => {
  const { calendar } = getState();
  if (!calendar.resourceTypes.length && setLoading) {
    setLoading(true);
  }
  const res = await api("get", endPoints.CALENDAR.RESOURCE_TYPES_LIST);
  if (res.success) {
    dispatch(setResourceTypes(res.data));
  }
  if (setLoading) setLoading(false);
};

const getEmployeeDaySummary =
  (employeeId, date, setLoading, next, eventId) => async () => {
    if (setLoading) setLoading(true);
    const query = eventId ? { eventId } : {};
    const res = await api(
      "get",
      endPoints.CALENDAR.EMPLOYEE_DAY_SUMMARY + employeeId + "/" + date,
      {},
      query,
    );
    if (res.success) {
      next(res.data, null);
    } else {
      next(null, res.formErrors);
    }
    if (setLoading) setLoading(false);
  };

const getLocationDayEvents =
  (locationId, date, setLoading, next, eventId) => async () => {
    if (setLoading) setLoading(true);
    const query = { date };
    if (eventId) query.eventId = eventId;
    const res = await api(
      "get",
      endPoints.CALENDAR.LOCATION_DAY_EVENTS + locationId,
      {},
      query,
    );
    if (res.success) {
      next(res.data, null);
    } else {
      next(null, res.formErrors);
    }
    if (setLoading) setLoading(false);
  };

export {
  getScheduleSettings,
  onScheduleSettingsUpdate,
  getMembersList,
  getEvent,
  getDepartmentsList,
  getLocationTypesList,
  getResourceTypesList,
  getEmployeeDaySummary,
  getLocationDayEvents,
};
