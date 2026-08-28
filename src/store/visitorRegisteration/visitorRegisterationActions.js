import visitorApi from "../../services/visitorApi";
import endPoints from "@endPoints";
import { setCompany } from "./visitorRegisterationSlice";

const getCompanyDetails = (activationCode, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  try {
    const res = await visitorApi.get(endPoints.VISITOR.COMPANY_DETAILS + activationCode);
    const { success, data, message } = res.data;
    if (success) {
      dispatch(setCompany(data));
      if (next) next(data, null);
    } else {
      if (next) next(null, message);
    }
  } catch (error) {
    const message = error?.response?.data?.message || "Something went wrong.";
    if (next) next(null, message);
  }
  if (setLoading) setLoading(false);
};

const getMemberByPhone = (mobileNumber, setLoading, next) => async () => {
  if (setLoading) setLoading(true);
  try {
    const res = await visitorApi.get(endPoints.VISITOR.MEMBER_DETAILS, {
      params: { mobileNumber },
    });
    const { success, data, message } = res.data;
    if (success) {
      if (next) next(data, null);
    } else {
      if (next) next(null, message);
    }
  } catch (error) {
    const message = error?.response?.data?.message || "Member Not Found!";
    if (next) next(null, message);
  }
  if (setLoading) setLoading(false);
};

const getMemberByEmail = (email, setLoading, next) => async () => {
  if (setLoading) setLoading(true);
  try {
    const res = await visitorApi.get(endPoints.VISITOR.MEMBER_BY_EMAIL, {
      params: { email },
    });
    const { success, data, message } = res.data;
    if (success) {
      if (next) next(data, null);
    } else {
      if (next) next(null, message);
    }
  } catch (error) {
    const message = error?.response?.data?.message || "Member Not Found!";
    if (next) next(null, message);
  }
  if (setLoading) setLoading(false);
};

const registerMember = (data, setLoading, next) => async () => {
  if (setLoading) setLoading(true);
  try {
    const res = await visitorApi.post(endPoints.VISITOR.REGISTER_MEMBER, data);
    const { success, data: member, message } = res.data;
    if (success) {
      if (next) next(member, null);
    } else {
      if (next) next(null, message);
    }
  } catch (error) {
    const message = error?.response?.data?.message || "Registration failed.";
    if (next) next(null, message);
  }
  if (setLoading) setLoading(false);
};

export { getCompanyDetails, getMemberByPhone, getMemberByEmail, registerMember };
