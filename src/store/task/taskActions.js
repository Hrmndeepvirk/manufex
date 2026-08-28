import api from "@api";
import endPoints from "@endPoints";
import { setEmployeeTasks } from "./taskSlice";

const getEmployeeTasks =
  (setLoading, includeCompleted = false) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const params = includeCompleted ? { includeCompleted: "true" } : {};
    const res = await api("get", endPoints.EMPLOYEE_TASK, {}, params);
    if (res.success) {
      dispatch(setEmployeeTasks(res.data));
    }
    if (setLoading) setLoading(false);
  };

const updateEmployeeTask =
  (id, data, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api("put", endPoints.EMPLOYEE_TASK + id, data);
    if (res.success) {
      if (next) next(true, null);
    } else {
      if (next) next(null, res.formErrors);
    }
    if (setLoading) setLoading(false);
  };

const deleteEmployeeTask = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("delete", endPoints.EMPLOYEE_TASK + id);
  if (res.success) {
    if (next) next(true, null);
  } else {
    if (next) next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

export { getEmployeeTasks, updateEmployeeTask, deleteEmployeeTask };
