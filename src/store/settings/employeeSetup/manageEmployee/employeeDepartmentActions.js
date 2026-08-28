import api from "@api";
import endPoints from "@endPoints";
import { setEmployeeDepartments } from "../employeeSetupSlice";

const getEmployeeDepartments = (employeeId, setLoading) => async (dispatch) => {
  try {
    if (setLoading) setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.EMPLOYEE_DEPARTMENT(
        employeeId
      )
    );

    if (res.success) {
      dispatch(setEmployeeDepartments(res.data));
    } else {
      console.error(res.formErrors);
    }
  } catch (err) {
    console.error("Error fetching notes:", err);
  } finally {
    if (setLoading) setLoading(false);
  }
};

const getEmployeeDepartment =
  (employeeId, id, setLoading, next) => async (dispatch) => {
    setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.EMPLOYEE_DEPARTMENT(
        employeeId
      ) + id
    );
    if (res.success) {
      next(res.data);
    }
    setLoading(false);
  };

const addOrUpdateEmployeeDepartment =
  (employeeId, id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.EMPLOYEE_DEPARTMENT(
          employeeId
        ) + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.EMPLOYEE_DEPARTMENT(
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

const deleteEmployeeDepartment = (employeeId, id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.EMPLOYEE_DEPARTMENT(
      employeeId
    ) + id
  );
  if (res.success) {
    dispatch(getEmployeeDepartments(employeeId));
  }
};

const getJobTitlesForDepartment =
  (employeeId, id, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.EMPLOYEE_DEPARTMENT(
        employeeId
      ) +
        "get-job-titles/" +
        id
    );

    if (res.success) {
      next(true, res.data);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

export {
  getEmployeeDepartments,
  addOrUpdateEmployeeDepartment,
  deleteEmployeeDepartment,
  getEmployeeDepartment,
  getJobTitlesForDepartment,
};
