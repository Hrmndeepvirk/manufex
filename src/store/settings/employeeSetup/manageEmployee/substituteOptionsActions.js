import api from "@api";
import endPoints from "@endPoints";
import { setSubstituteOptions } from "../employeeSetupSlice";

const getSubstitutionOptions = (employeeId, setLoading) => async (dispatch) => {
  try {
    if (setLoading) setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.SUBSTITUTE_OPTIONS(
        employeeId
      )
    );

    if (res.success) {
      dispatch(setSubstituteOptions(res.data));
    } else {
      console.error(res.formErrors);
    }
  } catch (err) {
    console.error("Error fetching Substitution Options:", err);
  } finally {
    if (setLoading) setLoading(false);
  }
};

const getSubstitutionOption =
  (id, employeeId, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.SUBSTITUTE_OPTIONS(
        employeeId
      ) + id
    );

    if (res.success) {
      next(res.data);
    }

    if (setLoading) setLoading(false);
  };

const addOrUpdateSubstitutionOption =
  (employeeId, id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.SUBSTITUTE_OPTIONS(
          employeeId
        ) + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.SUBSTITUTE_OPTIONS(
          employeeId
        ),
        data
      );
    }

    if (res.success) {
      dispatch(getSubstitutionOptions(employeeId, setLoading));
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const deleteSubstitutionOption = (employeeId, id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.SUBSTITUTE_OPTIONS(
      employeeId
    ) + id
  );
  if (res.success) {
    dispatch(getSubstitutionOptions(employeeId));
  }
};

export {
  getSubstitutionOption,
  getSubstitutionOptions,
  addOrUpdateSubstitutionOption,
  deleteSubstitutionOption,
};
