import api from "@api";
import endPoints from "@endPoints";
import { setCompany } from "./businessSlice";

const getCompany = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.BUSINESS.COMPANY);
  if (res.success) {
    dispatch(setCompany(res.data));
  } else {
  }
  if (setLoading) setLoading(false);
};

const updateCompany = (data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res = await api("put", endPoints.SETTINGS.BUSINESS.COMPANY, data);
  if (res.success) {
    next(true, null);
    dispatch(setCompany(res.data));
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

export { getCompany, updateCompany };
