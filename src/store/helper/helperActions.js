import api from "@api";
import endPoints from "@endPoints";
import { setFilteredEmployees } from "./helperSlice";

const getFilteredEmployees =
  (queryParams, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);

    const queryString = new URLSearchParams(queryParams || {}).toString();
    const url =
      endPoints.HELPER.FILTER_EMPLOYEE + (queryString ? `?${queryString}` : "");

    const res = await api("get", url);
    if (res?.success && Array.isArray(res.data)) {
      dispatch(setFilteredEmployees(res.data));
      if (next) next(res.data);
    }

    if (setLoading) setLoading(false);
  };

export { getFilteredEmployees };
