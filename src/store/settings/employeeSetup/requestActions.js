import api from "@api";
import endPoints from "@endPoints";
import { setRequests } from "./employeeSetupSlice";

const getRequests = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.REQUEST);
  if (res.success) {
    dispatch(setRequests(res.data));
  }
  if (setLoading) setLoading(false);
};

const getRequest = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.REQUEST + id);
  if (res.success) {
    next(res.data);
  }
  if (setLoading) setLoading(false);
};

const createRequest = (data, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("post", endPoints.REQUEST + "create", data);
  if (res.success) {
    next(true, res.data);
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const approveRequest = (id, changedData, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("put", endPoints.REQUEST + "approve/" + id, { changedData });
  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const rejectRequest = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("put", endPoints.REQUEST + "reject/" + id);
  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

export {
  getRequests,
  getRequest,
  createRequest,
  approveRequest,
  rejectRequest,
};
