import api from "@api";
import endPoints from "@endPoints";
import { setCommissionGroups } from "./inventorySlice";

const getCommissionGroups = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.INVENTORY.COMMISSION_GROUP);
  if (res.success) {
    dispatch(setCommissionGroups(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getCommissionGroup = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.INVENTORY.COMMISSION_GROUP + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateCommissionGroup =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.INVENTORY.COMMISSION_GROUP + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.INVENTORY.COMMISSION_GROUP,
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
const deleteCommissionGroup =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.INVENTORY.COMMISSION_GROUP + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getCommissionGroups());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        const filteredDependencies = (res.data?.dependencies || []).filter(
          (dep) => dep.module?.toLowerCase() !== "commission logs"
        );
        if (filteredDependencies.length > 0) {
          if (next) next({ ...res, data: { ...res.data, dependencies: filteredDependencies } });
        }
      }
    }
    if (setLoading) setLoading(false);
  };

export {
  getCommissionGroups,
  getCommissionGroup,
  addOrUpdateCommissionGroup,
  deleteCommissionGroup,
};
