import api from "@api";
import endPoints from "@endPoints";
import { setCampaigns } from "./memberSetupSlice";

const getCampaigns = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.MEMBER_SETUP.CAMPAIGN);

  if (res.success) {
    dispatch(setCampaigns(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};

const getCampaign = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.SETTINGS.MEMBER_SETUP.CAMPAIGN + id);
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateCampaign =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.MEMBER_SETUP.CAMPAIGN + id,
        data
      );
    } else {
      res = await api("post", endPoints.SETTINGS.MEMBER_SETUP.CAMPAIGN, data);
    }

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteCampaign =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.MEMBER_SETUP.CAMPAIGN + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getCampaigns());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };

export { getCampaigns, getCampaign, addOrUpdateCampaign, deleteCampaign };
