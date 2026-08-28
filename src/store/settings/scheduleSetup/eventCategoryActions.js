import api from "@api";
import endPoints from "@endPoints";
import { setEventCategories } from "./scheduleSetupSlice";
import {
  removeScheduleSetupItem,
  syncScheduleSetupItem,
} from "./scheduleSetupSync";

const getEventCategories = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_CATEGORY
  );
  if (res.success) {
    dispatch(setEventCategories(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getEventCategory = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_CATEGORY + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateEventCategory =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_CATEGORY + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_CATEGORY,
        data
      );
    }

    if (res.success) {
      syncScheduleSetupItem(dispatch, "eventCategories", res.data);
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteEventCategory =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_CATEGORY + id,
      {},
      params
    );
    if (res.success) {
      removeScheduleSetupItem(dispatch, "eventCategories", id);
      dispatch(getEventCategories());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export {
  getEventCategories,
  getEventCategory,
  deleteEventCategory,
  addOrUpdateEventCategory,
};
