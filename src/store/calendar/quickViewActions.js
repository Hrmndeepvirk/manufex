import api from "@api";
import endPoints from "@endPoints";
import { setQuickViews } from "./calendarSlice";

const getQuickViews = (setLoading) => async (dispatch, getState) => {
  const { calendar } = getState();
  if (!calendar.quickViews.length && setLoading) {
    setLoading(true);
  }
  const res = await api("get", endPoints.CALENDAR.QUICK_VIEW);
  if (res.success) {
    dispatch(setQuickViews(res.data));
  }
  if (setLoading) setLoading(false);
};
const addOrUpdateQuickView =
  (id, data, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);
    let res;
    if (id) {
      res = await api("put", endPoints.CALENDAR.QUICK_VIEW + id, data);
    } else {
      res = await api("post", endPoints.CALENDAR.QUICK_VIEW, data);
    }

    if (res.success) {
      dispatch(getQuickViews());
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const deleteQuickView = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("delete", endPoints.CALENDAR.QUICK_VIEW + id);
  if (res.success) {
    dispatch(getQuickViews());
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};
export { getQuickViews, addOrUpdateQuickView, deleteQuickView };
