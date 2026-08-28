import api from "@api";
import endPoints from "@endPoints";
import { setAgreementPlans } from "./agreementSetupSlice";

const getAgreementPlans = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_PLAN
  );

  if (res.success) {
    dispatch(setAgreementPlans(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getAgreementPlan = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_PLAN + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateAgreementPlan =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_PLAN + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_PLAN,
        data
      );
    }

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const copyAgreementPlan = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res = await api(
    "post",
    endPoints.SETTINGS.AGREEMENT_SETUP.COPY_AGREEMENT_PLAN + id,
    {},
  );

  if (res.success) {
    next(true, res.data);
    dispatch(getAgreementPlans(setLoading));
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};
const deleteAgreementPlan = (id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_PLAN + id
  );
  if (res.success) {
    dispatch(getAgreementPlans());
  }
};
export {
  getAgreementPlan,
  getAgreementPlans,
  addOrUpdateAgreementPlan,
  copyAgreementPlan,
  deleteAgreementPlan,
};
