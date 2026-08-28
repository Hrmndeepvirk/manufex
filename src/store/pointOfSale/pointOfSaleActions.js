import api from "@api";
import endPoints from "@endPoints";
import {
  setCatalogItems,
  setCategories,
  setMembersList,
  setTags,
  setTopSellingCatalogItems,
  setFilters,
  setSalesList,
  setCashRegisters,
  setCurrentCashRegister,
  setRegisterStatusList,
  setRegisterSummaryList,
} from "./pointOfSaleSlice";
import { showToastAction } from "../common/commonActions";

const getPosCategories = (setLoading) => async (dispatch, getState) => {
  let existingCategories = getState().pos.categories;

  if (!existingCategories.length) {
    if (setLoading) setLoading(true);
  }
  const res = await api("get", endPoints.POS.CATEGORIES);
  if (res.success) {
    dispatch(setCategories(res.data));
  }
  if (setLoading) setLoading(false);
};

const getTopSellingCatalogItems = () => async (dispatch, getState) => {
  let existingTopSellingItems = getState().pos.topSellingCatalogItems;

  if (existingTopSellingItems.length) {
    return;
  }

  const res = await api("get", endPoints.POS.TOP_SELLING_CATALOG_ITEMS);
  if (res.success) {
    dispatch(setTopSellingCatalogItems(res.data || []));
  }
};

const getCatalogItems = (setLoading) => async (dispatch, getState) => {
  let existing = getState().pos.catalogItems;

  if (!existing.length) {
    if (setLoading) setLoading(true);
  }
  const res = await api("get", endPoints.POS.CATALOG_ITEMS);
  if (res.success) {
    dispatch(setCatalogItems(res.data));
  }
  if (setLoading) setLoading(false);
};

const getMembersList = (setLoading) => async (dispatch, getState) => {
  let existing = getState().pos.membersList;
  if (!existing.length) {
    if (setLoading) setLoading(true);
  }
  const res = await api("get", endPoints.POS.MEMBERS_LIST);
  if (res.success) {
    dispatch(setMembersList(res.data));
  }
  if (setLoading) setLoading(false);
};

const getFilters = (setLoading) => async (dispatch, getState) => {
  let existing = getState().pos.filters;
  if (!existing.length) {
    if (setLoading) setLoading(true);
  }
  const res = await api("get", endPoints.POS.FILTERS);
  if (res.success) {
    dispatch(setFilters(res.data));
  }
  if (setLoading) setLoading(false);
};
const getTags = (setLoading) => async (dispatch, getState) => {
  let existing = getState().pos.tags;
  if (!existing.length) {
    if (setLoading) setLoading(true);
  }
  const res = await api("get", endPoints.POS.TAGS);
  if (res.success) {
    dispatch(setTags(res.data));
  }
  if (setLoading) setLoading(false);
};

const createSale = (setLoading, data, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("post", endPoints.POS.SALE, data);
  if (res.success) {
    if (next) next(res.data);
    dispatch(showToastAction({ description: res.message, type: "success" }));
    dispatch(getMembersList());
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
};
const getSaleById = (id, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);

  const res = await api("get", `${endPoints.POS.SALE}/${id}`);

  if (res.success) {
    if (next) next(res.data);
  } else {
    dispatch(
      showToastAction({
        description: res.message,
        type: "error",
      })
    );
  }

  if (setLoading) setLoading(false);
  return res;
};


const getCashRegisters = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.POS.REGISTER);
  if (res.success) {
    dispatch(setCashRegisters(res.data));
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
};

const getCashRegisterById = (id, setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", `${endPoints.POS.REGISTER}/${id}`);
  if (res.success) {
    dispatch(setCurrentCashRegister(res.data));
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
  return res;
};

const startRegisterSession = (data, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);

  const res = await api(
    "post",
    endPoints.POS.REGISTER_START,
    data
  );

  if (res.success) {
    dispatch(showToastAction({
      description: res.message,
      type: "success",
    }));
    if (next) next(res.data);
  } else {
    dispatch(showToastAction({
      description: res.message,
      type: "error",
    }));
  }

  if (setLoading) setLoading(false);
  return res;
};

const endRegisterSession = (data, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);

  const res = await api(
    "post",
    endPoints.POS.REGISTER_END, // 👈 THIS WAS THE MISSING LINK
    data
  );

  if (res.success) {
    dispatch(showToastAction({
      description: res.message || "Register closed successfully",
      type: "success",
    }));

    if (next) next(res.data);
  } else {
    dispatch(showToastAction({
      description: res.message,
      type: "error",
    }));
  }

  if (setLoading) setLoading(false);
  return res;
};

const getAllRegisterStatus = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("post", endPoints.POS.REGISTER_STATUS); 
  if (res.success) {
    dispatch(setRegisterStatusList(res.data));
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
};

const getAllRegisterSummary = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("post", endPoints.POS.REGISTER);
  if (res.success) {
    dispatch(setRegisterSummaryList(res.data));
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
};

const getSalesList = (setLoading) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.POS.SALE);
  if (res.success) {
    dispatch(setSalesList(res.data));
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
};

const voidSale = (id, data, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);

  const res = await api("put", `${endPoints.POS.SALE}/void/${id}`, data);

  if (res.success) {
    dispatch(showToastAction({ description: res.message, type: "success" }));
    dispatch(getMembersList());
    if (next) next(res.data);
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }

  if (setLoading) setLoading(false);
  return res;
};

