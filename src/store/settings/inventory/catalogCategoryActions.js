import api from "@api";
import endPoints from "@endPoints";
import { setCatalogCategories } from "./inventorySlice";

const getCatalogCategories = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.INVENTORY.CATALOG_CATEGORY);
  if (res.success) {
    dispatch(setCatalogCategories(res.data));
  } else {
    console.error(res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getCatalogCategory =
  (id, setLoading, next, shouldIgnore) => async () => {
    if (setLoading) setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.INVENTORY.CATALOG_CATEGORY + id
    );
    if (shouldIgnore?.()) return;
    if (res.success) {
      next(res.data);
    }
    if (setLoading) setLoading(false);
  };
const addOrUpdateCatalogCategory =
  (id, data, setLoading, next) => async () => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.INVENTORY.CATALOG_CATEGORY + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.INVENTORY.CATALOG_CATEGORY,
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
const deleteCatalogCategory =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.INVENTORY.CATALOG_CATEGORY + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getCatalogCategories());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export {
  getCatalogCategories,
  getCatalogCategory,
  addOrUpdateCatalogCategory,
  deleteCatalogCategory,
};
