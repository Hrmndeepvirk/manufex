import api from "@api";
import endPoints from "@endPoints";
import { setCatalogItems } from "./inventorySlice";
import { uploadImages } from "../../common/commonActions";

const getCatalogs = (setLoading) => async (dispatch) => {
  const res = await api("get", endPoints.SETTINGS.INVENTORY.CATALOG);
  if (res.success) {
    dispatch(setCatalogItems(res.data));
  } else {
    next(null, res.formErrors);
  }
};

const getCatalog = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.INVENTORY.CATALOG + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};

const addOrUpdateCatalog = (id, data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  if (data.images && data.images.length > 0) {
    data.images = await uploadImages(data.images);
  }
  let res;
  if (id) {
    res = await api("put", endPoints.SETTINGS.INVENTORY.CATALOG + id, data);
  } else {
    res = await api("post", endPoints.SETTINGS.INVENTORY.CATALOG, data);
  }

  if (res.success) {
    next(true, res?.data);
    dispatch(getCatalogs(setLoading));
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const deleteCatalog =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.INVENTORY.CATALOG + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getCatalogs());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

const copyCatalogItem = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res = await api(
    "post",
    endPoints.SETTINGS.INVENTORY.COPY_CATALOG_ITEM + id,
    {},
  );

  if (res.success) {
    next(true, res.data);
    dispatch(getCatalogs(setLoading));
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const updatePaysToRecords =
  (id, setLoading, data, next) => async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }

    const res = await api(
      "put",
      endPoints.SETTINGS.INVENTORY.CATALOG + "update-pays-to/" + id,
      data,
    );

    if (res?.success) {
      next(true, res?.data);
    }
    if (setLoading) {
      setLoading(false);
    }
  };
// Returns SERVICE catalog items that have no variation groups of their own.
// Used to populate the paysFor selector on sub-variation forms.
const getServicesForPaysFor = (setLoading, next) => async () => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.INVENTORY.CATALOG_SERVICES_FOR_PAYS_FOR,
  );
  if (res.success) {
    if (next) next(res.data);
  }
  if (setLoading) setLoading(false);
};

export {
  getCatalogs,
  getCatalog,
  addOrUpdateCatalog,
  deleteCatalog,
  copyCatalogItem,
  updatePaysToRecords,
  getServicesForPaysFor,
};
