import api from "@api";
import endPoints from "@endPoints";
import {
  setLastCheckin,
  setMemberBookedResources,
  setMemberEvents,
  setMemberProducts,
  setMemberServices,
  setQuickEnrollEvents,
  setRecentCheckins,
} from "./checkinSlice";
import { showToastAction } from "../common/commonActions";

const isAlertActive = (alert) => {
  const status = String(alert?.status || "").toUpperCase();
  return alert?.isActive !== false && alert?.active !== false && status !== "INACTIVE";
};

const normalizeCheckinData = (data) => {
  if (!data) return data;

  const member = data?.member;
  if (!member) return data;

  return {
    ...data,
    member: {
      ...member,
      alerts: Array.isArray(member.alerts)
        ? member.alerts.filter(isAlertActive)
        : member.alerts,
    },
  };
};

const checkinsAction = (query, setLoading, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }
  const res = await api("get", endPoints.CHECK_IN.CHECKIN, {}, query);
  if (res.success) {
    dispatch(setLastCheckin(normalizeCheckinData(res.data)));
    if (next) {
      next();
    }
  }
  setLoading(false);
};

const recentCheckinsAction = (setLoading) => async (dispatch, getState) => {
  let recentCheckins = getState().checkin.recent;
  if (!recentCheckins.length) {
    setLoading(true);
  }
  const res = await api("get", endPoints.CHECK_IN.RECENT);
  if (res.success) {
    dispatch(setRecentCheckins(res.data));
  }
  setLoading(false);
};

const lastCheckinsAction = (setLoading) => async (dispatch, getState) => {
  let lastCheckins = getState().checkin.lastCheckin;
  if (!lastCheckins) {
    setLoading(true);
  }
  const res = await api("get", endPoints.CHECK_IN.LAST_CHECKIN);
  if (res.success) {
    dispatch(setLastCheckin(normalizeCheckinData(res.data)));
  }
  setLoading(false);
};

const validateEmployeeForCheckIn =
  (id, setLoading, next) => async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }

    const res = await api("get", endPoints.CHECK_IN.VALIDATE_EMPLOYEE + id);
    if (res.success) {
      next(res.data);
    } else {
      next(null, res.message);
    }
    if (setLoading) {
      setLoading(false);
    }
  };

const verifyEmployeeAccessCode =
  (employeeId, accessCode, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);

    const res = await api(
      "post",
      endPoints.CHECK_IN.VERIFY_ACCESS_CODE + employeeId,
      { accessCode },
    );

    if (res.success) {
      if (next) next(true, null);
    } else {
      if (next) next(null, res.formErrors || { accessCode: res.message });
    }

    if (setLoading) setLoading(false);
  };

const employeeCheckInOut = (id, data, setLoading, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }

  const res = await api("post", endPoints.CHECK_IN.CHECK_IN_OUT + id, data);
  if (res.success) {
    next();
  } else {
    next(null, res.message);
  }
  if (setLoading) {
    setLoading(false);
  }
};

const quickEnrollEvents = (date, member, next) => async (dispatch) => {
  const res = await api(
    "get",
    endPoints.CHECK_IN.QUICK_ENROLL_EVENTS +
      "?date=" +
      date +
      "&member=" +
      member,
  );

  if (res?.success) {
    next(true, null);
    dispatch(setQuickEnrollEvents(res?.data));
  }
};

const enrollMemberFromCheckIn =
  (data, setLoading, next) => async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }

    const res = await api("post", endPoints.CHECK_IN.ENROLL_FROM_CHECKIN, data);

    if (res?.success) {
      next(true, null);
    }

    if (setLoading) {
      setLoading(false);
    }
  };

const removeMemberFromCheckIn =
  (data, setLoading, next) => async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }

    const res = await api("put", endPoints.CHECK_IN.REMOVE_FROM_CHECKIN, data);

    if (res?.success) {
      next(true, null);
    } else {
      // temporary display of error message
      dispatch(showToastAction({ description: res.message, type: "error" }));
    }
    if (setLoading) {
      setLoading(false);
    }
  };

const getMemberEvents = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }

  const res = await api("get", endPoints.CHECK_IN.MEMBER_EVENTS + id);
  if (res.success) {
    dispatch(setMemberEvents(res.data));
    next();
  } else {
    next(null, res.message);
  }
  if (setLoading) {
    setLoading(false);
  }
};

const getMemberBookedResources = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }
  const res = await api("get", endPoints.CHECK_IN.MEMBER_BOOKED_RESOURCES + id);
  if (res.success) {
    dispatch(setMemberBookedResources(res.data));
    next();
  } else {
    next(null, res.message);
  }
  if (setLoading) {
    setLoading(false);
  }
};

const getMemberServices = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }
  const res = await api("get", endPoints.CHECK_IN.MEMBER_SERVICES + id);
  if (res.success) {
    dispatch(setMemberServices(res.data));
    next();
  } else {
    next(null, res.message);
  }
  if (setLoading) {
    setLoading(false);
  }
};

const getMemberProducts = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }
  const res = await api("get", endPoints.CHECK_IN.MEMBER_PRODUCTS + id);
  if (res.success) {
    dispatch(setMemberProducts(res.data));
    next();
  } else {
    next(null, res.message);
  }
  if (setLoading) {
    setLoading(false);
  }
};

export {
  checkinsAction,
  recentCheckinsAction,
  lastCheckinsAction,
  validateEmployeeForCheckIn,
  verifyEmployeeAccessCode,
  quickEnrollEvents,
  getMemberBookedResources,
  employeeCheckInOut,
  enrollMemberFromCheckIn,
  removeMemberFromCheckIn,
  getMemberEvents,
  getMemberServices,
  getMemberProducts,
};
