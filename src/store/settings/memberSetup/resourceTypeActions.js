import api from "@api";
import endPoints from "@endPoints";
import { setResourceTypes } from "./memberSetupSlice";

const getResourceTypes = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.MEMBER_SETUP.RESOURCE_TYPE);
  if (res.success) {
    dispatch(setResourceTypes(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getResourceType = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.MEMBER_SETUP.RESOURCE_TYPE + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateResourceType =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.MEMBER_SETUP.RESOURCE_TYPE + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.MEMBER_SETUP.RESOURCE_TYPE,
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
const deleteResourceType =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.MEMBER_SETUP.RESOURCE_TYPE + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getResourceTypes());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export {
  getResourceTypes,
  deleteResourceType,
  addOrUpdateResourceType,
  getResourceType,
};
