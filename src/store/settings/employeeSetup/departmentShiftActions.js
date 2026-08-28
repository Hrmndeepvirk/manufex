import api from "@api";
import endPoints from "@endPoints";

const getDepartmentShifts = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.EMPLOYEE_SETUP.DEPARTMENT_SHIFT + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateDepartmentShift =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.DEPARTMENT_SHIFT + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.EMPLOYEE_SETUP.DEPARTMENT_SHIFT,
        data
      );
    }

    if (res.success) {
      next(res.data, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteDepartmentShift = (id, next) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.EMPLOYEE_SETUP.DEPARTMENT_SHIFT + id
  );
  if (res.success) {
    next(res.data);
  }
};

const copyDepartmentShifts =
  (departmentId, data, setLoading, next) => async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }
    const res = await api(
      "post",
      endPoints.SETTINGS.EMPLOYEE_SETUP.DEPARTMENT_SHIFT +
        "copy-week/" +
        departmentId,
      data
    );
    if (res.success) {
      if (res.data) {
        next(res.data);
      }
    }
    if (setLoading) {
      setLoading(false);
    }
  };
const copyDepartmentShiftsAssignment =
  (departmentId, data, setLoading, next) => async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }
    const res = await api(
      "post",
      endPoints.SETTINGS.EMPLOYEE_SETUP.DEPARTMENT_SHIFT +
        "copy-week-assignment/" +
        departmentId,
      data
    );
    if (res.success) {
      if (res.data) {
        next(res.data);
      }
    }
    if (setLoading) {
      setLoading(false);
    }
  };

export {
  getDepartmentShifts,
  addOrUpdateDepartmentShift,
  deleteDepartmentShift,
  copyDepartmentShifts,
  copyDepartmentShiftsAssignment,
};
// DEPARTMENT_EMPLOYEE_SHIFT
