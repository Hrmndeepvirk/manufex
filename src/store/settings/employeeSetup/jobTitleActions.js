import api from "@api";
import endPoints from "@endPoints";
import { setJobTitles } from "./employeeSetupSlice";

const getJobTitles = (setLoading) => async (dispatch) => {
  const res = await api("get", endPoints.SETTINGS.EMPLOYEE_SETUP.JOB_TITLE);
  if (res.success) {
    dispatch(setJobTitles(res.data));
  } else {
    next(null, res.formErrors);
  }
};
const getJobTitle = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.EMPLOYEE_SETUP.JOB_TITLE + id,
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateJobTitle =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.JOB_TITLE + id,
        data,
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.EMPLOYEE_SETUP.JOB_TITLE,
        data,
      );
    }

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteJobTitle =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.EMPLOYEE_SETUP.JOB_TITLE + id,
      {},
      params,
    );
    if (res.success) {
      dispatch(getJobTitles());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export { getJobTitles, deleteJobTitle, addOrUpdateJobTitle, getJobTitle };
