import api from "@api";
import endPoints from "@endPoints";
import { authenticate, logout } from "@services/auth";
import { setProfile, setPermissions } from "./userSlice";
import { showToastAction } from "../common/commonActions";

const loginAction = (payload, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("post", endPoints.AUTH.LOGIN, payload);
  if (res.success) {
    authenticate(res.data.token, payload.rememberMe, () => {
      dispatch(setProfile(res.data));
      dispatch(setPermissions(res.data.permissions || []));
      next();
    });
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};
const forgetPasswordAction =
  (payload, setLoading, next) => async (dispatch) => {
    setLoading(true);
    const res = await api("post", endPoints.AUTH.FORGET_PASSWORD, payload);
    if (res.success) {
      next(res.data);
    } else {
      next(null, res.formErrors);
    }

    setLoading(false);
  };
const verifyOtpAndResetPasswordAction =
  (payload, setLoading, next) => async (dispatch) => {
    setLoading(true);
    const res = await api(
      "post",
      endPoints.AUTH.CHANGE_FORGOT_PASSWORD,
      payload,
    );
    if (res.success) {
      dispatch(showToastAction({ description: res.message }));
      next();
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const userProfileAction = (setLoading) => async (dispatch) => {
  setLoading(true);
  const res = await api("get", endPoints.AUTH.PROFILE);
  if (res.success) {
    dispatch(setProfile(res.data));
    dispatch(setPermissions(res.data.permissions || []));
  } else {
    //show error toast
  }

  setLoading(false);
};

const changePasswordAction = (data, setLoading, next) => async (dispatch) => {
  setLoading(true);

  const res = await api("post", endPoints.AUTH.CHANGE_PASSWORD, data);

  if (res.success) {
    dispatch(showToastAction({ description: res.message }));
    next();
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};
const saveFcmTokenAction = (token) => async () => {
  await api("post", endPoints.AUTH.FCM, { token });
};

const deleteFcmTokenAction = (token) => async () => {
  await api("delete", endPoints.AUTH.FCM, { token });
};

const logoutAction = (navigate) => async () => {
  // Grab token before localStorage is cleared
  const fcmToken = localStorage.getItem("fcm");
  if (fcmToken) {
    await api("post", endPoints.AUTH.FCM_LOGOUT, { token: fcmToken });
  }
  logout(() => {
    navigate("/login");
  });
};

export {
  loginAction,
  forgetPasswordAction,
  verifyOtpAndResetPasswordAction,
  userProfileAction,
  changePasswordAction,
  saveFcmTokenAction,
  deleteFcmTokenAction,
  logoutAction,
};
