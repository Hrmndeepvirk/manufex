import api from "@api";
import endPoints from "@endPoints";
import { showToastAction } from "@store/common/commonActions";
import { setTax } from "./pointOfSaleSlice";

const getTaxes = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.POINT_OF_SALE.TAX);
  if (res.success) {
    dispatch(setTax(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getTax = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.POINT_OF_SALE.TAX + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateTax = (id, data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res;
  if (id) {
    res = await api("put", endPoints.SETTINGS.POINT_OF_SALE.TAX + id, data);
  } else {
    res = await api("post", endPoints.SETTINGS.POINT_OF_SALE.TAX, data);
  }

  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};
const deleteTax =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.POINT_OF_SALE.TAX + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getTaxes());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export { getTaxes, getTax, deleteTax, addOrUpdateTax };
