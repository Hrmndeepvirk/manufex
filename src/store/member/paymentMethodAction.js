import api from "@api";
import endPoints from "@endPoints";

const getPaymentMethods =
  (memberId, setLoading, next) => async (dispatch) => {
    if (setLoading) setLoading(true);
    const res = await api(
      "get",
      `${endPoints.MEMBER.MEMBER}${memberId}/payment-methods`
    );

    if (res.success) {
      next(res.data);
    } else {
      next([]);
    }
    if (setLoading) setLoading(false);
  };

const addPaymentMethod =
  (memberId, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    const res = await api(
      "post",
      `${endPoints.MEMBER.MEMBER}${memberId}/payment-methods`,
      data,
    );
    if (res.success) {
      next(true, null);
    } else {
      next(null, res.message);
    }
    setLoading(false);
  };

const assignPaymentMethod =
  (memberId, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    const res = await api(
      "put",
      `${endPoints.MEMBER.MEMBER}${memberId}/payment-methods/assign`,
      data,
    );
    if (res.success) {
      next(true, null);
    } else {
      next(null, res.message);
    }
    setLoading(false);
  };

const setDefaultPaymentMethod =
  (memberId, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    const res = await api(
      "put",
      `${endPoints.MEMBER.MEMBER}${memberId}/payment-methods/set-default`,
      data,
    );
    if (res.success) {
      next(true, null);
    } else {
      next(null, res.message);
    }
    setLoading(false);
  };

export { getPaymentMethods, addPaymentMethod, assignPaymentMethod, setDefaultPaymentMethod };
