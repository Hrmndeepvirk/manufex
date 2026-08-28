import api from "@api";
import endPoints from "@endPoints";
import { setReferralGroups } from "./inventorySlice";

const getReferralGroups = (setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.INVENTORY.REFERRAL_GROUP);
  if (res.success) {
    dispatch(setReferralGroups(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getReferralGroup = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.INVENTORY.REFERRAL_GROUP + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateReferralGroup =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.INVENTORY.REFERRAL_GROUP + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.INVENTORY.REFERRAL_GROUP,
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
const deleteReferralGroup =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.INVENTORY.REFERRAL_GROUP + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getReferralGroups());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export {
  getReferralGroups,
  getReferralGroup,
  addOrUpdateReferralGroup,
  deleteReferralGroup,
};
