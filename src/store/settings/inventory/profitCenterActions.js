import api from "@api";
import endPoints from "@endPoints";
import { setProfitCenters } from "./inventorySlice";

const getProfitCenters = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.INVENTORY.PROFIT_CENTER);
  if (res.success) {
    dispatch(setProfitCenters(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getProfitCenter = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.INVENTORY.PROFIT_CENTER + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateProfitCenter =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.INVENTORY.PROFIT_CENTER + id,
        data
      );
    } else {
      res = await api("post", endPoints.SETTINGS.INVENTORY.PROFIT_CENTER, data);
    }

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteProfitCenter =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.INVENTORY.PROFIT_CENTER + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getProfitCenters());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export {
  getProfitCenters,
  getProfitCenter,
  addOrUpdateProfitCenter,
  deleteProfitCenter,
};
