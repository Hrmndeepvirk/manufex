import api from "@api";
import endPoints from "@endPoints";
import { removeItem, setCatalogSubCategories } from "./inventorySlice";

  const getCatalogSubCategories =
    (categoryId, setLoading, shouldIgnore) => async (dispatch) => {
      if (setLoading) setLoading(true);
      let url = endPoints.SETTINGS.INVENTORY.CATALOG_SUB_CATEGORY;
      if (categoryId) {
        url += `?category=${categoryId}`;
      }
      const res = await api("get", url);
      if (shouldIgnore?.()) return;
      if (res.success) {
        dispatch(setCatalogSubCategories(res.data));
      } else {
        console.error(res.formErrors);
      }
      if (setLoading) setLoading(false);
    };

  const getCatalogSubCategory =
    (id, setLoading, next, shouldIgnore) => async () => {
      if (setLoading) setLoading(true);
      const res = await api(
        "get",
        endPoints.SETTINGS.INVENTORY.CATALOG_SUB_CATEGORY + id
      );
      if (shouldIgnore?.()) return;
      if (res.success) {
        next(res.data);
      }
      if (setLoading) setLoading(false);
    };

  const addOrUpdateCatalogSubCategory =
    (id, data, setLoading, next) => async () => {
      setLoading(true);
      let res;
      if (id) {
        res = await api(
          "put",
          endPoints.SETTINGS.INVENTORY.CATALOG_SUB_CATEGORY + id,
          data
        );
      } else {
        res = await api(
          "post",
          endPoints.SETTINGS.INVENTORY.CATALOG_SUB_CATEGORY,
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

  const deleteCatalogSubCategory = (id) => async (dispatch) => {
    const res = await api(
      "delete",
      endPoints.SETTINGS.INVENTORY.CATALOG_SUB_CATEGORY + id
    );
    if (res.success) {
      dispatch(removeItem({ option: "catalogSubCategories", id }));
    }
  };

  export {
    getCatalogSubCategories,
    getCatalogSubCategory,
    addOrUpdateCatalogSubCategory,
    deleteCatalogSubCategory,
  };
