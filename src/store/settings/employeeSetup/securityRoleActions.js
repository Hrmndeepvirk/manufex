import api from "@api";
import endPoints from "@endPoints";
import { showToastAction } from "@store/common/commonActions";
import { setSecurityRoles } from "./employeeSetupSlice";

const getSecurityRoles = (setLoading) => async (dispatch) => {
  const res = await api("get", endPoints.SETTINGS.EMPLOYEE_SETUP.SECURITY_ROLE);
  if (res.success) {
    dispatch(setSecurityRoles(res.data));
  } else {
    next(null, res.formErrors);
  }
};

const getSecurityRole = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.EMPLOYEE_SETUP.SECURITY_ROLE + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateSecurityRole =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.SECURITY_ROLE + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.EMPLOYEE_SETUP.SECURITY_ROLE,
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
const deleteSecurityRole =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.EMPLOYEE_SETUP.SECURITY_ROLE + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getSecurityRoles());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export {
  getSecurityRoles,
  getSecurityRole,
  addOrUpdateSecurityRole,
  deleteSecurityRole,
};
