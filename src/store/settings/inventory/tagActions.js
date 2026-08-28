import api from "@api";
import endPoints from "@endPoints";
import { setTags } from "./inventorySlice";

const getTags = (setLoading, next) => async (dispatch) => {
  const res = await api("get", endPoints.SETTINGS.INVENTORY.TAGS);
  if (res.success) {
    dispatch(setTags(res.data));
  } else {
    next(null, res.formErrors);
  }
};

const getTag = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.INVENTORY.TAGS + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateTag = (id, data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res;
  if (id) {
    res = await api("put", endPoints.SETTINGS.INVENTORY.TAGS + id, data);
  } else {
    res = await api("post", endPoints.SETTINGS.INVENTORY.TAGS, data);
  }

  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const deleteTag = (id) => async (dispatch) => {
  const res = await api("delete", endPoints.SETTINGS.INVENTORY.TAGS + id);
  if (res.success) {
    dispatch(getTags());
  }
};

export { addOrUpdateTag, getTag, getTags, deleteTag };
