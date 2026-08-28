import api from "@api";
import endPoints from "@endPoints";
import { setSalesBonus } from "../employeeSetupSlice";

const getSalesBonuses = (employeeId, setLoading) => async (dispatch) => {
  try {
    if (setLoading) setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.SALES_BONUS(
        employeeId
      )
    );

    if (res.success) {
      dispatch(setSalesBonus(res.data));
    } else {
      console.error(res.formErrors);
    }
  } catch (err) {
    console.error("Error fetching Substitution Options:", err);
  } finally {
    if (setLoading) setLoading(false);
  }
};

const getSalesBonus =
  (id, employeeId, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.SALES_BONUS(
        employeeId
      ) + id
    );

    if (res.success) {
      next(res.data);
    }

    if (setLoading) setLoading(false);
  };

const addOrUpdateSalesBonus =
  (employeeId, id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.SALES_BONUS(
          employeeId
        ) + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.SALES_BONUS(
          employeeId
        ),
        data
      );
    }

    if (res.success) {
      dispatch(getSalesBonuses(employeeId, setLoading));
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const deleteSalesBonus = (employeeId, id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.SALES_BONUS(
      employeeId
    ) + id
  );
  if (res.success) {
    dispatch(getSalesBonuses(employeeId));
  }
};

export {
  addOrUpdateSalesBonus,
  getSalesBonus,
  getSalesBonuses,
  deleteSalesBonus,
};
