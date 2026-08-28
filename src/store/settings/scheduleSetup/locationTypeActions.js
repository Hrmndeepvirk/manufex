import api from "@api";
import endPoints from "@endPoints";
import { setLocationTypes } from "./scheduleSetupSlice";
import {
  removeScheduleSetupItem,
  syncScheduleSetupItem,
} from "./scheduleSetupSync";

const getLocationTypes = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.SCHEDULE_SETUP.LOCATION_TYPE);
  if (res.success) {
    dispatch(setLocationTypes(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getLocationType = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.SCHEDULE_SETUP.LOCATION_TYPE + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateLocationType =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.SCHEDULE_SETUP.LOCATION_TYPE + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.SCHEDULE_SETUP.LOCATION_TYPE,
        data
      );
    }

    if (res.success) {
      syncScheduleSetupItem(dispatch, "locationTypes", res.data);
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteLocationType =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.SCHEDULE_SETUP.LOCATION_TYPE + id,
      {},
      params
    );
    if (res.success) {
      removeScheduleSetupItem(dispatch, "locationTypes", id);
      dispatch(getLocationTypes());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export {
  getLocationTypes,
  getLocationType,
  deleteLocationType,
  addOrUpdateLocationType,
};
