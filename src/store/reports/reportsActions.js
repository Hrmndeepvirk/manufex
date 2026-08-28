import api from "@api";
import endPoints from "@endPoints";
import { setReports, updateReport } from "./reportsSlice";

const getReports = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.REPORTS.SETUP);
  if (res.success) {
    dispatch(setReports(res.data));
  }
  if (setLoading) setLoading(false);
};

const getReport = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.REPORTS.SETUP + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};

const addOrUpdateReport = (id, data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res;
  if (id) {
    res = await api("put", endPoints.REPORTS.SETUP + id, data);
  } else {
    res = await api("post", endPoints.REPORTS.SETUP, data);
  }
  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const deleteReport = (id) => async (dispatch) => {
  const res = await api("delete", endPoints.REPORTS.SETUP + id);
  if (res.success) {
    dispatch(getReports());
  }
};

const toggleFavouriteReport = (id, isFavourite) => async (dispatch) => {
  const res = await api("put", endPoints.REPORTS.SETUP + id, { isFavourite });
  if (res.success) {
    dispatch(updateReport(res.data));
  }
};

export { getReports, getReport, addOrUpdateReport, deleteReport, toggleFavouriteReport };
