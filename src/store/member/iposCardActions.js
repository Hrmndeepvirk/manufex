import api from "@api";
import endPoints from "@endPoints";

const getIposCardTokens = (memberId, setLoading, next) => async (dispatch) => {
  if (setLoading) setLoading(true);
  const res = await api(
    "get",
    `${endPoints.MEMBER.IPOS_CARD_TOKENS}${memberId}/ipos-card-tokens`,
  );
  if (res.success) {
    next(res.data);
  } else {
    next([]);
  }
  if (setLoading) setLoading(false);
};

const initiateIposCardAuth =
  (memberId, data, setLoading, next) => async (dispatch) => {
    setLoading(true);
    const res = await api(
      "post",
      `${endPoints.MEMBER.IPOS_CARD_TOKENS}${memberId}/ipos-card-tokens/initiate`,
      data,
    );
    if (res.success) {
      next(true, res.data);
    } else {
      next(null, null, res.message);
    }
    setLoading(false);
  };

const setDefaultIposCard =
  (memberId, tokenId, setLoading, next) => async (dispatch) => {
    setLoading(true);
    const res = await api(
      "put",
      `${endPoints.MEMBER.IPOS_CARD_TOKENS}${memberId}/ipos-card-tokens/${tokenId}/set-default`,
    );
    if (res.success) {
      next(true);
    } else {
      next(null);
    }
    setLoading(false);
  };

export { getIposCardTokens, initiateIposCardAuth, setDefaultIposCard };
