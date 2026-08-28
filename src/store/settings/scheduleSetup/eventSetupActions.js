import api from "@api";
import endPoints from "@endPoints";
import { setEventSetups } from "./scheduleSetupSlice";
import {
  removeScheduleSetupItem,
  syncScheduleSetupItem,
} from "./scheduleSetupSync";

const getEventSetups = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_SETUP);
  if (res.success) {
    dispatch(setEventSetups(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getEventSetup = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_SETUP + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateEventSetup =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_SETUP + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_SETUP,
        data
      );
    }

    if (res.success) {
      syncScheduleSetupItem(dispatch, "eventSetups", res.data);
      next(true, res.data);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const copyEvent = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res = await api(
    "post",
    endPoints.SETTINGS.SCHEDULE_SETUP.COPY_EVENT + id,
    {}
  );

  if (res.success) {
    syncScheduleSetupItem(dispatch, "eventSetups", res.data);
    next(true, res.data);
    dispatch(getEventSetups(setLoading));
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const deleteEventSetup = (id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_SETUP + id
  );
  if (res.success) {
    removeScheduleSetupItem(dispatch, "eventSetups", id);
    dispatch(getEventSetups());
  }
};

export {
  getEventSetups,
  deleteEventSetup,
  getEventSetup,
  addOrUpdateEventSetup,
  copyEvent,
};
