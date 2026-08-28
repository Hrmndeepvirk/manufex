import api from "@api";
import endPoints from "@endPoints";
import { setAssessedFees } from "./agreementSetupSlice";

const getAccessedFees = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.AGREEMENT_SETUP.ACCESSED_FEE);
  if (res.success) {
    dispatch(setAssessedFees(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(true);
};

const getAccessedFee = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.AGREEMENT_SETUP.ACCESSED_FEE + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateAccessedFee =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.AGREEMENT_SETUP.ACCESSED_FEE + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.AGREEMENT_SETUP.ACCESSED_FEE,
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

const deleteAccessedFee =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.AGREEMENT_SETUP.ACCESSED_FEE + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getAccessedFees());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };
export {
  getAccessedFees,
  getAccessedFee,
  deleteAccessedFee,
  addOrUpdateAccessedFee,
};
