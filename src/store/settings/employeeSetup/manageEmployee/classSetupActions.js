import api from "@api";
import endPoints from "@endPoints";
import { setClassSetup } from "../employeeSetupSlice";

const getEmployeeClassSetups = (employeeId, setLoading) => async (dispatch) => {
  const res = await api(
    "get",
    endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.CLASS_SETUP(employeeId)
  );
  if (res.success) {
    dispatch(setClassSetup(res.data));
  } else {
    next(null, res.formErrors);
  }
};
const getEmployeeClassSetup =
  (employeeId, id, setLoading, next) => async (dispatch) => {
    setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.CLASS_SETUP(
        employeeId
      ) + id
    );
    if (res.success) {
      next(res.data);
    }
    setLoading(false);
  };
const addOrUpdateEmployeeClassSetup =
  (employeeId, id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.CLASS_SETUP(
          employeeId
        ) + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.CLASS_SETUP(
          employeeId
        ),
        data
      );
    }

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteEmployeeClassSetup = (employeeId, id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.CLASS_SETUP(employeeId) +
      id
  );
  if (res.success) {
    dispatch(getEmployeeClassSetups(employeeId));
  }
};

export {
  getEmployeeClassSetup,
  getEmployeeClassSetups,
  deleteEmployeeClassSetup,
  addOrUpdateEmployeeClassSetup,
};
