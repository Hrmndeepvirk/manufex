import api from "@api";
import endPoints from "@endPoints";
import { setClasses } from "./scheduleSetupSlice";
import {
  removeScheduleSetupItem,
  syncScheduleSetupItem,
} from "./scheduleSetupSync";

const getClasses = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.SCHEDULE_SETUP.CLASS);
  if (res.success) {
    dispatch(setClasses(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getClass = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.SCHEDULE_SETUP.CLASS + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateClass = (id, data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res;
  if (id) {
    res = await api("put", endPoints.SETTINGS.SCHEDULE_SETUP.CLASS + id, data);
  } else {
    res = await api("post", endPoints.SETTINGS.SCHEDULE_SETUP.CLASS, data);
  }

  if (res.success) {
    syncScheduleSetupItem(dispatch, "classes", res.data);
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};
const deleteClass = (id) => async (dispatch) => {
  const res = await api("delete", endPoints.SETTINGS.SCHEDULE_SETUP.CLASS + id);
  if (res.success) {
    removeScheduleSetupItem(dispatch, "classes", id);
    dispatch(getClasses());
  }
};

const getEventData = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res = await api(
    "get",
    endPoints.SETTINGS.SCHEDULE_SETUP.CLASS + "getEventDetails/" + id,
  );

  if (res.success) {
    next(true, res.data);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const getEmployeePays = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res = await api(
    "get",
    endPoints.SETTINGS.SCHEDULE_SETUP.CLASS + "get-employee-pays/" + id,
  );

  if (res.success) {
    next(true, res.data);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const createClassEvents =
  (type, setLoading, data, next) => async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }

    const res = await api(
      "post",
      endPoints.SETTINGS.SCHEDULE_SETUP.CREATE_CLASS_EVENTS + "?type=" + type,
      data,
    );

    if (res?.success) {
      next(true, res?.data);
    } else {
      next(null, formErrors);
    }

    if (setLoading) {
      setLoading(false);
    }
  };

const editClassEvents = (id, setLoading, data, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }

  const res = await api(
    "put",
    endPoints.SETTINGS.SCHEDULE_SETUP.EDIT_CLASS_EVENTS + id,
    data,
  );

  if (res?.success) {
    next(true, null);
  } else {
    next(null, formErrors);
  }
  if (setLoading) {
    setLoading(false);
  }
};

const deleteClassAndEvents = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);

  const res = await api(
    "put",
    endPoints.SETTINGS.SCHEDULE_SETUP.DELETE_CLASS_EVENTS + id,
  );

  if (res?.success) {
    removeScheduleSetupItem(dispatch, "classes", id);
    dispatch(getClasses());
  }

  setLoading(false);
};
export {
  getClass,
  getClasses,
  addOrUpdateClass,
  deleteClass,
  getEventData,
  getEmployeePays,
  deleteClassAndEvents,
  createClassEvents,
  editClassEvents,
};
