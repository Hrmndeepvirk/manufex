import api from "@api";
import endPoints from "@endPoints";
import { setAgreementTemplates } from "./agreementSetupSlice";

const getAgreementTemplates = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_TEMPLATE
  );
  if (res.success) {
    dispatch(setAgreementTemplates(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getAgreementTemplate = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_TEMPLATE + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateAgreementTemplate =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_TEMPLATE + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_TEMPLATE,
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
const deleteAgreementTemplate =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.AGREEMENT_SETUP.AGREEMENT_TEMPLATE + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getAgreementTemplates());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

const getAssets = (next) => async (dispatch) => {
  const res = await api("get", endPoints.SETTINGS.AGREEMENT_SETUP.ASSET);
  if (res.success) {
    next(res.data);
  }
};

const deleteAsset = (id, next) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.AGREEMENT_SETUP.ASSET + id
  );
  if (res.success) {
    next();
  }
};

const addAssets = (files, next) => async (dispatch) => {
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  const res = await api(
    "post",
    endPoints.SETTINGS.AGREEMENT_SETUP.ASSET,
    formData,
    {},
    "multipart/form-data"
  );

  if (res.success) {
    next(res.data);
  }
};

export {
  getAgreementTemplates,
  deleteAgreementTemplate,
  addOrUpdateAgreementTemplate,
  getAgreementTemplate,
  getAssets,
  deleteAsset,
  addAssets,
};
