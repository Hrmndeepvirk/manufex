import api from "@api";
import endPoints from "@endPoints";
import { setRegisters } from "./pointOfSaleSlice";

const getRegisters = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.POINT_OF_SALE.REGISTER);
  if (res.success) {
    dispatch(setRegisters(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getRegister = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.POINT_OF_SALE.REGISTER + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateRegister =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.POINT_OF_SALE.REGISTER + id,
        data
      );
    } else {
      res = await api("post", endPoints.SETTINGS.POINT_OF_SALE.REGISTER, data);
    }

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteRegister =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.POINT_OF_SALE.REGISTER + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getRegisters());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export { getRegisters, getRegister, addOrUpdateRegister, deleteRegister };
