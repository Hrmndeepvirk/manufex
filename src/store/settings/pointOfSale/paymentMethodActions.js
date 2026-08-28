import api from "@api";
import endPoints from "@endPoints";
import { setPaymentMethods } from "./pointOfSaleSlice";

const getPaymentMethods = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.POINT_OF_SALE.PAYMENT_METHOD);
  if (res.success) {
    dispatch(setPaymentMethods(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getPaymentMethod = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.POINT_OF_SALE.PAYMENT_METHOD + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdatePaymentMethod =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.POINT_OF_SALE.PAYMENT_METHOD + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.POINT_OF_SALE.PAYMENT_METHOD,
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
const deletePaymentMethod =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.POINT_OF_SALE.PAYMENT_METHOD + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getPaymentMethods());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export {
  getPaymentMethods,
  getPaymentMethod,
  addOrUpdatePaymentMethod,
  deletePaymentMethod,
};
