import api from "@api";
import endPoints from "@endPoints";
import { setSavedCarts } from "./pointOfSaleSlice";
import { showToastAction } from "../common/commonActions";

const getSavedCarts = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.POS.SAVED_CART);
  if (res.success) {
    dispatch(setSavedCarts(res.data));
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
};

const getSavedCart = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", `${endPoints.POS.SAVED_CART}/${id}`);
  if (res.success) {
    if (next) next(res.data);
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
};

const saveCart = (data, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("post", endPoints.POS.SAVED_CART, data);
  if (res.success) {
    dispatch(showToastAction({ description: res.message, type: "success" }));
    if (next) next(res.data);
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
};

const deleteSavedCart = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("delete", `${endPoints.POS.SAVED_CART}/${id}`);
  if (res.success) {
    dispatch(showToastAction({ description: res.message, type: "success" }));
    if (next) next(res.data);
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
};

export { getSavedCarts, getSavedCart, saveCart, deleteSavedCart };
