import api from "@api";
import endPoints from "@endPoints";
import { setLocations } from "./scheduleSetupSlice";
import {
  removeScheduleSetupItem,
  syncScheduleSetupItem,
} from "./scheduleSetupSync";

const getLocations = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.SCHEDULE_SETUP.LOCATION);
  if (res.success) {
    dispatch(setLocations(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getLocation = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.SCHEDULE_SETUP.LOCATION + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateLocation =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.SCHEDULE_SETUP.LOCATION + id,
        data
      );
    } else {
      res = await api("post", endPoints.SETTINGS.SCHEDULE_SETUP.LOCATION, data);
    }

    if (res.success) {
      syncScheduleSetupItem(dispatch, "locations", res.data);
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteLocation =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.SCHEDULE_SETUP.LOCATION + id,
      {},
      params
    );
    if (res.success) {
      removeScheduleSetupItem(dispatch, "locations", id);
      dispatch(getLocations());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export { getLocation, getLocations, addOrUpdateLocation, deleteLocation };
