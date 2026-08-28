import api from "@api";
import endPoints from "@endPoints";
import {
  setShiftCoverRequests,
  upsertShiftCoverRequest,
} from "./shiftCoverRequestSlice";
import { showToastAction } from "../../common/commonActions";

const BASE = endPoints.SETTINGS.EMPLOYEE_SETUP.SHIFT_COVER_REQUEST;

const getShiftCoverRequests =
  (params, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api("get", BASE, null, params || {});
    if (res.success) {
      dispatch(
        setShiftCoverRequests({ data: res.data || [], meta: res.meta || null }),
      );
      if (next) next(res.data || [], res.meta || null);
    }
    if (setLoading) setLoading(false);
  };

const createShiftCoverRequest = (data, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("post", BASE, data);
  if (res.success) {
    dispatch(upsertShiftCoverRequest(res.data));
    dispatch(
      showToastAction({
        description: res.message || "Cover request created.",
        type: "success",
      }),
    );
    if (next) next(res.data, null);
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
    if (next) next(null, res.formErrors || null);
  }
  if (setLoading) setLoading(false);
};

const acceptShiftCoverRequest = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("put", `${BASE}/${id}/accept`);
  if (res.success) {
    dispatch(upsertShiftCoverRequest(res.data));
    dispatch(
      showToastAction({
        description: res.message || "Cover accepted.",
        type: "success",
      }),
    );
    if (next) next(res.data, null);
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
    if (next) next(null, res.message || null);
  }
  if (setLoading) setLoading(false);
};

const cancelShiftCoverRequest = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("put", `${BASE}/${id}/cancel`);
  if (res.success) {
    dispatch(upsertShiftCoverRequest(res.data));
    dispatch(
      showToastAction({
        description: res.message || "Cover request cancelled.",
        type: "success",
      }),
    );
    if (next) next(res.data, null);
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
    if (next) next(null, res.message || null);
  }
  if (setLoading) setLoading(false);
};

export {
  getShiftCoverRequests,
  createShiftCoverRequest,
  acceptShiftCoverRequest,
  cancelShiftCoverRequest,
};
