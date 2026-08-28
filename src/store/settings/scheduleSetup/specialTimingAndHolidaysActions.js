import api from "@api";
import endPoints from "@endPoints";
import { setSpecialTimingsAndHolidays } from "./scheduleSetupSlice";

const getSpecialTimingsAndHolidays = (setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.SCHEDULE_SETUP.SPECIAL_TIMING,
  );
  if (res.success) {
    dispatch(setSpecialTimingsAndHolidays(res.data));
  }
  if (setLoading) setLoading(false);
};

const getSpecialTimingsAndHoliday =
  (id, setLoading, next) => async (dispatch) => {
    setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.SCHEDULE_SETUP.SPECIAL_TIMING + id,
    );
    if (res.success) {
      next(res.data);
    }
    setLoading(false);
  };
const addOrUpdateSpecialTimingsAndHolidays =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.SCHEDULE_SETUP.SPECIAL_TIMING + id,
        data,
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.SCHEDULE_SETUP.SPECIAL_TIMING,
        data,
      );
    }

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const deleteSpecialTimingsAndHoliday = (id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.SCHEDULE_SETUP.SPECIAL_TIMING + id,
  );
  if (res.success) {
    dispatch(getSpecialTimingsAndHolidays());
  }
};

const deleteSpecialSchedule = (id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.SCHEDULE_SETUP.SPECIAL_SCHEDULE_DELETE + id,
  );
  if (res.success) {
    dispatch(getSpecialTimingsAndHolidays());
  }
};

const getSpecialSchedule = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.SCHEDULE_SETUP.GET_SPECIAL_SCHEDULE + id,
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};

const updateSpecialSchedule =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);

    let res = await api(
      "put",
      endPoints.SETTINGS.SCHEDULE_SETUP.SPECIAL_SCHEDULE_UPDATE + id,
      data,
    );

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

export {
  deleteSpecialTimingsAndHoliday,
  addOrUpdateSpecialTimingsAndHolidays,
  getSpecialTimingsAndHoliday,
  getSpecialTimingsAndHolidays,
  deleteSpecialSchedule,
  getSpecialSchedule,
  updateSpecialSchedule,
};
