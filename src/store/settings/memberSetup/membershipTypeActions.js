import api from "@api";
import endPoints from "@endPoints";
import { setMembershipTypes } from "./memberSetupSlice";

const getMemberShipTypes = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.MEMBER_SETUP.MEMBERSHIP_TYPE);
  if (res.success) {
    dispatch(setMembershipTypes(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getMemberShipType = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.MEMBER_SETUP.MEMBERSHIP_TYPE + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateMemberShipType =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.MEMBER_SETUP.MEMBERSHIP_TYPE + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.MEMBER_SETUP.MEMBERSHIP_TYPE,
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
const deleteMemberShipType =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.MEMBER_SETUP.MEMBERSHIP_TYPE + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getMemberShipTypes());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

const reorderPriority = (data, next) => async (dispatch) => {
  let res = await api(
    "post",
    endPoints.SETTINGS.MEMBER_SETUP.REORDER_MEMBERSHIP_TYPE,
    data
  );

  if (res.success) {
    dispatch(getMemberShipTypes());
  }
};

export {
  addOrUpdateMemberShipType,
  getMemberShipType,
  getMemberShipTypes,
  deleteMemberShipType,
  reorderPriority,
};
