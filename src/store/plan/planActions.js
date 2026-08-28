import api from "@api";
import endPoints from "@services/endPoints";
import { setPlans } from "./planSlice";
import { showToastAction, uploadFiles } from "../common/commonActions";

const getPlans = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.PLAN.PLANS);
  if (res.success) {
    dispatch(setPlans(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getPlan = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.PLAN.PLANS + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};

const getMemberInformation = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.PLAN.MEMBER + id);
  if (res.success) {
    next(res.data);
  }
  if (setLoading) setLoading(false);
};
const postPlan = (payload, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("post", endPoints.PLAN.PLANS, payload);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};

const getSubscriptionAgreement = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.PLAN.AGREEMENT + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};

const postSubscriptionAgreement =
  (id, data, signatures, setLoading, next) => async (dispatch) => {
    setLoading(true);

    let _signatures = await uploadFiles(signatures.map((item) => item.url));
    console.log("_signatures==>", _signatures);

    _signatures = _signatures?.map((item) => ({ url: item })) || [];
    let payload = {
      htmlContent: data.htmlContent,
      signatures: _signatures,
      isSigned: true,
    };
    const res = await api("put", endPoints.PLAN.AGREEMENT + id, payload);
    if (res.success) {
      dispatch(showToastAction({ description: res.message }));
      next(res.data);
    }
    setLoading(false);
  };

const cancelSubscription = (id, payload, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("put", endPoints.PLAN.PLANS + id + "/cancel", payload);
  if (res.success) {
    dispatch(showToastAction({ description: res.message }));
    if (next) next(res.data);
  }
  if (setLoading) setLoading(false);
};

const freezeSubscription = (id, payload, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("put", endPoints.PLAN.PLANS + id + "/freeze", payload);
  if (res.success) {
    dispatch(showToastAction({ description: res.message }));
    if (next) next(res.data);
  }
  if (setLoading) setLoading(false);
};

const unfreezeSubscription = (id, payload, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("put", endPoints.PLAN.PLANS + id + "/unfreeze", payload);
  if (res.success) {
    dispatch(showToastAction({ description: res.message }));
    if (next) next(res.data);
  }
  if (setLoading) setLoading(false);
};

const checkReavailability = (agreementId, memberId, next) => async (dispatch) => {
  const res = await api(
    "get",
    `${endPoints.PLAN.CHECK_REAVAILABILITY}${agreementId}/${memberId}`,
  );
  if (res.success) {
    next({ eligible: true, message: null });
  } else {
    next({ eligible: res.data?.eligible ?? false, message: res.message });
  }
};

export {
  getPlans,
  getPlan,
  getMemberInformation,
  postPlan,
  getSubscriptionAgreement,
  postSubscriptionAgreement,
  cancelSubscription,
  freezeSubscription,
  unfreezeSubscription,
  checkReavailability,
};
