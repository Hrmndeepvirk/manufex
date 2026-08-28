import api from "@api";
import endPoints from "@endPoints";
import { removeItem, setCatalogSubCategoryGroups } from "./inventorySlice";

const getCatalogSubCategoryGroups =
  (subCategoryId, setLoading, shouldIgnore) => async (dispatch) => {
    if (setLoading) setLoading(true);
    let url = endPoints.SETTINGS.INVENTORY.CATALOG_SUB_CATEGORY_GROUP;
    if (subCategoryId) {
      url += `?subCategory=${subCategoryId}`;
    }
    const res = await api("get", url);
    if (shouldIgnore?.()) return;
    if (res.success) {
      dispatch(setCatalogSubCategoryGroups(res.data));
    } else {
      console.error(res.formErrors);
    }
    if (setLoading) setLoading(false);
  };

const getCatalogSubCategoryGroup =
  (id, setLoading, next, shouldIgnore) => async () => {
    if (setLoading) setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.INVENTORY.CATALOG_SUB_CATEGORY_GROUP + id
    );
    if (shouldIgnore?.()) return;
    if (res.success) {
      next(res.data);
    }
    if (setLoading) setLoading(false);
  };

const addOrUpdateCatalogSubCategoryGroup =
  (id, data, setLoading, next) => async () => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.INVENTORY.CATALOG_SUB_CATEGORY_GROUP + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.INVENTORY.CATALOG_SUB_CATEGORY_GROUP,
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

const deleteCatalogSubCategoryGroup = (id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.INVENTORY.CATALOG_SUB_CATEGORY_GROUP + id
  );
  if (res.success) {
    dispatch(removeItem({ option: "catalogSubCategoryGroups", id }));
  }
};

export {
  getCatalogSubCategoryGroups,
  getCatalogSubCategoryGroup,
  addOrUpdateCatalogSubCategoryGroup,
  deleteCatalogSubCategoryGroup,
};
