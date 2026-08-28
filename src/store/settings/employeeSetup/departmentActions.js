import api from "@api";
import endPoints from "@endPoints";
import { setDepartments } from "./employeeSetupSlice";

const getDepartments = (setLoading) => async (dispatch) => {
  const res = await api("get", endPoints.SETTINGS.EMPLOYEE_SETUP.DEPARTMENT);
  if (res.success) {
    dispatch(setDepartments(res.data));
  } else {
    next(null, res.formErrors);
  }
};
const getDepartment = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.EMPLOYEE_SETUP.DEPARTMENT + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateDepartment =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.DEPARTMENT + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.EMPLOYEE_SETUP.DEPARTMENT,
        data
      );
    }

    if (res.success) {
      next(true, res.data);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteDepartment =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.EMPLOYEE_SETUP.DEPARTMENT + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getDepartments());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export {
  getDepartments,
  addOrUpdateDepartment,
  getDepartment,
  deleteDepartment,
};
