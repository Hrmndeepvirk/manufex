import api from "@api";
import endPoints from "@endPoints";
import { setDefaults } from "./businessSlice";

const getDefaultSetting = (companyId, setLoading, next) => async (dispatch) => {
  const res = await api(
    "get",
    endPoints.SETTINGS.BUSINESS.DEFAULT_SETTING + companyId
  );
  if (res.success) {
    dispatch(setDefaults(res.data));
    next(res.data);
  } else {
    next(null, res.formErrors);
  }
};

const addOrUpdateDefaultSettings =
  (id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    let res = await api(
      "put",
      endPoints.SETTINGS.BUSINESS.DEFAULT_SETTING + id,
      data
    );

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };

const getAgreementPlanFields = (next) => async (dispatch) => {
  const res = await api("get", endPoints.SETTINGS.BUSINESS.AGREEMENT_PLAN_FIELDS);
  if (res.success) {
    next(res.data);
  } else {
    next(null, res.formErrors);
  }
};

export { getDefaultSetting, addOrUpdateDefaultSettings, getAgreementPlanFields };
