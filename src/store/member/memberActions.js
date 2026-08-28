import api from "@api";
import endPoints from "@endPoints";
import { setMembers, setMemberServices, setMemberAgreements } from "./memberSlice";
import { uploadFile } from "../common/commonActions";

const getMembers = (setLoading, options = {}) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.MEMBER.MEMBER,
    {},
    {},
    "application/json",
    options,
  );
  if (res.success) {
    dispatch(setMembers(res.data));
  } else if (res.status === 403) {
    dispatch(setMembers([]));
  }
  if (setLoading) setLoading(false);
};
const getMember = (id, setLoading, next) => async () => {
  if (setLoading) {
    setLoading(true);
  }
  const res = await api("get", endPoints.MEMBER.MEMBER + id);
  if (res.success) {
    next(res.data);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};
const getFastAddFields = (next) => async () => {
  const res = await api("get", endPoints.MEMBER.FAST_ADD_FIELDS);
  if (res.success) {
    next(res.data);
  } else {
    next(null, res.formErrors);
  }
};

const addMember = (data, setLoading, next) => async () => {
  setLoading(true);
  data.image = await uploadFile(data.image);
  let res = await api("post", endPoints.MEMBER.MEMBER, data);
  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const getMemberServices = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) {
    setLoading(true);
  }
  let res = await api("get", endPoints.MEMBER.MEMBER_SERVICES + id);
  if (res.success) {
    dispatch(setMemberServices(res.data));
    next(true, res.data);
  }
  if (setLoading) {
    setLoading(false);
  }
};

const updateMember = (id, data, setLoading, next) => async () => {
  if (setLoading) {
    setLoading(true);
  }
  const res = await api("put", endPoints.MEMBER.MEMBER + id, data);
  if (res.success) {
    next(res.data);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const getMemberAgreements = (memberId, setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.MEMBER.MEMBER_AGREEMENT + memberId);
  if (res.success) {
    dispatch(setMemberAgreements(res.data));
  }
  if (setLoading) setLoading(false);
};

const getMemberAgreementView = (id, next) => async () => {
  const res = await api("get", endPoints.MEMBER.MEMBER_AGREEMENT_VIEW + id);
  if (res.success) {
    next(res.data);
  }
};

const updateMemberRelationships =
  (id, data, setLoading, next) => async () => {
    setLoading(true);
    const res = await api(
      "put",
      endPoints.MEMBER.MEMBER_RELATIONSHIPS + id,
      data,
    );
    if (res.success) {
      next(res.data);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const getRecurringPlanServices = (id, setLoading, next) => async () => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.MEMBER.MEMBER_RECURRING_SERVICES + id);
  if (res.success) {
    next(res.data);
  } else {
    next([]);
  }
  if (setLoading) setLoading(false);
};

const getMostPurchasedItems = (id, setLoading, next) => async () => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.MEMBER.MEMBER + id + "/most-purchased");
  if (res.success) {
    next(res.data);
  }
  if (setLoading) setLoading(false);
};

const getBillingHistory = (memberId, setLoading, next, params = {}) => async () => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.MEMBER.BILLING_HISTORY + memberId,
    {},
    params,
  );
  if (res.success) {
    if (next) next(res.data, res.meta);
  }
  if (setLoading) setLoading(false);
};

const getPosHistory = (memberId, setLoading, next, params = {}) => async () => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.MEMBER.POS_HISTORY + memberId,
    {},
    params,
  );
  if (res.success) {
    if (next) next(res.data, res.meta);
  }
  if (setLoading) setLoading(false);
};

const verifyBarcode = (barCode, next) => async () => {
  const res = await api("get", endPoints.MEMBER.VERIFY_BARCODE + `?barCode=${barCode}`);
  if (res.success) {
    next(null);
  } else {
    next(res.formErrors);
  }
};

const chargeSchedules = (scheduleIds, setLoading, next) => async () => {
  setLoading(true);
  const res = await api("post", endPoints.MEMBER.CHARGE_SCHEDULES, { scheduleIds });
  if (res.success) {
    next(true, null);
  } else {
    next(null, res.message);
  }
  setLoading(false);
};

const verifyEmail = (email, next) => async () => {
  const res = await api("get", endPoints.MEMBER.VERIFY_EMAIL + `?email=${email}`);
  if (res.success) {
    next(null);
  } else {
    next(res.formErrors);
  }
};

const getMemberPendingEventServices = (memberId, setLoading, next) => async () => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.MEMBER.PENDING_EVENT_SERVICES_PREFIX +
      memberId +
      endPoints.MEMBER.PENDING_EVENT_SERVICES_SUFFIX,
  );
  if (res.success) {
    next(res.data);
  } else {
    next(null);
  }
  if (setLoading) setLoading(false);
};

export {
  getMembers,
  getFastAddFields,
  addMember,
  getMember,
  getMemberServices,
  updateMember,
  updateMemberRelationships,
  getMemberAgreements,
  getMemberAgreementView,
  getRecurringPlanServices,
  getMostPurchasedItems,
  getBillingHistory,
  getPosHistory,
  verifyBarcode,
  verifyEmail,
  chargeSchedules,
  getMemberPendingEventServices,
};
