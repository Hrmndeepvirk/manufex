import api from "@api";
import endPoints from "@endPoints";
import { setFilterSets } from "./inventorySlice";

const getFilterSets = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.INVENTORY.FILTER_SETS);
  if (res.success) {
    dispatch(setFilterSets(res.data));
  } else {
    console.error(res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getFilterSet = (id, setLoading, next) => async () => {
  if (setLoading) setLoading(true);
  try {
    const res = await api("get", endPoints.SETTINGS.INVENTORY.FILTER_SETS + id);
    if (res.success) {
      next?.(res.data);
    }
  } finally {
    if (setLoading) setLoading(false);
  }
};
const addOrUpdateFilterSet =
  (id, data, setLoading, next) => async () => {
    if (setLoading) setLoading(true);
    try {
      let res;
      if (id) {
        res = await api(
          "put",
          endPoints.SETTINGS.INVENTORY.FILTER_SETS + id,
          data
        );
      } else {
        res = await api("post", endPoints.SETTINGS.INVENTORY.FILTER_SETS, data);
      }

      if (res.success) {
        next?.(true, null);
      } else {
        next?.(null, res.formErrors);
      }
    } finally {
      if (setLoading) setLoading(false);
    }
  };

const deleteFilterSet = (id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.INVENTORY.FILTER_SETS + id
  );
  if (res.success) {
    dispatch(getFilterSets());
  }
};

export { getFilterSet, getFilterSets, addOrUpdateFilterSet, deleteFilterSet };
