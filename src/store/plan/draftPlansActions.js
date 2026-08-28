import api from "@api";
import endPoints from "@services/endPoints";
import { setDraftPlans } from "./planSlice";

const getDraftPlans = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.PLAN.DRAFTS);
  if (res.success) {
    dispatch(setDraftPlans(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getDraftPlan = (draftId, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.PLAN.DRAFTS + draftId);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};

const addDraftPlan = (data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res = await api("post", endPoints.PLAN.DRAFTS, data);

  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const updateDraftPlan =
  (draftId, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res = await api("put", endPoints.PLAN.DRAFTS + draftId, data);
    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const deleteDraftPlan = (draftId, next) => async (dispatch) => {
  const res = await api("delete", endPoints.PLAN.DRAFTS + draftId);
  if (res.success) {
    next();
  }
};

export {
  getDraftPlans,
  getDraftPlan,
  addDraftPlan,
  updateDraftPlan,
  deleteDraftPlan,
};