const validatePromoCode = (promoCode, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("post", endPoints.POS.VALIDATE_PROMO_CODE, { promoCode });
  if (res.success) {
    const disc = res.data;
    const transformed = {
      _id: disc._id,
      discountCode: disc.discountCode,
      title: disc.title,
      amount: disc.amount?.value ?? disc.amount,
      amountType: disc.amount?.unit === "PERCENT" ? "PERCENTAGE" : "FIXED",
      canBeCombined: disc.canBeCombined ?? false,
      services: disc.services || [],
    };
    if (next) next(transformed);
    dispatch(showToastAction({ description: res.message, type: "success" }));
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
};

const validateSalesCode = (salesCode, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("post", endPoints.POS.VALIDATE_SALES_CODE, { salesCode });
  if (res.success) {
    const salesData = res.data;
    const normalizedDiscounts = (salesData.discounts || []).map((disc) => ({
      _id: disc._id,
      discountCode: disc.discountCode,
      title: disc.title,
      amount: disc.amount?.value ?? disc.amount,
      amountType: disc.amount?.unit === "PERCENT" ? "PERCENTAGE" : "FIXED",
      canBeCombined: disc.canBeCombined ?? false,
      services: disc.services || [],
      isThisItemBogo: disc.isThisItemBogo ?? false,
      bogoItems: disc.bogoItems || [],
    }));
    if (next) next({ ...salesData, discounts: normalizedDiscounts });
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
};

const validatePromoOrSalesCode = (code, setLoading, onPromoSuccess, onSalesCodeSuccess) => async (dispatch) => {
  if (setLoading) setLoading(true);
  // Try as promo code first
  const promoRes = await api("post", endPoints.POS.VALIDATE_PROMO_CODE, { promoCode: code });
  if (promoRes.success) {
    const disc = promoRes.data;
    const transformed = {
      _id: disc._id,
      discountCode: disc.discountCode,
      title: disc.title,
      amount: disc.amount?.value ?? disc.amount,
      amountType: disc.amount?.unit === "PERCENT" ? "PERCENTAGE" : "FIXED",
      canBeCombined: disc.canBeCombined ?? false,
      services: disc.services || [],
    };
    if (onPromoSuccess) onPromoSuccess(transformed);
    dispatch(showToastAction({ description: promoRes.message, type: "success" }));
    if (setLoading) setLoading(false);
    return;
  }
  // Try as sales code
  const salesRes = await api("post", endPoints.POS.VALIDATE_SALES_CODE, { salesCode: code });
  if (salesRes.success) {
    const salesData = salesRes.data;
    const normalizedDiscounts = (salesData.discounts || []).map((disc) => ({
      _id: disc._id,
      discountCode: disc.discountCode,
      title: disc.title,
      amount: disc.amount?.value ?? disc.amount,
      amountType: disc.amount?.unit === "PERCENT" ? "PERCENTAGE" : "FIXED",
      canBeCombined: disc.canBeCombined ?? false,
      services: disc.services || [],
      isThisItemBogo: disc.isThisItemBogo ?? false,
      bogoItems: disc.bogoItems || [],
    }));
    if (onSalesCodeSuccess) onSalesCodeSuccess({ ...salesData, discounts: normalizedDiscounts });
    dispatch(showToastAction({ description: salesRes.message, type: "success" }));
  } else {
    dispatch(showToastAction({ description: "Invalid promo code or sales code!", type: "error" }));
  }
  if (setLoading) setLoading(false);
};

const validateDiscountUsage = (discountId, memberId) => async (dispatch) => {
  const res = await api("post", endPoints.POS.VALIDATE_DISCOUNT_USAGE, {
    discountId,
    memberId,
  });
  if (!res.success) {
    dispatch(showToastAction({ description: res.message, type: "error" }));
    return false;
  }
  return true;
};

const validateRedemption = (catalogItemId, memberId, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("post", endPoints.POS.VALIDATE_REDEMPTION, {
    catalogItemId,
    memberId,
  });
  if (res.success) {
    if (next) next(res.data);
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
};

const getWaiveTaxReasons = (setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", `${endPoints.SETTINGS.BUSINESS.REASON_CODE}?codeType=WAIVE_TAX`);
  if (res.success) {
    if (next) next(res.data);
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }
  if (setLoading) setLoading(false);
};

const getBalanceHistory = (memberId, setLoading, next) => async () => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.POS.BALANCE_HISTORY + memberId);
  if (res.success) {
    if (next) next(res.data);
  }
  if (setLoading) setLoading(false);
};

const returnSale = (id, data, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);

  const res = await api("put", `${endPoints.POS.SALE}/return/${id}`, data);

  if (res.success) {
    dispatch(showToastAction({ description: res.message, type: "success" }));
    dispatch(getMembersList());
    if (next) next(res.data);
  } else {
    dispatch(showToastAction({ description: res.message, type: "error" }));
  }

  if (setLoading) setLoading(false);
  return res;
};


const getPosIposCards = (memberId, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api("get", endPoints.POS.IPOS_CARDS + memberId);
  if (res.success) {
    next(res.data);
  } else {
    next([]);
  }
  if (setLoading) setLoading(false);
};

export {
  getCatalogItems,
  getPosCategories,
  getTopSellingCatalogItems,
  getMembersList,
  getFilters,
  getTags,
  createSale,
  getCashRegisters,
  getCashRegisterById,
  startRegisterSession,
  endRegisterSession,
  getAllRegisterStatus,
  getSalesList,
  getAllRegisterSummary,
  getSaleById,
  voidSale,
  returnSale,
  validatePromoCode,
  validateSalesCode,
  validatePromoOrSalesCode,
  validateDiscountUsage,
  validateRedemption,
  getWaiveTaxReasons,
  getBalanceHistory,
  getPosIposCards,
};
