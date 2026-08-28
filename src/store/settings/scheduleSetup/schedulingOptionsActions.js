import api from "@api";
import endPoints from "@endPoints";
import { setSchedulingOption } from "./scheduleSetupSlice";
import { showToastAction } from "../../common/commonActions";

const getSchedulingOptions = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.SCHEDULE_SETUP.SCHEDULING_OPTION,
  );
  if (res.success) {
    dispatch(setSchedulingOption(res.data));
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
};

const getSchedulingOption = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.SCHEDULE_SETUP.SCHEDULING_OPTION + id,
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateScheduleOption =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.SCHEDULE_SETUP.SCHEDULING_OPTION + id,
        data,
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.SCHEDULE_SETUP.SCHEDULING_OPTION,
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
const deleteScheduleOption = (id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.SCHEDULE_SETUP.SCHEDULING_OPTION + id,
  );
  if (res.success) {
    dispatch(getSchedulingOptions());
  }
};

export {
  getSchedulingOption,
  getSchedulingOptions,
  addOrUpdateScheduleOption,
  deleteScheduleOption,
};
