import api from "@api";
import endPoints from "@endPoints";
import { setAppointmentPays } from "../employeeSetupSlice";

const getAppointmentPays = (employeeId, setLoading) => async (dispatch) => {
  try {
    if (setLoading) setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.APPOINTMENT_PAY(
        employeeId
      )
    );

    if (res.success) {
      dispatch(setAppointmentPays(res.data));
    } else {
      console.error(res.formErrors);
    }
  } catch (err) {
    console.error("Error fetching Substitution Options:", err);
  } finally {
    if (setLoading) setLoading(false);
  }
};

const getAppointmentPay =
  (id, employeeId, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.APPOINTMENT_PAY(
        employeeId
      ) + id
    );

    if (res.success) {
      next(res.data);
    }

    if (setLoading) setLoading(false);
  };

const addOrUpdateAppointmentPay =
  (employeeId, id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.APPOINTMENT_PAY(
          employeeId
        ) + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.APPOINTMENT_PAY(
          employeeId
        ),
        data
      );
    }

    if (res.success) {
      dispatch(getAppointmentPays(employeeId, setLoading));
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const deleteAppointmentPays = (employeeId, id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.APPOINTMENT_PAY(
      employeeId
    ) + id
  );
  if (res.success) {
    dispatch(getAppointmentPays(employeeId));
  }
};

export {
  addOrUpdateAppointmentPay,
  getAppointmentPay,
  getAppointmentPays,
  deleteAppointmentPays,
};
