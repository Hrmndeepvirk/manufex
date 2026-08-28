import api from "@api";
import endPoints from "@endPoints";
import { setSettings } from "./rewardsSlice";

const getRewardsSettings = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.SETTINGS.REWARDS_SETUP.SETTINGS);
  if (res.success) {
    dispatch(setSettings(res.data));
  } else {
  }
  if (setLoading) setLoading(false);
};

const updateRewardsSettings = (data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let res = await api("put", endPoints.SETTINGS.REWARDS_SETUP.SETTINGS, data);
  if (res.success) {
    next(true, null);
    dispatch(setSettings(res.data));
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

export { getRewardsSettings, updateRewardsSettings };
