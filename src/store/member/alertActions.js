import api from "@api";
import endPoints from "@endPoints";

// const getMembers = (setLoading) => async (dispatch) => {
//   const res = await api("get", endPoints.MEMBER.MEMBER);
//   if (res.success) {
//     dispatch(setMembers(res.data));
//   } else {
//     next(null, res.formErrors);
//   }
// };

const addAlert = (data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res = await api("post", endPoints.MEMBER.ALERT, data);
  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const getAlert = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res = await api("get", endPoints.MEMBER.ALERT + id);
  if (res.success) {
    next(res.data, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const editAlert = (id, data, setLoading, next) => async () => {
  if (setLoading) setLoading(true);
  const res = await api("put", endPoints.MEMBER.ALERT + id, data);
  if (res.success) {
    if (next) next(true);
  } else {
    if (next) next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

export { addAlert, getAlert, editAlert };
