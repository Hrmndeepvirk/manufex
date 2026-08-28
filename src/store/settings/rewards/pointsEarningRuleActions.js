import api from "@api";
import endPoints from "@endPoints";
import { setPointsEarningRules } from "./rewardsSlice";

const getPointsEarningRules = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.REWARDS_SETUP.POINTS_EARNING_RULES
  );
  if (res.success) {
    dispatch(setPointsEarningRules(res.data));
  }
  if (setLoading) setLoading(false);
};
const getPointsEarningRule = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    endPoints.SETTINGS.REWARDS_SETUP.POINTS_EARNING_RULES + id
  );
  if (res.success) {
    next(res.data);
  }
  setLoading(false);
};
const addOrUpdatePointsEarningRule =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.REWARDS_SETUP.POINTS_EARNING_RULES + id,
        data
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.REWARDS_SETUP.POINTS_EARNING_RULES,
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
const deletePointsEarningRule = (id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.REWARDS_SETUP.POINTS_EARNING_RULES + id
  );
  if (res.success) {
    dispatch(getPointsEarningRules());
  }
};

export {
  getPointsEarningRules,
  getPointsEarningRule,
  addOrUpdatePointsEarningRule,
  deletePointsEarningRule,
};
