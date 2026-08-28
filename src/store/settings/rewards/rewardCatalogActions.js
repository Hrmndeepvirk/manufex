import api from "@api";
import endPoints from "@endPoints";
import { setRewardsCatalogs } from "./rewardsSlice";

const getRewardsCatalogs = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.REWARDS_SETUP.REWARDS_CATALOG
  );
  if (res.success) {
    dispatch(setRewardsCatalogs(res.data));
  }
  if (setLoading) setLoading(false);
};
const getRewardsCatalog = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.REWARDS_SETUP.REWARDS_CATALOG + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdateRewardsCatalog =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.REWARDS_SETUP.REWARDS_CATALOG + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.REWARDS_SETUP.REWARDS_CATALOG,
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
const deleteRewardsCatalog = (id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.REWARDS_SETUP.REWARDS_CATALOG + id
  );
  if (res.success) {
    dispatch(getPointsEarningRules());
  }
};

export {
  getRewardsCatalogs,
  getRewardsCatalog,
  addOrUpdateRewardsCatalog,
  deleteRewardsCatalog,
};
