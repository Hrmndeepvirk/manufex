import api from "@api";
import endPoints from "@endPoints";
import {
  setCalendarEvents,
  appendCalendarEvents,
  resetCalendarCache,
} from "./calendarSlice";
import { showToastAction } from "../common/commonActions";
import toast from "react-hot-toast";

const getCalendarEvents =
  (midpointDate, { mode = "replace", setLoading } = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const params = {};
    if (midpointDate) params.date = midpointDate;
    const activeClub = localStorage.getItem("club");
    if (activeClub) params.club = activeClub;
    const res = await api("get", endPoints.CALENDAR.CALENDAR_EVENT, null, params);
    if (res.success) {
      if (mode === "append") {
        dispatch(appendCalendarEvents(res.data));
      } else {
        dispatch(setCalendarEvents(res.data));
      }
    }
    if (setLoading) setLoading(false);
  };

const getCalendarEvent = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.CALENDAR.CALENDAR_EVENT + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};

const getCalendarEventMembers =
  (id, requiredServices, setLoading, next) => async (dispatch) => {
    setLoading(true);
    const res = await api(
      "post",
      endPoints.CALENDAR.CALENDAR_EVENT + id + "/members",
      { services: requiredServices },
    );
    if (res.success) {
      next(res.data);
    }
    setLoading(false);
  };

const addCalendarEvent = (data, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("post", endPoints.CALENDAR.CALENDAR_EVENT, data);
  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};
const addMemberToEvent = (data, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "post",
    endPoints.CALENDAR.CALENDAR_EVENT + "add-member",
    data,
  );
  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const deleteMemberFromEvent = (data, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "delete",
    endPoints.CALENDAR.CALENDAR_EVENT + "delete-member",
    data,
  );
  if (res.success) {
    next(true, null);
  } else {
    // temporary display of error message
    dispatch(showToastAction({ description: res.message, type: "error" }));
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const repeatEvents = (id, setLoading, data, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }

  let res = await api(
    "post",
    endPoints.CALENDAR.REPEAT_CALENDAR_EVENT + id,
    data,
  );

  if (res.success) {
    dispatch(resetCalendarCache());
    next(true, null);
  } else {
    dispatch(
      showToastAction({
        description: res.message || "Failed to repeat calendar events.",
        type: "error",
      }),
    );
    next(null, res.formErrors);
  }

  if (setLoading) {
    setLoading(false);
  }
};

const getRepetitiveEventData = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }

  const res = await api("get", endPoints.CALENDAR.REPETITIVE_EVENT_DATA + id);

  if (res?.success) {
    next(true, res?.data);
  }
  if (setLoading) {
    setLoading(false);
  }
};

const deleteCalendarEvent =
  (id, type, setLoading, next) => async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }

    let res = await api(
      "delete",
      endPoints.CALENDAR.CALENDAR_EVENT + id + "?type=" + type,
    );

    if (res?.success) {
      dispatch(resetCalendarCache());
      next(true, res?.data);
    }

    if (setLoading) {
      setLoading(false);
    }
  };

const editCalendarEventMember =
  (id, setLoading, data, next) => async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }

    const res = await api(
      "patch",
      endPoints.CALENDAR.EDIT_CALENDAR_EVENT_MEMBER + id,
      data,
    );

    if (res?.success) {
      next(true, res?.data);
    }

    if (setLoading) {
      setLoading(false);
    }
  };

const editCalendarEvent = (id, setLoading, data, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }

  const toastId = toast.loading("Saving...");

  const res = await api("patch", endPoints.CALENDAR.CALENDAR_EVENT + id, data);

  if (res?.success) {
    toast.success(res.message || "Event updated successfully!", { id: toastId });
    next(true, res?.data);
  } else {
    toast.error(res?.message || "Request Failed!", { id: toastId });
  }

  if (setLoading) {
    setLoading(false);
  }
};

const eventMemberVerification =
  (id, setLoading, data, next) => async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }

    const res = await api(
      "put",
      endPoints.CALENDAR.VERIFY_EVENT_MEMBER + id,
      data,
    );

    if (res?.success) {
      next(true, null);
    } else {
      next(null, res?.formErrors);
    }
    if (setLoading) {
      setLoading(false);
    }
  };

const eventEmployeeVerification =
  (id, setLoading, data, next) => async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }

    const res = await api(
      "patch",
      endPoints.CALENDAR.VERIFY_EVENT_EMPLOYEE + id,
      data,
    );

    if (res?.success) {
      next(true, null);
    } else {
      next(null, res?.formErrors);
    }
    if (setLoading) {
      setLoading(false);
    }
  };

const verifyCompletion = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);

  const res = await api("get", endPoints.CALENDAR.VERIFY_COMPLETION + id);

  if (res?.success) {
    dispatch(showToastAction({ description: res.message, type: "success" }));
    next(true);
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }

  setLoading(false);
};

const revertCompletion = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);

  const res = await api(
    "patch",
    endPoints.CALENDAR.REVERT_COMPLETION + id,
  );

  if (res?.success) {
    dispatch(showToastAction({ description: res.message, type: "success" }));
    next(true);
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
    next(false);
  }

  setLoading(false);
};

const bookResource = (id, data, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "patch",
    endPoints.CALENDAR.BOOK_RESOURCE + id,
    data,
  );
  if (res?.success) {
    next(true, res.data);
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
    next(false, null);
  }
  if (setLoading) setLoading(false);
};

const unbookResource = (id, data, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "patch",
    endPoints.CALENDAR.UNBOOK_RESOURCE + id,
    data,
  );
  if (res?.success) {
    next(true, res.data);
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
    next(false, null);
  }
  if (setLoading) setLoading(false);
};

export {
  getCalendarEvents,
  getCalendarEvent,
  getCalendarEventMembers,
  addCalendarEvent,
  addMemberToEvent,
  deleteMemberFromEvent,
  repeatEvents,
  getRepetitiveEventData,
  deleteCalendarEvent,
  editCalendarEventMember,
  editCalendarEvent,
  eventMemberVerification,
  eventEmployeeVerification,
  verifyCompletion,
  revertCompletion,
  bookResource,
  unbookResource,
};
