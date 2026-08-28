import api from "@api";
import endPoints from "@endPoints";
import { setDiscounts } from "./pointOfSaleSlice";

const getDiscounts = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.POINT_OF_SALE.DISCOUNT);
  if (res.success) {
    dispatch(setDiscounts(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getDiscount = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.POINT_OF_SALE.DISCOUNT + id);
  if (res.success) {
    next(res.data);
  }
  if (setLoading) setLoading(false);
};
const addOrUpdateDiscount =
  (id, data, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.POINT_OF_SALE.DISCOUNT + id,
        data
      );
    } else {
      res = await api("post", endPoints.SETTINGS.POINT_OF_SALE.DISCOUNT, data);
    }

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteDiscount =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.POINT_OF_SALE.DISCOUNT + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getDiscounts());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export { getDiscounts, getDiscount, addOrUpdateDiscount, deleteDiscount };
