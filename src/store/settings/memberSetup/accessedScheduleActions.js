import api from "@api";
import endPoints from "@endPoints";
import { setAccessSchedules } from "./memberSetupSlice";

const getAccessedSchedules = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.MEMBER_SETUP.ACCESSED_SCHEDULE
  );
  if (res.success) {
    dispatch(setAccessSchedules(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getAccessedSchedule = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.MEMBER_SETUP.ACCESSED_SCHEDULE + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateAccessedSchedule =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.MEMBER_SETUP.ACCESSED_SCHEDULE + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.MEMBER_SETUP.ACCESSED_SCHEDULE,
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
const deleteAccessedSchedule =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.MEMBER_SETUP.ACCESSED_SCHEDULE + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getAccessedSchedules());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export {
  getAccessedSchedules,
  deleteAccessedSchedule,
  addOrUpdateAccessedSchedule,
  getAccessedSchedule,
};
