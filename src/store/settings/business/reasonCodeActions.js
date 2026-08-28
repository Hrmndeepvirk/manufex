import api from "@api";
import endPoints from "@endPoints";
import { showToastAction } from "@store/common/commonActions";
import { setReasonCodes } from "./businessSlice";

const getReasonCodes = () => async (dispatch) => {
  const res = await api("get", endPoints.SETTINGS.BUSINESS.REASON_CODE);
  if (res.success) {
    dispatch(setReasonCodes(res.data));
  }
};
const getReasonCode = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.BUSINESS.REASON_CODE + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateReasonCode =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.BUSINESS.REASON_CODE + id,
        data
      );
    } else {
      res = await api("post", endPoints.SETTINGS.BUSINESS.REASON_CODE, data);
    }

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteReasonCode = (id) => async (dispatch) => {
  const res = await api("delete", endPoints.SETTINGS.BUSINESS.REASON_CODE + id);
  if (res.success) {
    dispatch(getReasonCodes());
  }
};

export {
  getReasonCodes,
  getReasonCode,
  addOrUpdateReasonCode,
  deleteReasonCode,
};
