import api from "@api";
import endPoints from "@endPoints";
import { getCatalogs } from "./catalogActions";

const getCatalogVariations = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.INVENTORY.CATALOG_VARIATION + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};

const addCatalogVariation =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res = await api(
      "post",
      endPoints.SETTINGS.INVENTORY.CATALOG_VARIATION + id,
      data
    );
    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const editCatalogVariation =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res = await api(
      "put",
      endPoints.SETTINGS.INVENTORY.CATALOG_VARIATION + id,
      data
    );
    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const deleteCatalogvariation = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "delete",
    endPoints.SETTINGS.INVENTORY.CATALOG_VARIATION + id
  );
  if (res.success) {
    next(true, null);
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const addSubVariationInCatalogVariation =
  (catalogItemId, variationid, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res = await api(
      "post",
      endPoints.SETTINGS.INVENTORY.CATALOG_VARIATION +
        catalogItemId +
        "/" +
        variationid,
      data
    );
    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const reorderPriority = (data, next) => async (dispatch) => {
  let res = await api(
    "post",
    endPoints.SETTINGS.INVENTORY.REORDER_CATALOG_ITEM,
    data
  );

  if (res.success) {
    dispatch(getCatalogs());
  }
};
export {
  getCatalogVariations,
  addCatalogVariation,
  editCatalogVariation,
  deleteCatalogvariation,
  addSubVariationInCatalogVariation,
  reorderPriority,
};
