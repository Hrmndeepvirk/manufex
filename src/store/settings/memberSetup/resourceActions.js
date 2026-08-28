import api from "@api";
import endPoints from "@endPoints";
import { setResources } from "./memberSetupSlice";

const getResources = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.MEMBER_SETUP.RESOURCE);

  if (res.success) {
    dispatch(setResources(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getResource = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.MEMBER_SETUP.RESOURCE + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateResource =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.MEMBER_SETUP.RESOURCE + id,
        data
      );
    } else {
      res = await api("post", endPoints.SETTINGS.MEMBER_SETUP.RESOURCE, data);
    }

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteResource =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.MEMBER_SETUP.RESOURCE + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getResources());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export { getResource, deleteResource, addOrUpdateResource, getResources };
