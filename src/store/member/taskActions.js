import api from "@api";
import endPoints from "@endPoints";
import { lastCheckinsAction } from "@store/checkin/checkinActions";

// const getMembers = (setLoading) => async (dispatch) => {
//   const res = await api("get", endPoints.MEMBER.MEMBER);
//   if (res.success) {
//     dispatch(setMembers(res.data));
//   } else {
//     next(null, res.formErrors);
//   }
// };

const addTask = (data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res = await api("post", endPoints.MEMBER.TASK, data);
  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const getTasks = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res = await api("get", endPoints.MEMBER.TASK + id);
  if (res.success) {
    next(res.data, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const editTask = (id, data, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("put", endPoints.MEMBER.TASK + id, data);
  if (res.success) {
    await dispatch(lastCheckinsAction(() => {}));
    if (next) next(true);
  } else {
    if (next) next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

export { addTask, getTasks, editTask };
