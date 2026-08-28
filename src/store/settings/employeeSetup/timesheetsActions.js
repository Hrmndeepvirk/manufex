import api from "@api";
import endPoints from "@endPoints";
import { setTimesheets } from "./employeeSetupSlice";

const getTimeSheets = (setLoading, params) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.EMPLOYEE_SETUP.TIMESHEET,
    null,
    params,
  );
  if (res.success) {
    dispatch(setTimesheets(res.data));
  }
  if (setLoading) setLoading(false);
};
const getTimeSheet = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.EMPLOYEE_SETUP.TIMESHEET + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateTimeSheet =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.TIMESHEET + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.EMPLOYEE_SETUP.TIMESHEET,
        data
      );
    }

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const editTimeSheet = (id, data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "put",
    endPoints.SETTINGS.EMPLOYEE_SETUP.EDIT_TIMESHEET + id,
    data,
  );
  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};
const deleteTimeSheet = (id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.EMPLOYEE_SETUP.TIMESHEET + id
  );
  if (res.success) {
    dispatch(getTimeSheets());
  }
};

export { getTimeSheet, getTimeSheets, addOrUpdateTimeSheet, editTimeSheet, deleteTimeSheet };
