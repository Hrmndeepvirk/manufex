import api from "@api";
import endPoints from "@endPoints";
import { setVendors } from "./inventorySlice";

const getVendors = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.INVENTORY.VENDOR);
  if (res.success) {
    dispatch(setVendors(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};
const getVendor = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.INVENTORY.VENDOR + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateVendor = (id, data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res;
  if (id) {
    res = await api("put", endPoints.SETTINGS.INVENTORY.VENDOR + id, data);
  } else {
    res = await api("post", endPoints.SETTINGS.INVENTORY.VENDOR, data);
  }

  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};
const deleteVendor = (id) => async (dispatch) => {
  const res = await api("delete", endPoints.SETTINGS.INVENTORY.VENDOR + id);
  if (res.success) {
    dispatch(getVendors());
  }
};

export { getVendors, getVendor, addOrUpdateVendor, deleteVendor };
