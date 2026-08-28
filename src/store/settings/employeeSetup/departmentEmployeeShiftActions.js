import api from "@api";
import endPoints from "@endPoints";

const getDepartmentEmployeeShifts =
  (departmentId, employeeId, setLoading, next) => async (dispatch) => {
    setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.DEPARTMENT_EMPLOYEE_SHIFT +
        departmentId +
        "/" +
        employeeId
    );
    if (res.success) {
      next(res.data);
    }
    setLoading(false);
  };
const updateEmployeeAvailability =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res = await api(
      "put",
      endPoints.SETTINGS.EMPLOYEE_SETUP.DEPARTMENT_EMPLOYEE_SHIFT + id,
      data
    );

    if (res.success) {
      next(res.data, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const copyEmployeeAvailability =
  (departmentId, data, setLoading, next) => async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }
    const res = await api(
      "post",
      endPoints.SETTINGS.EMPLOYEE_SETUP.DEPARTMENT_EMPLOYEE_SHIFT +
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

export {
  getDepartmentEmployeeShifts,
  updateEmployeeAvailability,
  copyEmployeeAvailability,
};
