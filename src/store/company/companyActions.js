import api from "@api";
import endPoints from "@endPoints";
import { setCompanyDetails } from "./companySlice";
import { setCompany } from "../settings/business/businessSlice";
import { applyBrandTheme } from "@utils/theme";

const COMPANY_CACHE_KEY = `iz_company_${window.location.hostname}`;

const getCompanyDetails = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  let res = await api("get", endPoints.COMPANY);
  if (res.success) {
    dispatch(setCompanyDetails(res.data));
    dispatch(setCompany(res.data));
  }
  if (setLoading) setLoading(false);
};

const onCompanyUpdate = (data) => async (dispatch) => {
  dispatch(setCompanyDetails(data));
  dispatch(setCompany(data));
};

const getCompanyBySubdomain = (setLoading) => async (dispatch) => {
  const cached = localStorage.getItem(COMPANY_CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      dispatch(setCompanyDetails(parsed));
      dispatch(setCompany(parsed));
      applyBrandTheme(parsed.brandAssets);
    } catch (_) {}
  }

  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.COMPANY_BY_SUBDOMAIN);
  if (res.success && res.data) {
    dispatch(setCompanyDetails(res.data));
    dispatch(setCompany(res.data));
    applyBrandTheme(res.data.brandAssets);
    localStorage.setItem(COMPANY_CACHE_KEY, JSON.stringify(res.data));
  } else if (res.data?.redirectUrl) {
    window.location.href = res.data.redirectUrl;
  }
  if (setLoading) setLoading(false);
  return res;
};

export { getCompanyDetails, onCompanyUpdate, getCompanyBySubdomain };
