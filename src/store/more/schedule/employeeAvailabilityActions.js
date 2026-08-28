import api from "@api";
import endPoints from "@endPoints";
import { setEmployeeAvailability } from "./scheduleSlice";
import toast from "react-hot-toast";

const getEmployeeAvailability =
  (employeeId, queryParams, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);

    const queryString = new URLSearchParams(queryParams || {}).toString();
    const url =
      endPoints.MORE.EMPLOYEE_AVAILABILITY +
      employeeId +
      (queryString ? `?${queryString}` : "");

    const res = await api("get", url);
    if (res?.success && Array.isArray(res.data)) {
      dispatch(setEmployeeAvailability(res.data));
      if (next) next(res.data);
    }

    if (setLoading) setLoading(false);
  };

const saveEmployeeAvailability =
  (data, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);

    let toastId;

    toastId = toast.loading("Saving Availability...");

    const res = await api("post", endPoints.MORE.EMPLOYEE_AVAILABILITY, data);
    if (res?.success) {
      toast.success(res.message, {
        id: toastId,
      });
      dispatch(setEmployeeAvailability(res.data));
      if (next) next(res.data);
    } else {
      toast.error(res?.message || "Request Failed!", {
        id: toastId,
      });
    }

    if (setLoading) setLoading(false);
  };

const repeatWeekAvailability =
  (employeeId, data, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);

    const res = await api(
      "post",
      endPoints.MORE.EMPLOYEE_AVAILABILITY_REPEAT + employeeId,
      data,
    );

    if (res?.success) {
      if (next) next(res.data);
    }

    if (setLoading) setLoading(false);
  };

export {
  getEmployeeAvailability,
  saveEmployeeAvailability,
  repeatWeekAvailability,
};
