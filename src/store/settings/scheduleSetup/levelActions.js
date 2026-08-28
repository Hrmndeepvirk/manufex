import api from "@api";
import endPoints from "@endPoints";
import { setLevels } from "./scheduleSetupSlice";
import {
  removeScheduleSetupItem,
  syncScheduleSetupItem,
} from "./scheduleSetupSync";

const getLevels = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.SCHEDULE_SETUP.LEVEL);
  if (res.success) {
    dispatch(setLevels(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getLevel = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.SCHEDULE_SETUP.LEVEL + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateLevel = (id, data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res;
  if (id) {
    res = await api("put", endPoints.SETTINGS.SCHEDULE_SETUP.LEVEL + id, data);
  } else {
    res = await api("post", endPoints.SETTINGS.SCHEDULE_SETUP.LEVEL, data);
  }

  if (res.success) {
    syncScheduleSetupItem(dispatch, "levels", res.data);
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};
const deleteLevel =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.SCHEDULE_SETUP.LEVEL + id,
      {},
      params
    );
    if (res.success) {
      removeScheduleSetupItem(dispatch, "levels", id);
      dispatch(getLevels());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export { getLevels, deleteLevel, addOrUpdateLevel, getLevel };
