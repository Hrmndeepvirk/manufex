import api from "@api";
import endPoints from "@endPoints";
import { setAgreementPromotions } from "./agreementSetupSlice";

const getAgreementPromotions = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_PROMOTION
  );
  if (res.success) {
    dispatch(setAgreementPromotions(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getAgreementPromotion = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_PROMOTION + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateAgreementPromotion =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_PROMOTION + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_PROMOTION,
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
const deleteAgreementPromotion =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_PROMOTION + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getAgreementPromotions());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export {
  getAgreementPromotions,
  deleteAgreementPromotion,
  addOrUpdateAgreementPromotion,
  getAgreementPromotion,
};
