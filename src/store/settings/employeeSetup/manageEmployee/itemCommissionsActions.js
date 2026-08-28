import api from "@api";
import endPoints from "@endPoints";
import { setItemCommission } from "../employeeSetupSlice";

const getItemCommissions = (employeeId, setLoading) => async (dispatch) => {
  try {
    if (setLoading) setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.ITEM_COMMISSION(
        employeeId
      )
    );

    if (res.success) {
      dispatch(setItemCommission(res.data));
    } else {
      console.error(res.formErrors);
    }
  } catch (err) {
    console.error("Error fetching Substitution Options:", err);
  } finally {
    if (setLoading) setLoading(false);
  }
};

const getItemCommission =
  (id, employeeId, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.ITEM_COMMISSION(
        employeeId
      ) + id
    );

    if (res.success) {
      next(res.data);
    }

    if (setLoading) setLoading(false);
  };

const addOrUpdateItemCommission =
  (employeeId, id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.ITEM_COMMISSION(
          employeeId
        ) + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.ITEM_COMMISSION(
          employeeId
        ),
        data
      );
    }

    if (res.success) {
      dispatch(getItemCommissions(employeeId, setLoading));
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const deleteItemCommission = (employeeId, id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.ITEM_COMMISSION(
      employeeId
    ) + id
  );
  if (res.success) {
    dispatch(getItemCommissions(employeeId));
  }
};

export {
  getItemCommission,
  getItemCommissions,
  deleteItemCommission,
  addOrUpdateItemCommission,
};
