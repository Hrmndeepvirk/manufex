import api from "@api";
import endPoints from "@endPoints";
import { showToastAction } from "@store/common/commonActions";
import { setClubs, setReasonCodes } from "./businessSlice";

const getClubs = (setLoading) => async (dispatch) => {
  const res = await api("get", endPoints.SETTINGS.BUSINESS.CLUB);
  if (res.success) {
    dispatch(setClubs(res.data));
  } else {
    next(null, res.formErrors);
  }
};

const getClub = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.BUSINESS.CLUB + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const updateClub = (id, data, setLoading, next) => async (dispatch) => {
  setLoading(true);

  let res = await api("put", endPoints.SETTINGS.BUSINESS.CLUB + id, data);

  if (res.success) {
    next(true, null);
    dispatch(getClubs());
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

export { getClubs, getClub, updateClub };
