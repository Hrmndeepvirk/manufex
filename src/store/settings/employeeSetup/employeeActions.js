import api from "@api";
import endPoints from "@endPoints";
import { showToastAction } from "@store/common/commonActions";
import { setEmployees, setEmployeeTimesheets } from "./employeeSetupSlice";
import { uploadFile } from "../../common/commonActions";

import { toast } from "react-hot-toast";

const getEmployees = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.EMPLOYEE_SETUP.EMPLOYEE);
  if (res.success) {
    dispatch(setEmployees(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getEmployee = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.EMPLOYEE_SETUP.EMPLOYEE + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};

const getEmployeeAccessCode = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.EMPLOYEE_SETUP.GET_EMPLOYEE_ACCESS_CODE + id,
  );
  if (res.success) {
    next(res.data);
  } else {
    next(null, res.formErrors || res.message);
  }
  if (setLoading) setLoading(false);
};

const addOrUpdateEmployee =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);

    if (data.image) {
      data.image = await uploadFile(data.image);
    }

    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.EMPLOYEE + id,
        data,
      );
    } else {
      res = await api("post", endPoints.SETTINGS.EMPLOYEE_SETUP.EMPLOYEE, data);
    }

    if (res.success) {
      next(true, res?.data);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteEmployee =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
  const res = await api(
    "delete",
    endPoints.SETTINGS.EMPLOYEE_SETUP.EMPLOYEE + id,
    {},
    params,
  );
  if (res.success) {
    dispatch(getEmployees());
    if (next) next(res);
  } else if (!res.data?.canDelete) {
    if (next) next(res);
  }
    if (setLoading) setLoading(false);
  };

const updateSalesCode = (id, data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res = await api(
    "put",
    endPoints.SETTINGS.EMPLOYEE_SETUP.UPDATE_SALES_CODE + id,
    data,
  );

  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const updateEmployeeClassLevels =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res = await api(
      "put",
      endPoints.SETTINGS.EMPLOYEE_SETUP.UPDATE_CLASS_LEVELS + id,
      data,
    );

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const updateEmployeeAppointmentLevels =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res = await api(
      "put",
      endPoints.SETTINGS.EMPLOYEE_SETUP.UPDATE_APPOINTMENT_LEVELS + id,
      data,
    );

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const getEmployeeTimesheets = (id, setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.EMPLOYEE_SETUP.GET_EMPLOYEE_TIMESHEETS + id,
  );
  if (res.success) {
    dispatch(setEmployeeTimesheets(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const requestPassword = (id, setLoading) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }

  let toastId;

  toastId = toast.loading("Request Processing...");

  const res = await api(
    "put",
    endPoints.SETTINGS.EMPLOYEE_SETUP.EMPLOYEE + id + "/request-password",
  );

  if (res?.success) {
    toast.success(res.message || "Password Sent Successfully!", {
      id: toastId,
    });
  } else {
    toast.error(res?.message || "Request Failed!", {
      id: toastId,
    });
  }

  if (setLoading) {
    setLoading(false);
  }
};

export {
  getEmployees,
  getEmployee,
  getEmployeeAccessCode,
  addOrUpdateEmployee,
  deleteEmployee,
  updateSalesCode,
  updateEmployeeClassLevels,
  updateEmployeeAppointmentLevels,
  getEmployeeTimesheets,
  requestPassword,
};
