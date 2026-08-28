import api from "@api";
import endPoints from "@endPoints";
import { setAgreementCategories } from "./agreementSetupSlice";

const getAgreementCategories = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_CATEGORY
  );

  if (res.success) {
    dispatch(setAgreementCategories(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getAgreementCategory = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_CATEGORY + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateAgreementCategory =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_CATEGORY + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_CATEGORY,
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
const deleteAgreementCategory =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_CATEGORY + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getAgreementCategories());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };
export {
  getAgreementCategories,
  deleteAgreementCategory,
  addOrUpdateAgreementCategory,
  getAgreementCategory,
};
