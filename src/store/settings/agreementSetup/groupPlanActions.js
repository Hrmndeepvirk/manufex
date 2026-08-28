import api from "@api";
import endPoints from "@endPoints";
import { setGroupPlans } from "./agreementSetupSlice";

const getGroupPlans = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.AGREEMENT_SETUP.GROUP_PLAN,
  );
  if (res.success) {
    dispatch(setGroupPlans(res.data));
  }
  if (setLoading) setLoading(false);
};

const getGroupPlan = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.AGREEMENT_SETUP.GROUP_PLAN + id,
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};

const addOrUpdateGroupPlan =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.AGREEMENT_SETUP.GROUP_PLAN + id,
        data,
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.AGREEMENT_SETUP.GROUP_PLAN,
        data,
      );
    }
    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const deleteGroupPlan = (id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.AGREEMENT_SETUP.GROUP_PLAN + id,
  );
  if (res.success) {
    dispatch(getGroupPlans());
  }
};

export { getGroupPlans, getGroupPlan, addOrUpdateGroupPlan, deleteGroupPlan };
