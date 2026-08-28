import api from "@api";
import endPoints from "@endPoints";

const getResorces = (query, setLoading, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }
  const res = await api("get", endPoints.CHECK_IN.RESOURCES, {}, query);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const postReserve = (data,query, setLoading, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }
  const res = await api(
    "post",
    `${endPoints.CHECK_IN.RESOURCES}${query}`,
    data,
  );
  if (res.success) {
    next && next(res.data);
  }
  setLoading(false);
};

const postReturn = (data,query, setLoading, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }
  const res = await api(
    "post",
    `${endPoints.CHECK_IN.RETURN_RESOURCES}${query}`,
    data,
  );
  if (res.success) {
   next && next(res.data);
  }
  setLoading(false);
};

export { getResorces, postReserve, postReturn };
