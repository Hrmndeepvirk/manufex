import api from "@api";
import endPoints from "@endPoints";
import { setCampaignGroups } from "./memberSetupSlice";

const getCampaignGroups = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.MEMBER_SETUP.CAMPAIGN_GROUP);
  if (res.success) {
    dispatch(setCampaignGroups(res.data));
  } else {
    next(null, res.formErrors);
  }
  if (setLoading) setLoading(false);
};
const getCampaignGroup = (id, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.MEMBER_SETUP.CAMPAIGN_GROUP + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateCampaignGroup =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.MEMBER_SETUP.CAMPAIGN_GROUP + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.MEMBER_SETUP.CAMPAIGN_GROUP,
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
const deleteCampaignGroup =
  (id, setLoading, next, params = {}) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "delete",
      endPoints.SETTINGS.MEMBER_SETUP.CAMPAIGN_GROUP + id,
      {},
      params
    );
    if (res.success) {
      dispatch(getCampaignGroups());
      if (next) next(res);
    } else {
      if (!res.data?.canDelete) {
        if (next) next(res);
      }
    }
    if (setLoading) setLoading(false);
  };
export {
  getCampaignGroups,
  getCampaignGroup,
  addOrUpdateCampaignGroup,
  deleteCampaignGroup,
};
