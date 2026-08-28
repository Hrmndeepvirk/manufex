import api from "@api";
import endPoints from "@endPoints";
import { setQueuedReports } from "./queuedReportsSlice";

const getQueuedReports = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.REPORTS.QUEUED);
  if (res.success) {
    dispatch(setQueuedReports(res.data));
  }
  if (setLoading) setLoading(false);
};

const createQueuedReport = (data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("post", endPoints.REPORTS.QUEUED, data);
  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const deleteQueuedReport = (id) => async (dispatch) => {
  const res = await api("delete", endPoints.REPORTS.QUEUED + id);
  if (res.success) {
    dispatch(getQueuedReports());
  }
};

const runReport = (data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("post", endPoints.REPORTS.RUN, data);
  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

export { getQueuedReports, createQueuedReport, deleteQueuedReport, runReport };
