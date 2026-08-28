import api from "@api";
import endPoints from "@endPoints";
import { setAvailability } from "./employeeSetupSlice";

const getAvailabilities = (setLoading) => async (dispatch) => {
  const res = await api("get", endPoints.SETTINGS.EMPLOYEE_SETUP.AVAILABILITY);
  if (res.success) {
    dispatch(setAvailability(res.data));
  } else {
    next(null, res.formErrors);
  }
};

const getAvailability = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.EMPLOYEE_SETUP.AVAILABILITY + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};

const addOrUpdateAvailability =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.AVAILABILITY + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.EMPLOYEE_SETUP.AVAILABILITY,
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

const deleteAvailability = (id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.EMPLOYEE_SETUP.AVAILABILITY + id
  );
  if (res.success) {
    dispatch(getAvailabilities());
  }
};

const getEmployeeClubs = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }

  const res = await api(
    "get",
    endPoints.SETTINGS.EMPLOYEE_SETUP.AVAILABILITY + "get-employee-clubs/" + id
  );

  if (res.success) {
    next(res?.data);
  }
  if (setLoading) {
    setLoading(false);
  }
};

export {
  getAvailabilities,
  getAvailability,
  deleteAvailability,
  addOrUpdateAvailability,
  getEmployeeClubs,
};
