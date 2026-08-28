import api from "@api";
import endPoints from "@endPoints";
import { setEventSetupServices } from "./scheduleSetupSlice";

const getEventSetupServices = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_SETUP_SERVICE + id
  );
  if (res.success) {
    // dispatch(setEventSetupServices(res.data));

    next(res?.data);
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getEventSetupService = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_SETUP_SERVICE + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateEventSetupService =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_SETUP_SERVICE + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_SETUP_SERVICE,
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
const deleteEventSetupService = (id, next) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_SETUP_SERVICE + id
  );
  if (res.success) {
    // dispatch(getEventSetupServices(eventId));
    next(true);
  }
};

const removeService =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading?.(true);

    const res = await api(
      "patch",
      endPoints.SETTINGS.SCHEDULE_SETUP.EVENT_SETUP_SERVICE +
        "remove-service/" +
        id,
      data
    );

    if (res.success) {
      // await dispatch(getEventSetupServices(eventId));
      // next();
      next(true);
    } else {
      next(false, res?.formErrors);
    }

    setLoading?.(false);
  };

export {
  getEventSetupService,
  getEventSetupServices,
  deleteEventSetupService,
  addOrUpdateEventSetupService,
  removeService,
};
